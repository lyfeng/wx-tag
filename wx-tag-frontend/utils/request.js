// 网络请求封装
// 延迟获取app实例，避免循环依赖问题

// 安全获取app实例的函数
function getSafeApp() {
  try {
    const app = getApp();
    return app;
  } catch (error) {
    return null;
  }
}

// 统一的token处理函数
function getAuthHeaders() {
  const token = wx.getStorageSync('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // 统一添加token到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// 统一的登录失效处理
function handleAuthFailure() {
  // 清除所有登录相关数据
  wx.removeStorageSync('token');
  wx.removeStorageSync('openid');
  wx.removeStorageSync('userInfo');
  
  // 更新全局状态
  const currentApp = getSafeApp();
  if (currentApp && currentApp.globalData) {
    currentApp.globalData.isLoggedIn = false;
    currentApp.globalData.userInfo = null;
  }
  
  // 提示用户重新登录
  wx.showModal({
    title: '登录过期',
    content: '您的登录已过期，请重新登录',
    showCancel: false,
    confirmText: '重新登录',
    success: () => {
      // 获取当前页面路径，用于登录成功后返回
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentRoute = currentPage ? `/${currentPage.route}` : '';
      
      // 跳转到登录页面，并传递当前页面路径作为返回参数
      const returnPage = encodeURIComponent(currentRoute);
      wx.reLaunch({
        url: `/pages/index/index?returnPage=${returnPage}`
      });
    }
  });
}

// 获取应用实例
const app = getApp();

// 请求基础配置
const baseConfig = {
  header: {
    'content-type': 'application/json'
  }
};

// 获取完整URL
function getFullUrl(path) {
  return app.globalData.apiBaseUrl + path;
}

// 添加token到header
function addToken(config) {
  const token = wx.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
}

// 发起请求
function request(method, url, data = null, customConfig = {}) {
  const config = {
    ...baseConfig,
    ...customConfig,
    method,
    url: getFullUrl(url)
  };

  if (data) {
    config.data = data;
  }

  // 添加token
  addToken(config);

  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0 || res.data.code === 200) {
            resolve(res.data);
          } else if (res.data.code === 401) {
            // token失效，清除登录状态并跳转到登录页面
            handleAuthFailure();
            reject(new Error('登录已过期'));
          } else {
            reject(new Error(`请求失败: ${res.data.msg || '未知错误'} (code: ${res.data.code})`));
          }
        } else if (res.statusCode === 401) {
          // HTTP 401状态码处理
          handleAuthFailure();
          reject(new Error(`HTTP错误：${res.statusCode}, 响应数据: ${JSON.stringify(res.data)}`));
        } else {
          reject(new Error(`HTTP错误：${res.statusCode}, 响应数据: ${JSON.stringify(res.data)}`));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败：' + err.errMsg));
      }
    });
  });
}

// 导出请求方法
module.exports = {
  get: (url, data) => request('GET', url, data),
  post: (url, data) => request('POST', url, data),
  put: (url, data) => request('PUT', url, data),
  delete: (url, data) => request('DELETE', url, data),
  hasToken: () => !!wx.getStorageSync('token'),
  clearAuth: () => {
    wx.removeStorageSync('token');
    wx.removeStorageSync('openid');
    wx.removeStorageSync('userInfo');
  },
  handleAuthFailure: handleAuthFailure
}; 