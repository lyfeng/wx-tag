// pages/tagSuccess/tagSuccess.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    targetOpenId: null,
    invitationCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取目标用户ID和邀请码
    if (options.openId) {
      this.setData({
        targetOpenId: options.openId
      });
    }
    
    if (options.code) {
      this.setData({
        invitationCode: options.code
      });
    }
    
    // 获取当前用户信息
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 返回首页
   */
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  /**
   * 继续给其他好友贴标签
   */
  tagOthers() {
    if (this.data.invitationCode) {
      // 如果是通过邀请进来的，返回到邀请列表
      wx.redirectTo({
        url: '/pages/inviteTasks/inviteTasks'
      });
    } else {
      // 否则返回到好友列表
      wx.redirectTo({
        url: '/pages/friendList/friendList'
      });
    }
  },

  /**
   * 查看标签详情
   */
  viewTagDetail() {
    wx.navigateTo({
      url: `/pages/friendDetail/friendDetail?openId=${this.data.targetOpenId}`
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    if (this.data.invitationCode) {
      return {
        title: '帮我贴个标签，看看我在你眼中是什么样的吧！',
        path: `/pages/tagForFriend/tagForFriend?code=${this.data.invitationCode}`,
        imageUrl: '/images/share_img.png'
      };
    } else {
      return {
        title: '来给好友贴标签，看看Ta在你眼中是什么样的吧！',
        path: '/pages/home/home',
        imageUrl: '/images/share_img.png'
      };
    }
  }
})