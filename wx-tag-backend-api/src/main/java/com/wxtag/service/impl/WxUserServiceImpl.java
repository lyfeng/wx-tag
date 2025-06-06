package com.wxtag.service.impl;

import com.wxtag.entity.WxUser;
import com.wxtag.mapper.WxUserMapper;
import com.wxtag.model.WxUserDTO;
import com.wxtag.service.WxUserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

/**
 * 微信用户服务实现类
 */
@Service
public class WxUserServiceImpl implements WxUserService {
    
    private static final Logger logger = LoggerFactory.getLogger(WxUserServiceImpl.class);
    
    @Autowired
    private WxUserMapper wxUserMapper;
    
    @Override
    public WxUserDTO getUserByOpenId(String openId) {
        logger.info("根据openId查询用户: {}", openId);
        WxUser user = wxUserMapper.selectByOpenId(openId);
        if (user == null) {
            logger.warn("用户不存在, openId: {}", openId);
            return null;
        }
        
        WxUserDTO userDTO = new WxUserDTO();
        BeanUtils.copyProperties(user, userDTO);
        logger.info("用户查询成功, openId: {}, userId: {}", openId, user.getId());
        return userDTO;
    }
    
    @Override
    public WxUserDTO createOrUpdateUser(WxUserDTO userDTO) {
        logger.info("创建或更新用户, openId: {}", userDTO.getOpenId());
        
        WxUser existingUser = wxUserMapper.selectByOpenId(userDTO.getOpenId());
        WxUser user = new WxUser();
        BeanUtils.copyProperties(userDTO, user);
        
        if (existingUser == null) {
            // 创建新用户
            user.setCreatedAt(new Date());
            user.setUpdatedAt(new Date());
            int result = wxUserMapper.insert(user);
            if (result > 0) {
                logger.info("用户创建成功, openId: {}", userDTO.getOpenId());
                // 查询插入后的用户信息
                WxUser newUser = wxUserMapper.selectByOpenId(userDTO.getOpenId());
                WxUserDTO resultDTO = new WxUserDTO();
                BeanUtils.copyProperties(newUser, resultDTO);
                return resultDTO;
            }
        } else {
            // 更新用户信息
            user.setId(existingUser.getId());
            user.setCreatedAt(existingUser.getCreatedAt());
            user.setUpdatedAt(new Date());
            int result = wxUserMapper.updateByOpenId(user);
            if (result > 0) {
                logger.info("用户更新成功, openId: {}, userId: {}", userDTO.getOpenId(), existingUser.getId());
                WxUserDTO resultDTO = new WxUserDTO();
                BeanUtils.copyProperties(user, resultDTO);
                return resultDTO;
            }
        }
        
        logger.error("用户创建或更新失败, openId: {}", userDTO.getOpenId());
        throw new RuntimeException("用户创建或更新失败");
    }
} 