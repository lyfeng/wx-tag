const app = getApp();
const { homeApi, userTagApi } = require('../../utils/api');
const { sampleData } = require('../../utils/sampleData');

Page({
  data: {
    tagRecords: []
  },

  onLoad(options) {
    // 检查登录状态
    if (app.globalData.isLoggedIn) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/home/home'
      });
      return;
    }
    
    // 未登录，加载示例数据
    this.loadSampleData();
  },

  // 加载示例标签记录数据
  // 在loadSampleData方法中直接使用
  loadSampleData() {
    this.setData({
      tagRecords: sampleData
    });
  },

  // 查看用户详情
  viewUserDetail(e) {
    const { index } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/landingDetail/landingDetail?userIndex=${index}`
    });
  },

  // 开始标签 - 跳转到登录页面
  startTagging() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },

  onShow() {
    // 每次显示页面时检查登录状态
    if (app.globalData.isLoggedIn) {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  }
});