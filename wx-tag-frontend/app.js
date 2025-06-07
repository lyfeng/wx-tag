// app.js
// 延迟引入api模块，避免循环依赖

App({
  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;

    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    
    console.log('App启动时检查登录状态:', {
      hasToken: !!token,
      hasOpenid: !!openid,
      hasUserInfo: !!userInfo
    });
    
    // 检查token和用户信息完整性
    if (token) {
      this.globalData.isLoggedIn = true;
      
      // 检查用户信息是否完整
      if (userInfo && userInfo.avatarUrl && userInfo.nickName) {
        this.globalData.userInfo = userInfo;
        console.log('用户信息完整，直接进入首页');
      } else {
        console.log('用户信息不完整，需要补充信息');
        // 跳转到用户信息设置页面
        wx.redirectTo({
          url: '/pages/userProfile/userProfile'
        });
      }
    } else {
      console.log('用户未登录或登录信息不完整');
      this.globalData.isLoggedIn = false;
      this.globalData.userInfo = null;
    }
  },

  // 登录方法
  login: function(callback) {
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 延迟引入api模块
          const { homeApi } = require('./utils/api');
          
          // 使用新的登录API
          homeApi.login(res.code)
            .then(response => {
              console.log('登录成功，完整响应数据：', response);
              
              // 保存登录态
              wx.setStorageSync('token', response.data.token);
              wx.setStorageSync('openid', response.data.openid);
              
              // 更新全局数据
              that.globalData.isLoggedIn = true;
              
              // 设置用户信息
              const userInfo = {
                nickName: response.data.nickName || '',
                avatarUrl: response.data.avatarUrl || '',
                openId: response.data.openid
              };
              
              that.globalData.userInfo = userInfo;
              wx.setStorageSync('userInfo', userInfo);
              
              // 检查用户信息完整性并跳转
              if (!userInfo.avatarUrl || !userInfo.nickName) {
                console.log('需要补充用户信息');
                wx.redirectTo({
                  url: `/pages/userProfile/userProfile?avatarUrl=${userInfo.avatarUrl || ''}&nickName=${userInfo.nickName || ''}`
                });
              } else {
                console.log('用户信息完整，进入首页');
                wx.reLaunch({
                  url: '/pages/home/home'
                });
              }
              
              if (callback) {
                callback(true);
              }
            })
            .catch(error => {
              console.error('登录失败', error);
              if (callback) {
                callback(false);
              }
            });
        } else {
          wx.showToast({
            title: '微信登录失败',
            icon: 'none'
          });
          if (callback) {
            callback(false);
          }
        }
      }
    });
  },

  // 更新用户信息
  updateUserInfo: function(userInfo) {
    console.log('准备更新用户信息到服务器：', userInfo);
    // 延迟引入api模块
    const { userApi } = require('./utils/api');
    
    // 确保包含openid
    userInfo.openId = wx.getStorageSync('openid');
    
    return userApi.updateUser(userInfo)
      .then(response => {
        console.log('用户信息更新成功', response);
        // 更新本地存储的用户信息
        if (response.data) {
          wx.setStorageSync('userInfo', response.data);
          this.globalData.userInfo = response.data;
        }
        return response;
      });
  },

  // 全局数据
  globalData: {
    isLoggedIn: false,
    userInfo: null,
    systemInfo: null,
    apiBaseUrl: 'https://www.agentpro.top/api' // 本地开发环境地址
  }
}); 