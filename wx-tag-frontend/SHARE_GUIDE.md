# 微信小程序分享功能实现指南

## 功能概述

本小程序实现了完整的标签评价分享功能，用户可以邀请朋友来给自己打标签。

## 分享流程

### 1. 创建邀请任务
- 用户A在首页点击"邀请朋友给我打标签"按钮
- 调用`/invitations/create`接口创建邀请任务
- 后端返回包含`invitationCode`的邀请信息

### 2. 分享邀请
- 显示分享弹窗，用户可以选择：
  - 微信好友分享
  - 复制邀请码
  - 朋友圈分享（如果支持）

### 3. 接收分享
- 用户B通过分享链接进入小程序
- 链接格式：`pages/tagSelection/tagSelection?invitationCode=邀请码`
- tagSelection页面自动解析邀请码参数

### 4. 获取用户信息
- tagSelection页面调用`/user-tags/home?invitationCode=邀请码`
- 获取用户A的信息（昵称、头像）和可选标签列表

### 5. 评价标签
- 用户B选择标签给用户A评价
- 调用`/user-tags/post`接口提交评价
- 跳转到成功页面

## 核心文件说明

### 1. `pages/home/home.js`
- 实现创建邀请功能
- 处理分享弹窗逻辑
- 配置分享参数

### 2. `pages/tagSelection/tagSelection.js`
- 处理邀请码参数
- 获取被评价用户信息
- 实现标签选择和提交
- 支持转发分享

### 3. `utils/util.js`
- `generateShareConfig()`: 生成分享配置
- `copyInvitationCode()`: 复制邀请码到剪贴板

## 分享配置

### 分享给好友 (onShareAppMessage)
```javascript
{
  title: "来给${用户昵称}打标签吧！",
  path: "/pages/tagSelection/tagSelection?invitationCode=${邀请码}",
  imageUrl: "${用户头像}"
}
```

### 分享到朋友圈 (onShareTimeline)
```javascript
{
  title: "来给${用户昵称}打标签吧！",
  query: "invitationCode=${邀请码}",
  imageUrl: "${用户头像}"
}
```

## API接口

### 创建邀请任务
- **接口**: `POST /invitations/create`
- **返回**: 包含`invitationCode`的邀请信息

### 获取标签页面数据
- **接口**: `GET /user-tags/home?invitationCode=${邀请码}`
- **返回**: 被评价用户信息和标签列表

### 提交标签评价
- **接口**: `POST /user-tags/post`
- **参数**: `{ invitationUuid, tags }`

## 页面跳转关系

```
首页 (home) 
   ↓ 点击"邀请朋友给我打标签"
分享弹窗
   ↓ 分享
标签选择页 (tagSelection)
   ↓ 提交标签
成功页 (tagSuccess)
```

## 注意事项

1. **邀请码有效性**: 需要确保邀请码在后端的有效期设置
2. **用户体验**: 分享时使用用户头像作为分享图片，提升视觉效果
3. **错误处理**: 对网络请求失败、邀请码无效等情况做好错误处理
4. **权限控制**: 确保用户只能评价有效的邀请任务

## 扩展功能

1. **分享统计**: 可以添加分享次数统计
2. **批量邀请**: 支持一次创建多个邀请任务
3. **自定义标签**: 允许用户自定义标签内容
4. **评价历史**: 显示用户的评价历史记录 