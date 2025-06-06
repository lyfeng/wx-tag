package com.wxtag.controller;

import com.wxtag.common.ApiResponse;
import com.wxtag.model.InvitationDTO;
import com.wxtag.model.WxUserDTO;
import com.wxtag.service.InvitationService;
import com.wxtag.service.WxUserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 邀请任务控制器
 */
@RestController
@RequestMapping("/invitations")
public class InvitationController {

    private static final Logger logger = LoggerFactory.getLogger(InvitationController.class);

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private WxUserService wxUserService;


    /**
     * 创建邀请任务
     */
    @PostMapping("/create")
    public ApiResponse<InvitationDTO> createInvitation(HttpServletRequest request) {
        logger.info("开始处理邀请任务请求...");
        
        try {
            // 获取并验证openid
            String openid = (String) request.getAttribute("openId");
            if (openid == null || openid.trim().isEmpty()) {
                logger.warn("处理邀请任务失败：openid为空");
                return ApiResponse.fail("用户标识不能为空");
            }
            
            logger.info("用户[{}]请求邀请任务", openid);
            
            // 首先检查用户是否已有进行中的邀请任务
            InvitationDTO existingInvitation = invitationService.getInvitationStatusByOpenid(openid);
            if (existingInvitation != null) {
                logger.info("用户[{}]已有进行中的邀请任务，返回现有任务，邀请码[{}]", openid, existingInvitation.getInvitationCode());
                return ApiResponse.success(existingInvitation);
            }
            
            // 如果没有现有任务，则创建新任务
            logger.info("用户[{}]没有进行中的邀请任务，开始创建新任务", openid);
            
            // 获取用户信息
            WxUserDTO wxUser = wxUserService.getUserByOpenId(openid);
            if (wxUser == null) {
                logger.warn("创建邀请任务失败：未找到用户信息，openid={}", openid);
                return ApiResponse.fail("用户信息不存在");
            }
            
            logger.info("获取用户信息成功：nickname={}", wxUser.getNickname());
            
            // 构建邀请对象
            InvitationDTO invitation = new InvitationDTO();
            invitation.setOpenid(openid);
            invitation.setNickname(wxUser.getNickname());
            invitation.setAvatarUrl(wxUser.getAvatarUrl());
            
            // 生成邀请码
            String invitationCode = UUID.randomUUID().toString().replace("-", "");
            invitation.setInvitationCode(invitationCode);
            invitation.setStatus(1);
            invitation.setStartTime(new Date());
            
            logger.info("生成邀请码：{}", invitationCode);
            
            // 保存邀请任务
            InvitationDTO savedInvitation = invitationService.createInvitation(invitation);
            
            logger.info("邀请任务创建成功：用户[{}]，邀请码[{}]", openid, invitationCode);
            return ApiResponse.success(savedInvitation);
            
        } catch (Exception e) {
            logger.error("处理邀请任务异常", e);
            return ApiResponse.fail("处理邀请任务失败：" + e.getMessage());
        }
    }

    
} 