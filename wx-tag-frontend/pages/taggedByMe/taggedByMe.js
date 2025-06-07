// pages/taggedByMe/taggedByMe.js
const { userTagApi } = require('../../utils/api');
const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    friendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadFriendList()
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
    this.loadFriendList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载好友列表
  async loadFriendList() {
    try {
      this.setData({ loading: true });
      
      // 使用新的API获取我给他人的标签
      const response = await userTagApi.getGivenTags();
      
      if (response.success && response.data) {
        // 按被标记用户分组
        const friendMap = {};
        
        response.data.forEach(tagSummary => {
          const { openid, nickname, avatarUrl, tags, createdAt } = tagSummary;
          
          if (!friendMap[openid]) {
            friendMap[openid] = {
              openid: openid,
              nickname: nickname,
              avatarUrl: avatarUrl,
              tags: [],
              createdAt: createdAt
            };
          }
          
          // 将标签数组合并
          friendMap[openid].tags = tags || [];
        });
        
        // 转换为数组并按时间排序
        const friendList = Object.values(friendMap).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        this.setData({
          friendList: friendList
        });
      } else {
        this.setData({
          friendList: []
        });
      }
    } catch (error) {
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });
      this.setData({
        friendList: []
      });
    } finally {
      this.setData({ loading: false });
      // 完成下拉刷新
      wx.stopPullDownRefresh();
    }
  },

  // 跳转到好友详情
  navigateToDetail(e) {
    const openid = e.currentTarget.dataset.openid;
    const nickname = e.currentTarget.dataset.nickname;
    wx.navigateTo({
      url: `/pages/friendDetail/friendDetail?openid=${openid}&nickname=${encodeURIComponent(nickname)}`
    });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 好友头像加载错误处理
  onFriendAvatarError(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`friendList[${index}].avatarUrl`]: '/images/empty.png'
    });
  }
})