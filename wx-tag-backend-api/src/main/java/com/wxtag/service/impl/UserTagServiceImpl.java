package com.wxtag.service.impl;

import com.wxtag.entity.Invitation;
import com.wxtag.entity.UserTagDetail;
import com.wxtag.entity.UserTagSummary;
import com.wxtag.entity.WxUser;
import com.wxtag.entity.Tag;
import com.wxtag.entity.UserAnalysis;
import com.wxtag.mapper.InvitationMapper;
import com.wxtag.mapper.UserTagMapper;
import com.wxtag.mapper.WxUserMapper;
import com.wxtag.mapper.TagMapper;
import com.wxtag.mapper.UserAnalysisMapper;
import com.wxtag.model.TagVO;
import com.wxtag.model.UserTagSummaryDTO;
import com.wxtag.model.request.TagUserRequest;
import com.wxtag.model.response.HomeResponse;
import com.wxtag.model.response.TagCountDTO;
import com.wxtag.model.response.TagForFriendsResponse;
import com.wxtag.model.response.UserTagHomeResponse;
import com.wxtag.model.response.UserReceiveTagsResponse;
import com.wxtag.service.UserTagService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 用户标签服务实现类
 */
@Service
public class UserTagServiceImpl implements UserTagService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserTagServiceImpl.class);
    
    @Autowired
    private UserTagMapper userTagMapper;
    
    @Autowired
    private WxUserMapper wxUserMapper;
    
    @Autowired
    private InvitationMapper invitationMapper;
    
    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private UserAnalysisMapper userAnalysisMapper;

    
    @Value("${ai.comment.minTaggerCount:3}")
    private int minTaggerCount;
    
    @Override
    public List<UserTagSummaryDTO> getUserGivenTags(String openid) {
        logger.info("获取用户给他人的标签, openid: {}", openid);
        List<UserTagSummary> summaries = userTagMapper.selectGivenTagsByOpenid(openid);
        return convertToDTO(summaries);
    }
    
    @Override
    public List<UserTagSummaryDTO> getUserReceiveTags(String openid) {
        logger.info("获取用户收到的标签, openid: {}", openid);
        List<UserTagSummary> summaries = userTagMapper.selectReceivedTagsByOpenid(openid);
        return convertToDTO(summaries);
    }
    
    @Override
    public List<UserTagSummaryDTO> getTagsByInvitationId(Long invitationId) {
        logger.info("根据邀请ID获取标签, invitationId: {}", invitationId);
        List<UserTagSummary> summaries = userTagMapper.selectTagsByInvitationId(invitationId);
        return convertToDTO(summaries);
    }
    
    @Override
    @Transactional
    public UserTagSummaryDTO tagUser(String taggerOpenid, TagUserRequest request) {
        logger.info("给用户打标签, taggerOpenid: {}, invitationUuid: {}", taggerOpenid, request.getInvitationUuid());
        
        // 根据邀请UUID获取邀请信息
        Invitation invitation = invitationMapper.selectByInvitationCode(request.getInvitationUuid());
        if (invitation == null) {
            throw new RuntimeException("邀请任务不存在");
        }
        
        // 获取打标签的用户信息
        WxUser tagger = wxUserMapper.selectByOpenId(taggerOpenid);
        if (tagger == null) {
            throw new RuntimeException("打标签用户不存在");
        }
        
        // 获取被标记的用户信息
        WxUser targetUser = wxUserMapper.selectByOpenId(invitation.getOpenid());
        if (targetUser == null) {
            throw new RuntimeException("被标记用户不存在");
        }
        
        // 生成UUID
        String userTagSummaryUuid = UUID.randomUUID().toString();
        
        // 保存标签明细
        for (String tagName : request.getTags()) {
            UserTagDetail detail = new UserTagDetail();
            detail.setUserTagSummaryUuid(userTagSummaryUuid);
            detail.setOpenid(invitation.getOpenid());
            detail.setTaggerOpenid(taggerOpenid);
            detail.setTagUuid(UUID.randomUUID().toString());
            detail.setTagName(tagName);
            detail.setInvitationUuid(request.getInvitationUuid());
            detail.setCreatedAt(new Date());
            detail.setUpdatedAt(new Date());
            
            userTagMapper.insertDetail(detail);
        }
        
        // 保存标签汇总
        UserTagSummary summary = new UserTagSummary();
        summary.setUserTagSummaryUuid(userTagSummaryUuid);
        summary.setOpenid(invitation.getOpenid());
        summary.setNickname(targetUser.getNickname());
        summary.setAvatarUrl(targetUser.getAvatarUrl());
        summary.setTaggerOpenid(taggerOpenid);
        summary.setTaggerNickname(tagger.getNickname());
        summary.setTaggerAvatarUrl(tagger.getAvatarUrl());
        summary.setInvitationUuid(request.getInvitationUuid());
        summary.setTagSummary(String.join(",", request.getTags()));
        summary.setCreatedAt(new Date());
        summary.setUpdatedAt(new Date());
        
        userTagMapper.insertSummary(summary);
        
        // 转换为DTO返回
        UserTagSummaryDTO dto = new UserTagSummaryDTO();
        BeanUtils.copyProperties(summary, dto);
        dto.setTags(request.getTags());
        
        return dto;
    }
    
    @Override
    public HomeResponse getHomeData(String openid) {
        logger.info("获取首页数据, openid: {}", openid);
        
        HomeResponse response = new HomeResponse();
        
        // 获取总标签数
        Integer totalCount = userTagMapper.countTotalTagsByOpenid(openid);
        response.setTagCount(totalCount != null ? totalCount : 0);
        
        // 获取标签统计
        List<Map<String, Object>> tagCounts = userTagMapper.countTagsByOpenid(openid);
        List<TagCountDTO> tagCountDTOs = new ArrayList<>();
        
        for (Map<String, Object> tagCountMap : tagCounts) {
            TagCountDTO dto = new TagCountDTO();
            dto.setTagName((String) tagCountMap.get("tag_name"));
            dto.setTagCount(((Number) tagCountMap.get("tag_count")).intValue());
            tagCountDTOs.add(dto);
        }
        
        // 检查用户是否给自己打过标签
        Integer selfTagCount = userTagMapper.countSelfTags(openid);
        response.setHasTaggedForMySelf(selfTagCount != null && selfTagCount > 0);
        response.setMinAiTaggerCount(minTaggerCount);
        // 获取给我打标签人的数量
        Integer taggerCount = userTagMapper.countTaggersByOpenid(openid);
        response.setTaggerCount(taggerCount != null ? taggerCount : 0);
        
        // 获取AI评语 - 从user_analysis表根据openid获取最新的AI评语
        String aiContent = null;
        try {
            UserAnalysis userAnalysis = userAnalysisMapper.selectLatestByOpenId(openid);
            if (userAnalysis != null && userAnalysis.getAnalysisContent() != null) {
                aiContent = userAnalysis.getAnalysisContent();
            }
            logger.info("获取AI评语成功, openid: {}, 是否有评语: {}", openid, aiContent != null);
        } catch (Exception e) {
            logger.warn("获取AI评语失败, openid: {}, 错误: {}", openid, e.getMessage());
        }
        
        response.setAiContent(aiContent);
        response.setMyTagsCount(tagCountDTOs);
        
        return response;
    }
    
    @Override
    public UserTagHomeResponse getTagHomeData(String invitationCode,String openId) {
        logger.info("获取打标签页面数据, invitationCode: {}", invitationCode);
        
        // 首先检查用户是否已经对这个邀请打过标签
        Integer tagCount = userTagMapper.countTagsByTaggerAndInvitation(openId, invitationCode);

        // 根据邀请码获取邀请信息
        Invitation invitation = invitationMapper.selectByInvitationCode(invitationCode);
        if (invitation == null || invitation.getStatus() != 1) {
            return null;
        }
        
        
        UserTagHomeResponse response = new UserTagHomeResponse();
        response.setNickname(invitation.getNickname());
        response.setAvatarUrl(invitation.getAvatarUrl());
        response.setHasTagged(tagCount != null && tagCount > 0);
        response.setOpenid(invitation.getOpenid());
        
        // 获取所有标签
        response.setTags(getAllTags());
        
        return response;
    }
    
    @Override
    public List<TagVO> getAllTags() {
        logger.info("获取所有标签");
        
        List<Tag> tags = tagMapper.selectAll();
        
        // 按分类分组
        Map<String, List<String>> categoryMap = tags.stream()
                .collect(Collectors.groupingBy(
                        tag -> tag.getCategory() != null ? tag.getCategory() : "默认",
                        Collectors.mapping(Tag::getTagName, Collectors.toList())
                ));
        
        List<TagVO> tagVOs = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : categoryMap.entrySet()) {
            TagVO tagVO = new TagVO();
            tagVO.setCategory(entry.getKey());
            tagVO.setTags(entry.getValue());
            tagVOs.add(tagVO);
        }
        
        return tagVOs;
    }
    
    @Override
    public UserReceiveTagsResponse getUserReceiveTagsResponse(String openid) {
        logger.info("获取用户收到的标签响应数据, openid: {}", openid);
        
        UserReceiveTagsResponse response = new UserReceiveTagsResponse();
        
        // 获取用户收到的标签列表
        List<UserTagSummaryDTO> userTagSummaryList = getUserReceiveTags(openid);
        response.setUserTagSummaryList(userTagSummaryList);
        
        // 获取收到的标签总数
        Integer tagCount = userTagMapper.countTotalTagsByOpenid(openid);
        response.setTagCount(tagCount != null ? tagCount : 0);
        
        // 获取给该用户打标签的不同用户数量
        Integer tagUserCount = userTagMapper.countTaggersByOpenid(openid);
        response.setTagUserCount(tagUserCount != null ? tagUserCount : 0);
        
        // 获取AI评语
        String aiContent = null;
        try {
            UserAnalysis userAnalysis = userAnalysisMapper.selectLatestByOpenId(openid);
            if (userAnalysis != null && userAnalysis.getAnalysisContent() != null) {
                aiContent = userAnalysis.getAnalysisContent();
            }
            logger.info("获取AI评语成功, openid: {}, 是否有评语: {}", openid, aiContent != null);
        } catch (Exception e) {
            logger.warn("获取AI评语失败, openid: {}, 错误: {}", openid, e.getMessage());
        }
        response.setAiContent(aiContent);
        
        logger.info("用户收到的标签响应数据获取成功, openid: {}, 标签数: {}, 用户数: {}", 
                    openid, response.getTagCount(), response.getTagUserCount());
        
        return response;
    }
    
    /**
     * 朋友标签页面
     * @param taggerOpenId 打标签人openid，我的openid
     * @param openid 朋友的openid
     */
    @Override
    public TagForFriendsResponse getTagForFriendsResponse(String taggerOpenId,String openid) {
        logger.info("获取朋友标签情况, taggerOpenId: {}, friendOpenId: {}", taggerOpenId, openid);
        
        TagForFriendsResponse response = new TagForFriendsResponse();
        
        // 1. 获取朋友收到的总标签数
        Integer tagCount = userTagMapper.countTotalTagsByOpenid(openid);
        response.setTagCount(tagCount != null ? tagCount : 0);
        
        // 2. 获取给朋友打标签的不同用户数量
        Integer tagUserCount = userTagMapper.countTaggersByOpenid(openid);
        response.setTagUserCount(tagUserCount != null ? tagUserCount : 0);
        
        // 3. 获取我给他打的标签列表
        List<String> myTags = userTagMapper.selectTagsByTaggerAndOpenid(taggerOpenId, openid);
        response.setTags(myTags != null ? myTags : new ArrayList<>());
        logger.info("我给朋友打的标签查询结果: taggerOpenId={}, friendOpenId={}, tags={}", 
                    taggerOpenId, openid, myTags);
        
        // 4. 获取朋友的标签数量明细
        List<Map<String, Object>> tagCounts = userTagMapper.countTagsByOpenid(openid);
        List<TagCountDTO> tagCountDTOs = new ArrayList<>();
        
        logger.info("朋友标签数量明细查询结果: friendOpenId={}, tagCounts={}", openid, tagCounts);
        
        for (Map<String, Object> tagCountMap : tagCounts) {
            TagCountDTO dto = new TagCountDTO();
            dto.setTagName((String) tagCountMap.get("tag_name"));
            dto.setTagCount(((Number) tagCountMap.get("tag_count")).intValue());
            tagCountDTOs.add(dto);
            logger.debug("处理标签统计: tagName={}, tagCount={}", dto.getTagName(), dto.getTagCount());
        }
        response.setTagCountList(tagCountDTOs);
        
        // 5. 获取AI评语
        String aiContent = null;
        try {
            UserAnalysis userAnalysis = userAnalysisMapper.selectLatestByOpenId(openid);
            // 如果openid和taggerOpenId不是同一个，则获取朋友的AI评语，则需要用第三人称
            if (userAnalysis != null && userAnalysis.getAnalysisContent() != null && !openid.equals(taggerOpenId)) {
                // 将第二人称"你"替换为第三人称"Ta"
                aiContent = userAnalysis.getAnalysisContent().replace("你", "Ta");
            }
            logger.info("获取朋友AI评语成功, friendOpenId: {}, 是否有评语: {}", openid, aiContent != null);
        } catch (Exception e) {
            logger.warn("获取朋友AI评语失败, friendOpenId: {}, 错误: {}", openid, e.getMessage());
        }
        response.setAiContent(aiContent);
        
        logger.info("朋友标签情况获取成功, friendOpenId: {}, 标签数: {}, 用户数: {}, 我给他的标签数: {}", 
                    openid, response.getTagCount(), response.getTagUserCount(), response.getTags().size());
        
        return response;
    }
    
    private List<UserTagSummaryDTO> convertToDTO(List<UserTagSummary> summaries) {
        List<UserTagSummaryDTO> dtos = new ArrayList<>();
        
        for (UserTagSummary summary : summaries) {
            UserTagSummaryDTO dto = new UserTagSummaryDTO();
            BeanUtils.copyProperties(summary, dto);
            
            // 将标签汇总字符串转换为标签列表
            if (summary.getTagSummary() != null) {
                dto.setTags(Arrays.asList(summary.getTagSummary().split(",")));
            }
            
            dtos.add(dto);
        }
        
        return dtos;
    }
} 