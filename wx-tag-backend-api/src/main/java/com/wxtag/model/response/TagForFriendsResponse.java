package com.wxtag.model.response;

import java.util.List;


import lombok.Data;

@Data
public class TagForFriendsResponse {
    /**
     * 他收到的标签总数
     */
    private Integer tagCount;

    /**
     * 打标签的用户数量
     */
    private Integer tagUserCount;

    /**
     * 我给他打的标签
     */
    List<String> tags;
    
    /**
     * 朋友的标签数量明细
     */
    List<TagCountDTO> tagCountList;
    
    /**
     * 收到的AI评语
     */
    private String aiContent;
}
