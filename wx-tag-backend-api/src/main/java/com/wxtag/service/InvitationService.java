package com.wxtag.service;

import com.wxtag.model.InvitationDTO;

import java.util.List;

/**
 * 邀请任务服务接口
 */
public interface InvitationService {
    
    /**
     * 获取用户的所有邀请任务
     */
    List<InvitationDTO> getUserInvitations(Long userId);
    
    /**
     * 创建邀请任务
     */
    InvitationDTO createInvitation(InvitationDTO invitation);
    
    /**
     * 更新邀请任务
     */
    InvitationDTO updateInvitation(InvitationDTO invitation);
    
    /**
     * 关闭邀请任务
     */
    InvitationDTO closeInvitation(Long id);
    
    /**
     * 删除邀请任务
     */
    boolean deleteInvitation(Long id);
    
    /**
     * 根据openid获取用户当前邀请任务状态
     */
    InvitationDTO getInvitationStatusByOpenid(String openId);
    
    /**
     * 根据邀请码获取邀请任务信息
     */
    InvitationDTO getInvitationByCode(String invitationCode);
} 