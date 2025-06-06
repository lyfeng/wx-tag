package com.wxtag;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@MapperScan("com.wxtag.mapper")
public class WxTagApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(WxTagApplication.class);

    public static void main(String[] args) {
        logger.info("微标签小程序后端API启动中...");
        SpringApplication.run(WxTagApplication.class, args);
        logger.info("微标签小程序后端API启动成功！");
    }
} 