package com.wxtag.model.response;

import lombok.Data;

@Data
public class TagCountDTO {
    /**
     * 标签名称
     */
    private String tagName;

    /**
     * 标签数量
     */
    private Integer tagCount;

    
}
