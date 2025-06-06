package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户AI分析评语实体类
 */
@Data
public class UserAnalysis {
    /**
     * ID
     */
    private Long id;
    
    /**
     * 分析UUID
     */
    private String analysisUuid;
    
    /**
     * 用户OpenID
     */
    private String openId;
    
    /**
     * 关联的邀请UUID
     */
    private String invitationUuid;
    
    /**
     * AI分析内容
     */
    private String analysisContent;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
} 