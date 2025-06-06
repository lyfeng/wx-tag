package com.wxtag.service;

import com.wxtag.model.WxUserDTO;

/**
 * 微信用户服务接口
 */
public interface WxUserService {
    
    /**
     * 根据openId查询用户
     */
    WxUserDTO getUserByOpenId(String openId);
    
    /**
     * 创建或更新用户
     */
    WxUserDTO createOrUpdateUser(WxUserDTO userDTO);
} 