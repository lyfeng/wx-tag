package com.wxtag.model.request;

import java.util.List;

import lombok.Data;

/**
 * 打标签请求dto
 */
@Data
public class TagUserRequest {

    /**
     * 打标签任务的uuid
     */
    private String invitationUuid;

    /**
     * 具体标签
     */
    private List<String> tags;
}
