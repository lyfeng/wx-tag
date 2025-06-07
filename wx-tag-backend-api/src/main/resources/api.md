# 微信标签系统 API 接口文档

## 概述

这是微信标签系统的后端API接口文档，包含用户管理、标签管理、邀请管理和首页功能等模块。

## 通用响应格式

所有接口都返回统一的响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "success": true
}
```

## 认证说明

除登录接口外，其他接口都需要在请求头中携带JWT token：
- `Authorization: Bearer {token}`

部分接口通过请求属性获取openId，无需额外传参。

---

## 1. 用户模块 (WxUserController)

### 1.1 创建或更新用户信息

**接口地址：** `POST /user/update`

**功能描述：** 创建新用户或更新现有用户信息

**请求参数：**

```json
{
  "openId": "string",           // 微信OpenID，必填
  "unionId": "string",          // 微信UnionID，可选
  "nickname": "string",         // 用户昵称，必填
  "avatarUrl": "string",        // 头像URL，可选
  "gender": 1,                  // 性别：0未知，1男，2女
  "country": "string",          // 国家，可选
  "province": "string",         // 省份，可选
  "city": "string",             // 城市，可选
  "language": "string"          // 语言，可选
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "userUuid": "uuid-string",
    "openId": "wx_open_id",
    "unionId": "wx_union_id",
    "nickname": "用户昵称",
    "avatarUrl": "头像URL",
    "gender": 1,
    "country": "中国",
    "province": "广东省",
    "city": "深圳市",
    "language": "zh_CN",
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  },
  "success": true
}
```

---

## 2. 首页模块 (HomeController)

### 2.1 获取首页数据

**接口地址：** `GET /home/home`

**功能描述：** 获取当前登录用户的首页统计数据

**请求参数：** 无（从token中获取openId）

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "hasTaggedForMySelf": false,  // 是否给自己打过标签
    "tagCount": 15,               // 收到的总标签数
    "taggerCount":3,  //给我打标签人的数量
    "minAiTaggerCount":3, //ai评价的最低评价人数
    "myTagsCount": [              // 标签统计明细
      {
        "tagName": "幽默风趣",
        "tagCount": 5
      },
      {
        "tagName": "认真负责",
        "tagCount": 3
      }
    ],
    "aiContent": "根据大家的评价，您是一个既幽默风趣又认真负责的人..."  // 收到的AI评语
  },
  "success": true
}
```

### 2.2 微信登录

**接口地址：** `POST /home/login`

**功能描述：** 通过微信授权码进行登录认证

**请求参数：**

```json
{
  "code": "string"              // 微信授权码，必填
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_string",
    "openid": "wx_open_id",
    "nickName": "用户昵称",
    "avatarUrl": "用户头像URL"
  },
  "success": true
}
```

### 2.3 生成AI评语

**接口地址：** `POST /home/generateAiComment`

**功能描述：** 根据用户收到的标签生成AI评语

**请求参数：** 无（从token中获取openId）

**响应示例：**

```json
{
  "code": 200,
  "message": "AI评语生成成功",
  "data": "根据大家的评价，您是一个既幽默风趣又认真负责的人...",
  "success": true
}
```

**可能的错误响应：**

```json
{
  "code": 400,
  "message": "评价人数不足，至少需要3人评价才能生成AI评语",
  "data": null,
  "success": false
}
```

```json
{
  "code": 400,
  "message": "生成AI评语失败",
  "data": null,
  "success": false
}
```

---

## 3. 用户标签模块 (UserTagController)

### 3.1 获取打标签页面数据

**接口地址：** `GET /user-tags/home`

**功能描述：** 根据邀请码获取被标记用户信息和可选标签列表

