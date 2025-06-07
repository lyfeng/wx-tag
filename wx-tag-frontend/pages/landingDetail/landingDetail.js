const app = getApp();
const { sampleData } = require('../../utils/sampleData');

Page({
  data: {
    loading: false,
    userInfo: {}
  },

  onLoad(options) {
    const { userIndex } = options;
    
    if (userIndex !== undefined) {
      this.loadUserDetail(parseInt(userIndex));
    } else {
      // 如果没有传递参数，显示默认数据
      this.loadDefaultData();
    }
  },

  // 加载用户详情
  loadUserDetail(userIndex) {
    this.setData({ loading: true });
    
    setTimeout(() => {
      const userData = sampleData[userIndex] || sampleData[0];
      this.setData({
        userInfo: userData,
        loading: false
      });
    }, 500);
  },

  // 加载默认数据
  loadDefaultData() {
    this.setData({
      userInfo: {
        username: '神秘用户',
        avatar: '🎭',
        tags: ['神秘', '有趣', '独特'],
        summary: '这是一个很有趣的人，值得深入了解。每个人都自己独特的魅力，等待被发现。'
      },
      loading: false
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 开始标签 - 跳转到登录页面
  startTagging() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },

  onShow() {
    // 页面显示时的逻辑
  },

  onShareAppMessage() {
    return {
      title: `看看${this.data.userInfo.username}的标签`,
      path: '/pages/landing/landing',
      imageUrl: ''
    };
  }
});