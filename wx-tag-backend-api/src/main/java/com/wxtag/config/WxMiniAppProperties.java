package com.wxtag.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 微信小程序配置属性
 */
@Data
@ConfigurationProperties(prefix = "wx.miniapp")
public class WxMiniAppProperties {

    /**
     * 设置微信小程序的appid
     */
    private String appid;

    /**
     * 设置微信小程序的Secret
     */
    private String secret;

    /**
     * 设置微信小程序的token
     */
    private String token;

    /**
     * 设置微信小程序的EncodingAESKey
     */
    private String aesKey;

    /**
     * 消息格式，XML或者JSON
     */
    private String msgDataFormat;
} 