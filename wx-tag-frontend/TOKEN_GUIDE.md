# Token统一处理机制

## 概述

本项目实现了完整的token统一处理机制，确保所有API请求都自动携带认证信息，并统一处理认证失败的情况。

## 核心特性

### 🔐 自动token管理
- 所有API请求自动携带`Authorization: Bearer token`
- 无需在每个接口调用时手动添加token
- 统一的token格式和处理逻辑

### 🚨 统一错误处理
- 401未授权：自动清除本地数据并跳转登录页
- 403权限不足：显示权限不足提示
- 认证相关错误：自动识别并处理

### 📊 完整的日志记录
- 请求发送前记录token状态
- 响应返回后记录处理结果
- 错误发生时记录详细信息

## 使用方法

### 1. API调用（推荐方式）

```javascript
// 引入API模块
const { homeApi, userTagApi, invitationApi, apiUtils } = require('../../utils/api');

// 直接调用API，token会自动添加
try {
  const response = await invitationApi.createInvitation();
  console.log('成功:', response);
} catch (error) {
  // 使用统一错误处理
  apiUtils.handleError(error, '创建邀请失败');
}
```

### 2. 检查登录状态

```javascript
// 检查是否已登录
if (!apiUtils.isLoggedIn()) {
  // 用户未登录，引导登录
  wx.reLaunch({
    url: '/pages/index/index'
  });
  return;
}
```

### 3. 手动登出

```javascript
// 清除登录状态并跳转登录页
apiUtils.logout();
```

## 技术实现

### 1. 统一请求头处理

```javascript
function getAuthHeaders() {
  const token = wx.getStorageSync('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
```

### 2. 认证失败处理

```javascript
function handleAuthFailure() {
  // 清除所有登录相关数据
  wx.removeStorageSync('token');
  wx.removeStorageSync('openid');
  wx.removeStorageSync('userInfo');
  
  // 更新全局状态
  const app = getApp();
  if (app && app.globalData) {
    app.globalData.isLoggedIn = false;
    app.globalData.userInfo = null;
  }
  
  // 跳转登录页
  wx.reLaunch({
    url: '/pages/index/index'
  });
}
```

### 3. 智能错误识别

```javascript
// 自动识别认证相关错误
if (errorMessage.includes('用户标识') || 
    errorMessage.includes('未登录') || 
    errorMessage.includes('token')) {
  handleAuthFailure();
}
```

## 调试信息

开发过程中，控制台会显示详细的调试信息：

```
添加认证头，token前缀: eyJhbGciOiJIUzI1NiIsIn...
发送请求: {url: "...", method: "POST", hasToken: true, dataKeys: []}
收到响应: {statusCode: 200, success: true, message: "操作成功"}
```

## 最佳实践

### 1. 页面初始化时检查登录状态

```javascript
onLoad() {
  if (!apiUtils.isLoggedIn()) {
    // 引导用户登录
    return;
  }
  
  // 继续页面逻辑
  this.loadData();
}
```

### 2. 统一的错误处理

```javascript
try {
  const response = await someApi.call();
  // 处理成功响应
} catch (error) {
  // 使用统一错误处理，无需手动处理认证错误
  apiUtils.handleError(error, '操作失败');
}
```

### 3. 登录成功后的状态同步

```javascript
// 登录成功后确保全局状态同步
wx.setStorageSync('token', response.data.token);
wx.setStorageSync('openid', response.data.openid);
app.globalData.isLoggedIn = true;
```

## 错误码处理

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| 401 | 未授权/token过期 | 自动清除本地数据，跳转登录页 |
| 403 | 权限不足 | 显示权限不足提示 |
| 其他4xx | 客户端错误 | 显示具体错误信息 |
| 5xx | 服务器错误 | 显示服务器错误提示 |

## 注意事项

1. **token存储**：token存储在本地storage中，刷新小程序后仍然有效
2. **自动清理**：认证失败时会自动清理所有相关数据
3. **全局状态**：登录状态会同步更新到app.globalData
4. **错误提示**：所有错误都会有用户友好的提示信息
5. **日志记录**：开发模式下会有详细的日志记录

## 迁移指南

如果你的代码之前手动处理token，可以按以下方式迁移：

### 旧代码
```javascript
wx.request({
  url: 'xxx',
  header: {
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    if (res.statusCode === 401) {
      // 手动处理登录失效
    }
  }
});
```

### 新代码
```javascript
const { post } = require('../../utils/request');

try {
  const response = await post('/api/xxx');
  // token和错误处理都自动完成
} catch (error) {
  // 统一错误处理
  apiUtils.handleError(error);
}
``` 