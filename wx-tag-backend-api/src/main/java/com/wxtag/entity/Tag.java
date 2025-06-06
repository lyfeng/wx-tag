package com.wxtag.entity;

import lombok.Data;
import java.util.Date;

/**
 * 标签实体类
 */
@Data
public class Tag {
    /**
     * 标签ID
     */
    private Long id;
    
    /**
     * 标签UUID
     */
    private String tagUuid;
    
    /**
     * 标签名称
     */
    private String tagName;
    
    /**
     * 标签描述
     */
    private String description;
    
    /**
     * 标签分类
     */
    private String category;
    
    /**
     * 排序
     */
    private Integer sortOrder;
    
    /**
     * 创建时间
     */
    private Date createdAt;
    
    /**
     * 更新时间
     */
    private Date updatedAt;
} 