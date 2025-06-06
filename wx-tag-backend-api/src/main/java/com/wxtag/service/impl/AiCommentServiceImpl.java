package com.wxtag.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.wxtag.config.AliCloudProperties;
import com.wxtag.entity.UserAnalysis;
import com.wxtag.mapper.UserAnalysisMapper;
import com.wxtag.mapper.UserTagMapper;
import com.wxtag.model.InvitationDTO;
import com.wxtag.service.AiCommentService;
import com.wxtag.service.InvitationService;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;


@Service
public class AiCommentServiceImpl implements AiCommentService {
    
    private static final Logger logger = LoggerFactory.getLogger(AiCommentServiceImpl.class);
    
    @Autowired
    private UserTagMapper userTagMapper;
    
    @Autowired
    private UserAnalysisMapper userAnalysisMapper;
    
    @Autowired
    private AliCloudProperties aliCloudProperties;
    
    @Autowired
    private InvitationService invitationService;
    
    
    private final OkHttpClient httpClient;
    
    public AiCommentServiceImpl() {
        // 创建OkHttpClient，设置超时时间
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();
    }
        
    @Override
    @Transactional
    public String generateAiComment(String openId) {
        logger.info("开始生成AI评语, openId: {}", openId);
        
        try {
            // 1. 查询用户标签和数量
            List<Map<String, Object>> tagCounts = userTagMapper.countTagsByOpenid(openId);
            if (tagCounts == null || tagCounts.isEmpty()) {
                logger.warn("用户没有收到任何标签, openId: {}", openId);
                return "暂时还没有收到足够的标签，无法生成评语哦~";
            }
            
            
            // 2. 构建提示词
            StringBuilder prompt = new StringBuilder();
            prompt.append("你是一个善于观察和总结的AI助手，请根据以下标签信息，生成一段温暖真诚的评语。每个标签后面的数字代表被贴上这个标签的次数：\n");
            
            for (Map<String, Object> tagCount : tagCounts) {
                String tagName = (String) tagCount.get("tag_name");
                Integer count = ((Number) tagCount.get("tag_count")).intValue();
                prompt.append(tagName).append("(").append(count).append("次), ");
            }
            
            // 3. 调用大模型生成评语
            String aiContent = generateAiContentFromLLM(prompt.toString());
            if (aiContent == null || aiContent.trim().isEmpty()) {
                logger.error("大模型返回的评语为空, openId: {}", openId);
                return "抱歉，生成评语时出现了问题，请稍后再试~";
            }
            
            // 4. 保存或更新到数据库
            UserAnalysis latestAnalysis = userAnalysisMapper.selectLatestByOpenId(openId);
            
            // 获取用户当前的邀请信息
            InvitationDTO invitationDTO = invitationService.getInvitationStatusByOpenid(openId);
            String invitationUuid = invitationDTO != null ? invitationDTO.getInvitationUuid() : null;
            
            if (invitationUuid == null) {
                logger.warn("用户没有进行中的邀请，无法生成评语, openId: {}", openId);
                return "抱歉，您当前没有有效的邀请，无法生成评语~";
            }
            
            if (latestAnalysis != null) {
                // 更新现有评语
                latestAnalysis.setAnalysisContent(aiContent);
                latestAnalysis.setInvitationUuid(invitationUuid); // 确保更新时也设置邀请UUID
                latestAnalysis.setUpdatedAt(new Date());
                userAnalysisMapper.update(latestAnalysis);
                logger.info("更新AI评语成功, openId: {}, analysisId: {}, invitationUuid: {}", openId, latestAnalysis.getId(), invitationUuid);
            } else {
                // 创建新的评语记录
                UserAnalysis analysis = new UserAnalysis();
                analysis.setAnalysisUuid(UUID.randomUUID().toString());
                analysis.setOpenId(openId);
                analysis.setInvitationUuid(invitationUuid); // 设置邀请UUID
                analysis.setAnalysisContent(aiContent);
                analysis.setCreatedAt(new Date());
                analysis.setUpdatedAt(new Date());
                userAnalysisMapper.insert(analysis);
                logger.info("新增AI评语成功, openId: {}, analysisUuid: {}, invitationUuid: {}", openId, analysis.getAnalysisUuid(), invitationUuid);
            }
            
            return aiContent;
            
        } catch (Exception e) {
            logger.error("生成AI评语时发生错误, openId: {}", openId, e);
            return "抱歉，生成评语时出现了问题，请稍后再试~";
        }
    }
    
