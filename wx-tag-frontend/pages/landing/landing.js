const app = getApp();
const { homeApi, userTagApi } = require('../../utils/api');
const { sampleData } = require('../../utils/sampleData');

Page({
  data: {
    tagRecords: []
  },

  onLoad(options) {
    // 加载示例数据
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

  // 开始标签 - 判断登录状态并跳转
  startTagging() {
    // 检查登录状态
    if (app.globalData.isLoggedIn) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/home/home'
      });
    } else {
      // 未登录，跳转到登录页面
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },

  onShow() {
    // 页面显示时不做任何自动跳转
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '友谊标签 - 发现朋友眼中的你',
      path: '/pages/landing/landing',
      imageUrl: ''
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '友谊标签 - 发现朋友眼中的你',
      path: '/pages/landing/landing',
      imageUrl: ''
    };
  },
});