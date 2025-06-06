package com.wxtag.model;

import lombok.Data;

import java.util.Date;

/**
 * 邀请任务DTO类
 */
@Data
public class InvitationDTO {
    /**
     * 邀请ID
     */
    private Long id;
    
    /**
     * 邀请活动ID
     */
    private String invitationUuid;
    
    /**
     * 发起邀请的用户id
     */
    private String openid;
    /** 
     * 发起邀请的用户昵称
     */
    private String nickname;
    /**
     * 发起邀请的用户头像
     */
    private String avatarUrl;
    
    /**
     * 邀请码
     */
    private String invitationCode;
    
    /**
     * 状态：0已关闭，1进行中
     */
    private Integer status;
    
    /**
     * 开始时间
     */
    private Date startTime;
    
    /**
     * 结束时间
     */
    private Date endTime;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;

} 