**请求参数：**
- `invitationCode` (query): 邀请码，必填

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "openid": "被标记用户openid",
    "nickname": "被标记用户昵称",
    "avatarUrl": "被标记用户头像URL",
    "hasTagged": false,           // 当前用户是否已经给该用户打过标签
    "tags": [                     // 标签分类列表
      {
        "category": "性格特点",
        "tags": ["幽默风趣", "认真负责", "细心周到"]
      },
      {
        "category": "工作能力",
        "tags": ["技术过硬", "沟通能力强", "团队协作"]
      }
    ]
  },
  "success": true
}
```

**可能的错误响应：**

```json
{
  "code": 400,
  "message": "邀请码无效或已过期",
  "data": null,
  "success": false
}
```

```json
{
  "code": 400,
  "message": "用户未登录",
  "data": null,
  "success": false
}
```

### 3.2 获取我给他人的标签

**接口地址：** `GET /user-tags/given`

**功能描述：** 获取当前登录用户给他人打的标签列表

**请求参数：** 无（从token中获取openId）

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "userTagSummaryUuid": "summary-uuid",
      "openid": "被标记用户openid",
      "nickname": "被标记用户昵称",
      "avatarUrl": "被标记用户头像",
      "taggerOpenid": "当前用户openid",
      "taggerNickname": "当前用户昵称",
      "taggerAvatarUrl": "当前用户头像",
      "invitationUuid": "邀请UUID",
      "tags": ["幽默风趣", "认真负责"],
      "createdAt": "2024-01-01T00:00:00.000+00:00",
      "updatedAt": "2024-01-01T00:00:00.000+00:00"
    }
  ],
  "success": true
}
```

### 3.3 获取他人给我的标签

**接口地址：** `GET /user-tags/receive`

**功能描述：** 获取他人给当前登录用户打的标签列表，包含标签统计信息和AI评语

**请求参数：** 无（从token中获取openId）

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "tagCount": 15,               // 收到的总标签数
    "tagUserCount": 5,            // 给我打标签的不同用户数量
    "userTagSummaryList": [       // 收到的标签详细列表
      {
        "userTagSummaryUuid": "summary-uuid",
        "openid": "当前用户openid",
        "nickname": "当前用户昵称",
        "avatarUrl": "当前用户头像",
        "taggerOpenid": "打标签用户openid",
        "taggerNickname": "打标签用户昵称",
        "taggerAvatarUrl": "打标签用户头像",
        "invitationUuid": "邀请UUID",
        "tags": ["幽默风趣", "认真负责"],
        "createdAt": "2024-01-01T00:00:00.000+00:00",
        "updatedAt": "2024-01-01T00:00:00.000+00:00"
      }
    ],
    "aiContent": "根据大家的评价，您是一个既幽默风趣又认真负责的人..."  // AI评语（可能为null）
  },
  "success": true
}
```

### 3.4 获取朋友的标签情况

**接口地址：** `GET /user-tags/tag-for-friends`

**功能描述：** 获取指定朋友的标签情况，包含朋友收到的标签统计信息和AI评语

**请求参数：**
- `openId` (query): 朋友的openId，必填

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "tagCount": 12,               // 朋友收到的总标签数
    "nickName": 'helloworld',               // 朋友的昵称
    "avatarUrl": 'xxx.png',               // 朋友的头像
    "tagUserCount": 4,            // 给朋友打标签的不同用户数量
    "tags": ["阳光开朗", "乐于助人", "幽默风趣"],  // 我给他打的标签列表
    "tagCountList": [             // 朋友的标签数量明细
      {
        "tagName": "阳光开朗",
        "tagCount": 5
      },
      {
        "tagName": "乐于助人", 
        "tagCount": 3
      },
      {
        "tagName": "幽默风趣",
        "tagCount": 2
      }
    ],
    "aiContent": "根据大家的评价，这是一个阳光开朗且乐于助人的人..."  // AI评语（可能为null）
  },
  "success": true
}
```

**可能的错误响应：**

```json
{
  "code": 400,
  "message": "用户未登录",
  "data": null,
  "success": false
}
```

```json
{
  "code": 400,
  "message": "获取朋友标签情况失败",
  "data": null,
  "success": false
}
```

