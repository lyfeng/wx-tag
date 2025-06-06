package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 微信用户实体类
 */
@Data
public class WxUser {
    /**
     * 用户ID
     */
    private Long id;
    
    /**
     * 微信OpenID
     */
    private String openId;
    
    /**
     * 微信UnionID
     */
    private String unionId;
    
    /**
     * 昵称
     */
    private String nickname;
    
    /**
     * 头像URL
     */
    private String avatarUrl;
    
    /**
     * 性别：0未知，1男，2女
     */
    private Integer gender;
    
    /**
     * 国家
     */
    private String country;
    
    /**
     * 省份
     */
    private String province;
    
    /**
     * 城市
     */
    private String city;
    
    /**
     * 语言
     */
    private String language;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
} 