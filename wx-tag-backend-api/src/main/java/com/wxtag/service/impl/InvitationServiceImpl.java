package com.wxtag.service.impl;

import com.wxtag.entity.Invitation;
import com.wxtag.entity.WxUser;
import com.wxtag.mapper.InvitationMapper;
import com.wxtag.mapper.WxUserMapper;
import com.wxtag.model.InvitationDTO;
import com.wxtag.service.InvitationService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 邀请任务服务实现类
 */
@Service
public class InvitationServiceImpl implements InvitationService {
    
    private static final Logger logger = LoggerFactory.getLogger(InvitationServiceImpl.class);
    
    @Autowired
    private InvitationMapper invitationMapper;
    
    @Autowired
    private WxUserMapper wxUserMapper;
    
    @Override
    public List<InvitationDTO> getUserInvitations(Long userId) {
        logger.info("获取用户邀请任务, userId: {}", userId);
        
        // 根据userId查询用户信息
        WxUser user = wxUserMapper.selectById(userId);
        if (user == null) {
            return new ArrayList<>();
        }
        
        List<Invitation> invitations = invitationMapper.selectByOpenid(user.getOpenId());
        return invitations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public InvitationDTO createInvitation(InvitationDTO invitationDTO) {
        logger.info("创建邀请任务, openid: {}", invitationDTO.getOpenid());
        
        Invitation invitation = new Invitation();
        BeanUtils.copyProperties(invitationDTO, invitation);
        
        // 生成邀请UUID
        invitation.setInvitationUuid(UUID.randomUUID().toString());
        
        // 如果没有传入邀请码，则生成一个
        if (invitation.getInvitationCode() == null || invitation.getInvitationCode().trim().isEmpty()) {
            invitation.setInvitationCode(generateInvitationCode());
        }
        
        invitation.setStatus(1); // 进行中
        if (invitation.getStartTime() == null) {
            invitation.setStartTime(new Date());
        }
        invitation.setCreatedAt(new Date());
        invitation.setUpdatedAt(new Date());
        
        int result = invitationMapper.insert(invitation);
        if (result > 0) {
            return convertToDTO(invitation);
        }
        
        throw new RuntimeException("创建邀请任务失败");
    }
    
    @Override
    public InvitationDTO updateInvitation(InvitationDTO invitationDTO) {
        logger.info("更新邀请任务, id: {}", invitationDTO.getInvitationUuid());
        
        Invitation invitation = new Invitation();
        BeanUtils.copyProperties(invitationDTO, invitation);
        invitation.setUpdatedAt(new Date());
        
        int result = invitationMapper.updateById(invitation);
        if (result > 0) {
            return convertToDTO(invitation);
        }
        
        return null;
    }
    
    @Override
    public InvitationDTO closeInvitation(Long id) {
        logger.info("关闭邀请任务, id: {}", id);
        
        Invitation invitation = invitationMapper.selectById(id);
        if (invitation == null) {
            return null;
        }
        
        invitation.setStatus(0); // 已关闭
        invitation.setEndTime(new Date());
        invitation.setUpdatedAt(new Date());
        
        int result = invitationMapper.updateById(invitation);
        if (result > 0) {
            return convertToDTO(invitation);
        }
        
        return null;
    }
    
    @Override
    public boolean deleteInvitation(Long id) {
        logger.info("删除邀请任务, id: {}", id);
        
        int result = invitationMapper.deleteById(id);
        return result > 0;
    }
    
    @Override
    public InvitationDTO getInvitationStatusByOpenid(String openId) {
        logger.info("获取用户邀请任务状态, openId: {}", openId);
        
        Invitation invitation = invitationMapper.selectActiveByOpenid(openId);
        if (invitation != null) {
            return convertToDTO(invitation);
        }
        
        return null;
    }
    
    @Override
    public InvitationDTO getInvitationByCode(String invitationCode) {
        logger.info("根据邀请码获取邀请任务, invitationCode: {}", invitationCode);
        
        Invitation invitation = invitationMapper.selectByInvitationCode(invitationCode);
        if (invitation != null) {
            return convertToDTO(invitation);
        }
        
        return null;
    }
    
    private InvitationDTO convertToDTO(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        BeanUtils.copyProperties(invitation, dto);
        return dto;
    }
    
    private String generateInvitationCode() {
        // 生成6位随机邀请码
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        
        // 检查邀请码是否已存在
        String invitationCode = code.toString();
        Invitation existing = invitationMapper.selectByInvitationCode(invitationCode);
        if (existing != null) {
            // 如果存在，递归生成新的邀请码
            return generateInvitationCode();
        }
        
        return invitationCode;
    }
} 