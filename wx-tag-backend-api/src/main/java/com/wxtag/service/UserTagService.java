package com.wxtag.service;

import com.wxtag.model.TagVO;
import com.wxtag.model.UserTagSummaryDTO;
import com.wxtag.model.request.TagUserRequest;
import com.wxtag.model.response.HomeResponse;
import com.wxtag.model.response.TagForFriendsResponse;
import com.wxtag.model.response.UserTagHomeResponse;
import com.wxtag.model.response.UserReceiveTagsResponse;

import java.util.List;

/**
 * 用户标签服务接口
 */
public interface UserTagService {
    
    /**
     * 获取用户给他人的标签
     */
    List<UserTagSummaryDTO> getUserGivenTags(String openid);
    
    /**
     * 获取用户收到的标签
     */
    List<UserTagSummaryDTO> getUserReceiveTags(String openid);
    
    /**
     * 获取用户收到的标签响应数据
     */
    UserReceiveTagsResponse getUserReceiveTagsResponse(String openid);
    
    /**
     * 获取朋友的标签情况
     */
    TagForFriendsResponse getTagForFriendsResponse(String taggerOpenId,String openid);
    
    /**
     * 根据邀请ID获取标签
     */
    List<UserTagSummaryDTO> getTagsByInvitationId(Long invitationId);
    
    /**
     * 给用户打标签
     */
    UserTagSummaryDTO tagUser(String taggerOpenid, TagUserRequest request);
    
    /**
     * 获取首页数据
     */
    HomeResponse getHomeData(String openid);
    
    /**
     * 获取打标签页面数据
     */
    UserTagHomeResponse getTagHomeData(String invitationCode,String openId);
    
    /**
     * 获取所有标签
     */
    List<TagVO> getAllTags();
} 