package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户标签汇总实体类
 */
@Data
public class UserTagSummary {
    /**
     * ID
     */
    private Long id;
    
    /**
     * 用户标签关系UUID
     */
    private String userTagSummaryUuid;
    
    /**
     * 被标记的用户openid
     */
    private String openid;
    
    /**
     * 打标签的用户openid
     */
    private String taggerOpenid;
    
    /**
     * 邀请UUID
     */
    private String invitationUuid;
    
    /**
     * 标签汇总
     */
    private String tagSummary;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
} 