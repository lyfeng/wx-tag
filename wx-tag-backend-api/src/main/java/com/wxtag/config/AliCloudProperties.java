package com.wxtag.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 阿里云通义千问大模型配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "aliyun")
public class AliCloudProperties {
    
    /**
     * API Key
     */
    private String apiKey;
    
    /**
     * 模型名称
     */
    private String modelName = "qwen-turbo";
    
    /**
     * API请求地址
     */
    private String apiUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
    
    /**
     * 温度参数
     */
    private Float temperature = 0.7f;
    
    /**
     * 最大生成token数
     */
    private Integer maxTokens = 1500;
} 