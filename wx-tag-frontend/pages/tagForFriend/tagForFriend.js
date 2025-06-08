// pages/tagForFriend/tagForFriend.js
const app = getApp();
const { apiUtils } = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitationCode: '' // 邀请码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 处理邀请码 - 支持 code 和 invitationCode 两种参数名
    const code = options.code || options.invitationCode;
    if (code) {
      this.setData({
        invitationCode: code
      });
    }

    // 检查登录状态
    if (!apiUtils.isLoggedIn()) {
      wx.showToast({
        title: '请先登录后再操作',
        icon: 'none',
        duration: 1500
      });

      // 保存当前页面路径，用于登录后返回
      let currentPage = '/pages/tagForFriend/tagForFriend';
      if (code) {
        // 保持原始参数名
        const paramName = options.code ? 'code' : 'invitationCode';
        currentPage = `/pages/tagForFriend/tagForFriend?${paramName}=${code}`;
      }
      
      // 延迟1.5秒后跳转到登录页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/index/index?returnPage=${encodeURIComponent(currentPage)}`
        });
      }, 1500);
      return;
    }

    // 已登录，继续加载页面数据
    this.loadPageData();
  },

  // 加载页面数据
  loadPageData() {
    // 如果有邀请码，直接跳转到标签选择页面
    if (this.data.invitationCode) {
      wx.redirectTo({
        url: `/pages/tagSelection/tagSelection?invitationCode=${this.data.invitationCode}`
      });
      return;
    }
    
    // 如果没有邀请码，提示错误并跳转到首页
    wx.showToast({
      title: '参数无效，返回首页',
      icon: 'none',
      duration: 1500
    });
    
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

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

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
})