### 3.5 给用户打标签

**接口地址：** `POST /user-tags/post`

**功能描述：** 当前登录用户给其他用户打标签

**请求参数：**

```json
{
  "invitationUuid": "string",   // 邀请任务UUID，必填
  "tags": ["幽默风趣", "认真负责"] // 标签列表，必填
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "打标签成功",
  "data": {
    "userTagSummaryUuid": "summary-uuid",
    "openid": "被标记用户openid",
    "nickname": "被标记用户昵称",
    "avatarUrl": "被标记用户头像",
    "taggerOpenid": "当前用户openid",
    "taggerNickname": "当前用户昵称",
    "taggerAvatarUrl": "当前用户头像",
    "invitationUuid": "邀请UUID",
    "tags": ["幽默风趣", "认真负责"],
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  },
  "success": true
}
```

---

## 4. 邀请管理模块 (InvitationController)

### 4.1 创建邀请任务

**接口地址：** `POST /invitations/create`

**功能描述：** 创建一个新的标签邀请任务

**请求参数：** 无（从token中获取openId）

**请求头：**
- `openid`: 用户openId（临时兼容，建议使用token）

**响应示例：**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "invitationUuid": "invitation-uuid",
    "openid": "发起者openid",
    "nickname": "发起者昵称",
    "avatarUrl": "发起者头像",
    "invitationCode": "邀请码",
    "status": 1,                  // 状态：0已关闭，1进行中
    "startTime": "2024-01-01T00:00:00.000+00:00",
    "endTime": null,
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  },
  "success": true
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 2001 | 您已经给该用户打过标签了 |

## 常见错误响应

```json
{
  "code": 400,
  "message": "用户未登录",
  "data": null,
  "success": false
}
```

```json
{
  "code": 400,
  "message": "邀请码无效或已过期",
  "data": null,
  "success": false
}
```

```json
{
  "code": 500,
  "message": "您已有进行中的邀请任务，请先关闭后再创建新的任务",
  "data": null,
  "success": false
}
```

## 数据模型说明

### TagVO (标签分类模型)
```json
{
  "category": "string",         // 标签分类名称
  "tags": ["string"]           // 该分类下的标签列表
}
```

### TagCountDTO (标签统计模型)
```json
{
  "tagName": "string",         // 标签名称
  "tagCount": 0                // 标签数量
}
```

### UserReceiveTagsResponse (用户收到标签响应模型)
```json
{
  "tagCount": 0,               // 收到的标签总数
  "tagUserCount": 0,           // 给该用户打标签的不同用户数量
  "userTagSummaryList": [],    // 收到的标签详细列表，元素为UserTagSummaryDTO
  "aiContent": "string"        // AI评语内容，可能为null
}
```

### TagForFriendsResponse (朋友标签情况响应模型)
```json
{
  "tagCount": 0,               // 朋友收到的标签总数
  "tagUserCount": 0,           // 给朋友打标签的不同用户数量
  "userTagSummaryList": [],    // 朋友收到的标签详细列表，元素为UserTagSummaryDTO
  "aiContent": "string"        // AI评语内容，可能为null
}
```

---

## 前端开发注意事项

1. **认证机制**：除登录接口外，所有接口都需要携带JWT token
2. **openId获取**：部分接口通过中间件自动从token中解析openId，无需手动传递
3. **错误处理**：统一的错误响应格式，建议封装通用的错误处理逻辑
4. **邀请码**：邀请码用于分享标签任务，前端需要生成分享链接
5. **标签分类**：标签按分类展示，前端需要按分类渲染标签选择界面
6. **状态管理**：邀请任务有状态概念，前端需要根据状态显示不同UI
7. **朋友标签查看**：`/user-tags/tag-for-friends` 接口用于查看朋友的标签情况，需要传入朋友的openId

## 开发环境

- 基础URL：待配置
- 测试环境：待配置
- 生产环境：待配置