    /**
     * 调用阿里云通义千问大模型生成评语
     */
    private String generateAiContentFromLLM(String prompt) {
        try {
            // 1. 准备请求URL
            String apiUrl = aliCloudProperties.getApiUrl();
            
            // 2. 构建请求JSON
            JSONObject requestBody = new JSONObject();
            requestBody.put("model", aliCloudProperties.getModelName());
            
            // 设置参数
            JSONObject parameters = new JSONObject();
            parameters.put("temperature", aliCloudProperties.getTemperature());
            parameters.put("max_tokens", aliCloudProperties.getMaxTokens());
            requestBody.put("parameters", parameters);
            
            // 构建消息数组
            JSONArray messages = new JSONArray();
            
            // 系统提示词
            JSONObject systemMessage = new JSONObject();
            systemMessage.put("role", "system");
            systemMessage.put("content", "你是一个善于观察和总结的AI助手，擅长根据用户收到的标签信息生成温暖真诚的个人评语。请用温和、积极、鼓励的语调，以第二人称生成一段100-200字的个人评语。");
            messages.add(systemMessage);
            
            // 用户输入
            JSONObject userMessage = new JSONObject();
            userMessage.put("role", "user");
            userMessage.put("content", buildPromptContent(prompt));
            messages.add(userMessage);
            
            requestBody.put("input", new JSONObject().fluentPut("messages", messages));
            
            // 3. 构建HTTP请求
            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"), 
                    requestBody.toJSONString()
            );
            
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .post(body)
                    .addHeader("Authorization", "Bearer " + aliCloudProperties.getApiKey())
                    .addHeader("Content-Type", "application/json")
                    .build();
            
            // 4. 执行请求
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    logger.error("调用阿里云通义千问API失败, 状态码: {}", response.code());
                    if (response.body() != null) {
                        logger.error("错误响应: {}", response.body().string());
                    }
                    return null;
                }
                
                // 5. 解析响应
                if (response.body() != null) {
                    String responseBody = response.body().string();
                    logger.info("阿里云通义千问API响应: {}", responseBody);
                    
                    JSONObject jsonResponse = JSON.parseObject(responseBody);
                    JSONObject output = jsonResponse.getJSONObject("output");
                    if (output != null) {
                        // 直接从output中获取text字段
                        String content = output.getString("text");
                        if (content != null && !content.isEmpty()) {
                            logger.info("通义千问生成评语成功，内容长度: {}", content.length());
                            return content;
                        }
                        
                        // 兼容可能的choices数组格式
                        JSONArray choices = output.getJSONArray("choices");
                        if (choices != null && !choices.isEmpty()) {
                            JSONObject choice = choices.getJSONObject(0);
                            JSONObject message = choice.getJSONObject("message");
                            if (message != null) {
                                content = message.getString("content");
                                logger.info("通义千问生成评语成功，内容长度: {}", content.length());
                                return content;
                            }
                        }
                    }
                }
            }
            
            logger.error("解析阿里云通义千问API响应失败");
            return null;
            
        } catch (IOException e) {
            logger.error("调用阿里云通义千问API时发生IO错误: {}", e.getMessage(), e);
            return null;
        } catch (Exception e) {
            logger.error("调用阿里云通义千问API时发生未知错误: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * 构建更友好的提示词内容
     */
    private String buildPromptContent(String originalPrompt) {
        StringBuilder enhancedPrompt = new StringBuilder();
        enhancedPrompt.append("请根据以下用户收到的标签信息，为这位用户生成一段个性化的评语：\n\n");
        enhancedPrompt.append(originalPrompt);
        enhancedPrompt.append("\n\n请生成一段温暖、真诚、积极向上的评语，字数控制在100-200字之间。评语应该：\n");
        enhancedPrompt.append("1. 突出用户的优点和特质\n");
        enhancedPrompt.append("2. 语调温和友善，充满正能量\n");
        enhancedPrompt.append("3. 适合在社交场景中分享\n");
        enhancedPrompt.append("4. 避免过于夸张或不真实的表达");
        
        return enhancedPrompt.toString();
    }
}