package com.wxtag.model.response;

import java.util.List;

import com.wxtag.model.TagVO;

import lombok.Data;

@Data
public class UserTagHomeResponse {
    private String openid;
    private String nickname;
    private String avatarUrl;
    private Boolean hasTagged;
    private List<TagVO> tags;
}
