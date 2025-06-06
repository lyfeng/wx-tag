package com.wxtag.controller;

import com.wxtag.common.ApiResponse;
import com.wxtag.model.response.HomeResponse;
import com.wxtag.service.UserTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 临时测试控制器 - 用于验证AI评语修复
 */
@RestController
@RequestMapping("/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private UserTagService userTagService;

    /**
     * 测试获取首页数据（包含AI评语）
     */
    @GetMapping("/home/{openId}")
    public ApiResponse<HomeResponse> testHome(@PathVariable String openId) {
        logger.info("测试获取首页数据, openId: {}", openId);
        
        try {
            HomeResponse homeData = userTagService.getHomeData(openId);
            logger.info("测试首页数据获取成功, openId: {}, AI评语是否存在: {}", 
                       openId, homeData.getAiContent() != null);
            return ApiResponse.success(homeData);
        } catch (Exception e) {
            logger.error("测试获取首页数据失败, openId: {}, 错误: {}", openId, e.getMessage(), e);
            return ApiResponse.fail("获取首页数据失败: " + e.getMessage());
        }
    }
} 