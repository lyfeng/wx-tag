package com.wxtag.model;

import lombok.Data;

import java.util.List;

/**
 * 标签DTO类
 */
@Data
public class TagVO {
    
    /**
     * 标签名称
     */
    private List<String> tags;
    
    /**
     * 标签分类
     */
    private String category;
    
} 