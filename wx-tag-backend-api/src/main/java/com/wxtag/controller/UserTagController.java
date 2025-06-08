package com.wxtag.controller;

import com.alibaba.fastjson.JSON;
import com.wxtag.common.ApiResponse;
import com.wxtag.model.UserTagSummaryDTO;
import com.wxtag.model.request.TagUserRequest;
import com.wxtag.model.response.TagForFriendsResponse;
import com.wxtag.model.response.UserReceiveTagsResponse;
import com.wxtag.model.response.UserTagHomeResponse;
import com.wxtag.service.UserTagService;
import com.wxtag.mapper.UserTagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 用户标签控制器
 */
@RestController
@RequestMapping("/user-tags")
public class UserTagController {

    private static final Logger logger = LoggerFactory.getLogger(UserTagController.class);

    @Autowired
    private UserTagService userTagService;
    
    @Autowired
    private UserTagMapper userTagMapper;
    
    /**
     * 打标签页面，获取被打标签的信息及标签列表
     * @param invitationCode
     * @return
     */
    @GetMapping("/home")
    public ApiResponse<UserTagHomeResponse> tagHome(@RequestParam String invitationCode, HttpServletRequest request){
        logger.info("获取打标签页面数据, invitationCode: {}", invitationCode);
        
        // 获取当前用户openId
        String openId = (String) request.getAttribute("openId");
        if (openId == null) {
            logger.warn("获取打标签页面数据失败：openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            
            UserTagHomeResponse response = userTagService.getTagHomeData(invitationCode,openId);
            
            if (response != null) {
                logger.info("打标签页面数据获取成功: {},{}",invitationCode, openId);
                return ApiResponse.success(response);
            } else {
                logger.warn("邀请码无效或已过期, invitationCode: {}", invitationCode);
                return ApiResponse.fail("邀请码无效或已过期");
            }
        } catch (Exception e) {
            logger.error("获取打标签页面数据失败, invitationCode: {}, 错误: {}", invitationCode, e.getMessage(), e);
            return ApiResponse.fail("获取打标签页面数据失败");
        }
    }


    /**
     * 获取当前登录用户给他人的标签
     */
    @GetMapping("/given")
    public ApiResponse<List<UserTagSummaryDTO>> getUserGivenTags(HttpServletRequest request) {
        String openId = (String) request.getAttribute("openId");
        if (openId == null) {
            logger.warn("获取用户给他人的标签失败：openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            logger.info("获取用户给他人的标签, openId: {}", openId);
            List<UserTagSummaryDTO> tags = userTagService.getUserGivenTags(openId);
            logger.info("用户给他人的标签获取成功, openId: {}, 标签数: {}", openId, tags.size());
            return ApiResponse.success(tags);
        } catch (Exception e) {
            logger.error("获取用户给他人的标签失败, openId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("获取用户给他人的标签失败");
        }
    }

    /**
     * 获取别人给我的标签
     */
    @GetMapping("/receive")
    public ApiResponse<UserReceiveTagsResponse> getUserReceiveTags(HttpServletRequest request) {
        String openId = (String) request.getAttribute("openId");
        if (openId == null) {
            logger.warn("获取用户收到的标签失败：openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            logger.info("获取用户收到的标签, openId: {}", openId);
            UserReceiveTagsResponse response = userTagService.getUserReceiveTagsResponse(openId);
            logger.info("用户收到的标签获取成功, openId: {}, 标签数: {}, 用户数: {}", 
                       openId, response.getTagCount(), response.getTagUserCount());
            return ApiResponse.success(response);
        } catch (Exception e) {
            logger.error("获取用户收到的标签失败, openId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("获取用户收到的标签失败");
        }
    }

    /**
     * 获取openId这个朋友的标签情况
     * @param request
     * @param openId
     * @return
     */
    @GetMapping("/tag-for-friends")
    public ApiResponse<TagForFriendsResponse> getTagForFriends(HttpServletRequest request, @RequestParam String openId) {
        String currentUserOpenId = (String) request.getAttribute("openId");
        if (currentUserOpenId == null) {
            logger.warn("获取朋友标签情况失败：当前用户openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            logger.info("获取朋友标签情况, currentUserOpenId: {}, friendOpenId: {}", currentUserOpenId, openId);
            TagForFriendsResponse response = userTagService.getTagForFriendsResponse(currentUserOpenId, openId);
            logger.info("朋友标签情况获取成功, {}", 
                       JSON.toJSONString(response));
            return ApiResponse.success(response);
        } catch (Exception e) {
            logger.error("获取朋友标签情况失败, currentUserOpenId: {}, friendOpenId: {}, 错误: {}", 
                        currentUserOpenId, openId, e.getMessage(), e);
            return ApiResponse.fail("获取朋友标签情况失败");
        }
    }

    /**
     * 当前登录用户给其他用户打标签
     */
    @PostMapping("/post")
    public ApiResponse<UserTagSummaryDTO> tagUser(@RequestBody TagUserRequest tagUserRequest, HttpServletRequest request) {
        String openId = (String) request.getAttribute("openId");
        if (openId == null) {
            logger.warn("给用户打标签失败：openId为空");
            return ApiResponse.fail("用户未登录");
        }
        
        try {
            logger.info("用户给其他用户打标签, taggerOpenId: {}, invitationUuid: {}", openId, tagUserRequest.getInvitationUuid());
            UserTagSummaryDTO result = userTagService.tagUser(openId, tagUserRequest);
            logger.info("用户打标签成功, taggerOpenId: {}", openId);
            return ApiResponse.success(result, "打标签成功");
        } catch (Exception e) {
            logger.error("用户打标签失败, taggerOpenId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("打标签失败: " + e.getMessage());
        }
    }

} 