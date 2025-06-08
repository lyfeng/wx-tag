package com.wxtag.controller;

import com.alibaba.fastjson.JSON;
import com.wxtag.common.ApiResponse;
import com.wxtag.model.WxUserDTO;
import com.wxtag.service.WxUserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 微信用户控制器
 */
@RestController
@RequestMapping("/user")
public class WxUserController {

    private static final Logger logger = LoggerFactory.getLogger(WxUserController.class);

    @Autowired
    private WxUserService wxUserService;
    
    
    
    /**
     * 创建或更新用户
     */
    @PostMapping("/update")
    public ApiResponse<WxUserDTO> createOrUpdateUser(@RequestBody WxUserDTO user,HttpServletRequest request) {
        logger.info("开始处理用户创建或更新请求, user: {}", JSON.toJSONString(user));
        String openId = (String) request.getAttribute("openId");
        if (user.getOpenId() == null || user.getOpenId().trim().isEmpty() || !user.getOpenId().equals(openId)) {
            logger.warn("创建或更新用户失败：OpenID为空");
            return ApiResponse.fail("OpenID不能为空");
        }
        try {
            WxUserDTO savedUser = wxUserService.createOrUpdateUser(user);
            logger.info("用户创建或更新成功, openId: {}, userId: {}", user.getOpenId(), savedUser.getId());
            return ApiResponse.success(savedUser);
        } catch (Exception e) {
            logger.error("用户创建或更新失败, openId: {}, 错误信息: {}", user.getOpenId(), e.getMessage(), e);
            return ApiResponse.fail("用户创建或更新失败");
        }
    }
} 