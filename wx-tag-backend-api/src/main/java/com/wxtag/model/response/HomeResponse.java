package com.wxtag.model.response;

import java.util.List;

import lombok.Data;

@Data
public class HomeResponse{
    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 我是否给自己打过标签
     */
    private Boolean hasTaggedForMySelf;
    
    /**
     * 我收到的总的标签数
     */
    private Integer tagCount;

    /**
     * ai评价的最低评价人数
     */
    private Integer minAiTaggerCount;

    /**
     * 给我打标签人的数量
     */
    private Integer taggerCount;

    /**
     * 收到的标签明细数量
     */
    private List<TagCountDTO> myTagsCount;

    /**
     * 收到的ai评语
     */
    private String aiContent;
}