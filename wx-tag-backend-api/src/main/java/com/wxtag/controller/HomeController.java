package com.wxtag.controller;

import com.wxtag.config.WxMiniAppProperties;
import com.wxtag.model.response.HomeResponse;
import com.wxtag.model.response.LoginResponse;
import com.wxtag.model.request.LoginRequest;
import com.wxtag.service.UserTagService;
import com.wxtag.service.WxUserService;
import com.wxtag.model.WxUserDTO;
import com.wxtag.util.JwtUtil;
import com.wxtag.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import com.wxtag.service.AiCommentService;
import com.wxtag.mapper.UserTagMapper;
import cn.binarywang.wx.miniapp.api.WxMaService;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/home")
public class HomeController {

    private static final Logger log = LoggerFactory.getLogger(HomeController.class);
    private final WxMiniAppProperties wxProperties;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserTagService userTagService;
    private final AiCommentService aiCommentService;
    private final UserTagMapper userTagMapper;
    private final WxMaService wxMaService;
    private final WxUserService wxUserService;

    @Value("${ai.comment.minTaggerCount:3}")
    private int minTaggerCount;


    /**
     * 用户微信登录后，根据当前登录用户的openid，获取首页相关的信息
     * 当前登录用户的openid从请求头中获取
     * @return
     */
    @GetMapping("/home")
    public ApiResponse<HomeResponse> home(HttpServletRequest request){
        String openId = (String) request.getAttribute("openId");
        if (openId == null) {
            log.warn("获取首页数据失败：openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            log.info("获取用户首页数据, openId: {}", openId);
            HomeResponse homeData = userTagService.getHomeData(openId);
            log.info("首页数据获取成功, openId: {}", openId);
            return ApiResponse.success(homeData);
        } catch (Exception e) {
            log.error("获取首页数据失败, openId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("获取首页数据失败");
        }
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("收到登录请求，code: {}", request.getCode());
        
        // 微信登录凭证校验接口地址
        String url = String.format("https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                wxProperties.getAppid(), wxProperties.getSecret(), request.getCode());

        try {
            // 发送请求到微信服务器
            log.debug("正在请求微信服务器进行登录验证:{}",url);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            // 手动将返回的JSON字符串转换为WxSession对象
            WxSession wxSession = objectMapper.readValue(response.getBody(), WxSession.class);
            log.debug("微信返回数据：{}", response.getBody());

            // 先检查是否有错误
            if (wxSession != null && wxSession.getErrcode() != null && wxSession.getErrcode() != 0) {
                log.error("登录失败，微信返回错误：code={}, msg={}", 
                        wxSession.getErrcode(), wxSession.getErrmsg());
                        
                // 尝试提取并查询rid
                try {
                    String rid = extractRidFromErrMsg(wxSession.getErrmsg());
                    if (rid != null) {
                        log.info("检测到错误rid，准备查询详情：{}", rid);
                        queryWxErrorByRid(rid);
                    }
                } catch (Exception e) {
                    log.warn("查询微信错误信息失败", e);
                }
                
                return ApiResponse.fail("登录失败：" + wxSession.getErrmsg());
            }

            // 检查openid是否存在
            if (wxSession == null || wxSession.getOpenid() == null) {
                log.error("登录失败：未获取到openid");
                return ApiResponse.fail("登录失败，请稍后重试");
            }

            // 生成token
            String token = jwtUtil.generateToken(wxSession.getOpenid());
            
            // 查询用户信息
            WxUserDTO userInfo = wxUserService.getUserByOpenId(wxSession.getOpenid());
            
            // 构建响应
            LoginResponse loginResponse = LoginResponse.builder()
                    .token(token)
                    .openid(wxSession.getOpenid())
                    .nickName(userInfo != null ? userInfo.getNickName() : null)
                    .avatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
                    .build();
            
            log.info("登录成功，已生成 token");
            return ApiResponse.success(loginResponse, "登录成功");

        } catch (Exception e) {
            log.error("处理微信登录请求时发生错误", e);
            return ApiResponse.fail("登录失败，系统错误");
        }
    }

    /**
     * 从微信错误消息中提取rid
     */
    private String extractRidFromErrMsg(String errMsg) {
        if (errMsg == null || errMsg.isEmpty()) {
            return null;
        }
        
        // 匹配格式: rid: xxxx-xxxx-xxxx
        int ridIndex = errMsg.lastIndexOf("rid:");
        if (ridIndex != -1) {
            return errMsg.substring(ridIndex + 4).trim();
        }
        return null;
    }
    
    /**
     * 查询微信错误rid详情
     */
    private void queryWxErrorByRid(String rid) {
        try {
            log.info("开始查询微信错误信息，rid: {}", rid);
            
            // 获取小程序access_token
            String accessToken = wxMaService.getAccessToken();
            
            // 构建请求体
            String requestBody = String.format("{\"rid\":\"%s\"}", rid);
            
            // 发送请求
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.weixin.qq.com/cgi-bin/openapi/rid/get?access_token=" + accessToken,
                requestBody,
                String.class
            );
            
            // 记录查询结果
            log.info("微信错误详情查询结果: {}", response.getBody());
        } catch (Exception e) {
            log.error("查询微信错误详情失败, rid: {}, 错误: {}", rid, e.getMessage(), e);
        }
    }

    @PostMapping("/generateAiComment")
    public ApiResponse<String> generateAiComment(HttpServletRequest request) {
        String openId=(String) request.getAttribute("openId");
        try {
            log.info("生成AI评语请求，openId: {}", openId);
            
            // 获取给用户打标签的人数
            Integer taggerCount = userTagMapper.countTaggersByOpenid(openId);
            
            // 检查评价人数是否达到最低要求
            if (taggerCount == null || taggerCount < minTaggerCount) {
                log.info("评价人数不足，无法生成AI评语，openId: {}, 当前评价人数: {}, 最低要求: {}",
                        openId, taggerCount, minTaggerCount);
                return ApiResponse.fail("评价人数不足，至少需要" + minTaggerCount + "人评价才能生成AI评语");
            }
            
            String aiComment = aiCommentService.generateAiComment(openId);
            log.info("AI评语生成成功，openId: {}", openId);
            return ApiResponse.success(aiComment, "AI评语生成成功");
        } catch (Exception e) {
            log.error("生成AI评语失败, openId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("生成AI评语失败");
        }
    }

    @lombok.Data
    static class WxSession {
        private String openid;
        private String session_key;
        private String unionid;
        private Integer errcode;
        private String errmsg;
    }
} 