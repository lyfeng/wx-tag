const { get, post, put, delete: deleteReq, hasToken, clearAuth } = require('./request');
const app = getApp();

// 用户模块API
const userApi = {
  // 创建或更新用户信息
  updateUser: (data) => post('/user/update', data)
};

// 首页模块API
const homeApi = {
  // 获取首页数据
  getHomeData: () => get('/home/home'),
  
  // 微信登录
  login: (code) => post('/home/login', { code }),
  
  // 生成AI评语
  generateAiComment: () => post('/home/generateAiComment')
};

// 用户标签模块API
const userTagApi = {
  // 获取打标签页面数据 (根据邀请码获取被标记用户信息和可选标签列表)
  getTaggingPageData: (invitationCode) => get('/user-tags/home', { invitationCode }),
  
  // 获取我给他人的标签
  getGivenTags: () => get('/user-tags/given'),
  
  // 获取他人给我的标签
  getReceivedTags: () => get('/user-tags/receive'),
  
  // 获取朋友的标签情况
  getTagForFriends: (openId) => get('/user-tags/tag-for-friends', { openId }),
  
  // 给用户打标签
  postTags: (data) => post('/user-tags/post', data)
};

// 邀请管理模块API
const invitationApi = {
  // 创建邀请任务
  createInvitation: () => post('/invitations/create')
};

// API工具方法
const apiUtils = {
  // 检查是否已登录
  isLoggedIn: () => hasToken(),
  
  // 手动清除登录状态
  logout: () => clearAuth(),
  
  // 统一的错误处理
  handleError: (error, defaultMessage = '操作失败') => {
    console.error('API错误:', error);
    const message = error.message || defaultMessage;
    wx.showToast({
      title: message,
      icon: 'none'
    });
  }
};

module.exports = {
  userApi,
  homeApi,
  userTagApi,
  invitationApi,
  apiUtils
}; 