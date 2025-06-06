package com.wxtag.model.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String openid;
} 