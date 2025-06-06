package com.wxtag.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 用户标签关系DTO类
 */
@Data
public class UserTagSummaryDTO {
    /**
     * ID
     */
    private String userTagSummaryUuid;
    
    /**
     * 被标记的用户openid
     */
    private String openid;  

    /**
     * 被标记的用户昵称
     */
    private String nickname;
    
    /**
     * 被标记的用户头像URL
     */
    private String avatarUrl;
    
    /**
     * 打标签的用户openid
     */
    private String taggerOpenid;
    
    /**
     * 打标签的用户昵称
     */
    private String taggerNickname;
    
    /**
     * 打标签的用户头像URL
     */
    private String taggerAvatarUrl;
    
    /**
     * 邀请UUID
     */
    private String invitationUuid;

    /**
     * 标签列表
     */
    private List<String> tags;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
    
} 