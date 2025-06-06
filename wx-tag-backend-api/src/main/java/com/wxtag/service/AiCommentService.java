package com.wxtag.service;

public interface AiCommentService {
    /**
     * 根据用户的标签和数量生成AI评语
     * @param openId 用户的openid
     * @return 生成的AI评语
     */
    String generateAiComment(String openId);
} 