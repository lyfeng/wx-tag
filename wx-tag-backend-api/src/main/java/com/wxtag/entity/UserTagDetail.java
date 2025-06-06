package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户标签明细实体类
 */
@Data
public class UserTagDetail {
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
     * 标签UUID
     */
    private String tagUuid;
    
    /**
     * 标签名称
     */
    private String tagName;
    
    /**
     * 邀请UUID
     */
    private String invitationUuid;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
} 