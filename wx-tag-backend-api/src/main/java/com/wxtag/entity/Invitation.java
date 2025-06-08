package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 邀请任务实体类
 */
@Data
public class Invitation {
    /**
     * 邀请ID
     */
    private Long id;
    
    /**
     * 邀请UUID
     */
    private String invitationUuid;
    
    /**
     * 发起邀请的用户openid
     */
    private String openid;
    
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