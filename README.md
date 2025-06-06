# 微标签小程序

微标签小程序是一款让用户通过互相贴标签了解彼此印象的微信小程序，同时结合AI生成对用户性格特点的分析评语。

## 项目结构

- `wx-tag-prototype/` - 原型设计文件
- `wx-tag-backend-api/` - SpringBoot后端API
- `wx-tag-frontend/` - 微信小程序前端代码

## 技术栈

### 后端技术

- SpringBoot 2.7.x - 后端框架
- MyBatis - ORM框架
- MySQL - 数据库
- 腾讯云NLP - AI分析服务
- WxJava - 微信开发SDK

### 前端技术

- 微信小程序原生开发框架
- WXML/WXSS/JS

## 功能特点

1. **用户标签系统**：用户可以给好友贴标签，也可以收集来自好友的标签
2. **AI分析**：基于收集到的标签自动生成用户性格分析
3. **邀请功能**：用户可以创建邀请链接分享给好友来收集标签
4. **标签统计**：直观展示用户收到最多的标签
5. **邀请任务管理**：查看已发起的邀请任务及参与情况

## 安装运行

### 后端部分

1. 确保安装了Java 8和Maven
2. 配置数据库连接和腾讯云API密钥
3. 运行以下命令启动后端服务：

```bash
cd wx-tag-backend-api
mvn spring-boot:run
```

### 前端部分

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目中的`wx-tag-frontend`目录
3. 在`app.js`中配置正确的后端API地址
4. 编译预览

## 配置说明

后端配置文件位于`wx-tag-backend-api/src/main/resources/application.yml`，需要配置：

- 数据库连接信息
- 微信小程序AppID和Secret
- 腾讯云AI服务密钥

## 数据库初始化

执行以下SQL脚本初始化数据库：

- `wx-tag-backend-api/src/main/resources/db/schema.sql` - 创建表结构
- `wx-tag-backend-api/src/main/resources/db/data.sql` - 初始化数据

## 贡献与开发

欢迎提交问题和改进建议！ 