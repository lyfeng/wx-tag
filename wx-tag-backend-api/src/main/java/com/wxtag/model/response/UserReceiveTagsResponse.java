package com.wxtag.model.response;

import java.util.List;

import com.wxtag.model.UserTagSummaryDTO;

import lombok.Data;

@Data
public class UserReceiveTagsResponse {
    /**
     * 收到的标签数量
     */
    private Integer tagCount;
    /**
     * 打标签的用户数量
     */
    private Integer tagUserCount;
    /**
     * 收到的标签列表
     */
    private List<UserTagSummaryDTO> userTagSummaryList;
    /**
     * 收到的AI评语
     */
    private String aiContent;

}
