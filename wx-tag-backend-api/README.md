# 微标签小程序后端API

这是一个基于Spring Boot的微信小程序后端API项目，用于实现用户标签功能。

## 项目结构

```
src/
├── main/
│   ├── java/com/wxtag/
│   │   ├── controller/     # 控制器层
│   │   ├── service/        # 业务逻辑层
│   │   ├── mapper/         # 数据访问层
│   │   ├── entity/         # 实体类
│   │   ├── model/          # DTO模型
│   │   ├── config/         # 配置类
│   │   ├── util/           # 工具类
│   │   └── common/         # 通用类
│   └── resources/
│       ├── mapper/         # MyBatis映射文件
│       ├── db/             # 数据库脚本
│       └── application.yml # 配置文件
```

## API接口文档

### 1. 用户登录

**POST** `/api/home/login`

请求体：
```json
{
  "code": "微信小程序登录code"
}
```

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "JWT token",
    "openid": "用户openid"
  }
}
```

### 2. 获取首页数据

**GET** `/api/home/home`

请求头：
```
Authorization: Bearer {token}
```

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "tagCount": 10,
    "myTagsCount": [
      {
        "tagName": "开朗",
        "tagCount": 3,
        "aiContent": ""
      }
    ]
  }
}
```

### 3. 获取打标签页面数据

**GET** `/api/user-tags/home?invitationCode={邀请码}`

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "nickname": "用户昵称",
    "avatarUrl": "头像URL",
    "tags": [
      {
        "category": "性格特质",
        "tags": ["开朗", "内向", "幽默"]
      }
    ]
  }
}
```

### 4. 给用户打标签

**POST** `/api/user-tags/post`

请求头：
```
Authorization: Bearer {token}
```

请求体：
```json
{
  "invitationUuid": "邀请任务UUID",
  "tags": ["开朗", "幽默", "聪明"]
}
```

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "打标签成功",
  "data": {
    "userTagSummaryUuid": "标签汇总UUID",
    "openid": "被标记用户openid",
    "nickname": "被标记用户昵称",
    "avatarUrl": "被标记用户头像",
    "taggerNickname": "打标签用户昵称",
    "taggerAvatarUrl": "打标签用户头像",
    "tags": ["开朗", "幽默", "聪明"],
    "createdAt": "2023-12-01T10:00:00"
  }
}
```

### 5. 获取我给他人的标签

**GET** `/api/user-tags/given`

请求头：
```
Authorization: Bearer {token}
```

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "userTagSummaryUuid": "标签汇总UUID",
      "openid": "被标记用户openid",
      "nickname": "被标记用户昵称",
      "avatarUrl": "被标记用户头像",
      "tags": ["开朗", "幽默"],
      "createdAt": "2023-12-01T10:00:00"
    }
  ]
}
```

### 6. 获取别人给我的标签

**GET** `/api/user-tags/receive`

请求头：
```
Authorization: Bearer {token}
```

响应：
```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "userTagSummaryUuid": "标签汇总UUID",
      "taggerNickname": "打标签用户昵称",
      "taggerAvatarUrl": "打标签用户头像",
      "tags": ["开朗", "幽默"],
      "createdAt": "2023-12-01T10:00:00"
    }
  ]
}
```

### 7. 邀请任务管理

#### 7.1 获取用户邀请任务

**GET** `/api/invitations/user/{openId}`

#### 7.2 创建邀请任务

**POST** `/api/invitations`

#### 7.3 更新邀请任务

**PUT** `/api/invitations/{id}`

#### 7.4 关闭邀请任务

**PUT** `/api/invitations/{id}/close`

#### 7.5 删除邀请任务

**DELETE** `/api/invitations/{id}`

#### 7.6 获取邀请任务状态

**GET** `/api/invitations/status?openId={openId}`

### 8. 用户管理

#### 8.1 创建或更新用户

**POST** `/api/user/update`

请求体：
```json
{
  "openId": "用户openId",
  "nickname": "用户昵称",
  "avatarUrl": "头像URL",
  "gender": 1,
  "country": "中国",
  "province": "广东省",
  "city": "深圳市"
}
```

## 数据库配置

1. 创建MySQL数据库：`wx_tag`
2. 执行schema.sql创建表结构
3. 执行data.sql插入基础数据

## 配置说明

在`application.yml`中配置：

- 数据库连接信息
- 微信小程序AppID和Secret
- JWT密钥和过期时间
- 腾讯云AI配置（可选）

## 启动项目

1. 确保MySQL数据库已启动
2. 修改`application.yml`中的数据库配置
3. 运行`WxTagApplication`主类

项目将在`http://localhost:8080`启动，API前缀为`/api`。

## 技术栈

- Spring Boot 2.7+
- MyBatis
- MySQL
- JWT
- Lombok
- Jackson 