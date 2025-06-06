// pages/friendDetail/friendDetail.js
const app = getApp();
const { userTagApi, userAnalysisApi } = require('../../utils/api');
const util = require('../../utils/util');
// 引入请求函数
const request = require('../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    friendOpenId: null,
    friendInfo: {},
    myTags: [],
    allTags: [],
    aiComment: '',
    totalPeople: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 调试：打印页面参数
    console.log('onLoad options:', options);
    // 只支持通过openId参数传递
    const { openId, openid, nickname } = options;
    const finalOpenId = openId || openid;
    const friendNickname = nickname ? decodeURIComponent(nickname) : '';
    
    this.setData({ 
      friendOpenId: finalOpenId,
      friendInfo: {
        nickname: friendNickname,
        avatarUrl: ''
      }
    });
    // 调试：打印设置后的friendOpenId
    console.log('设置后的 friendOpenId:', finalOpenId);
    this.loadFriendDetail();
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
    if (this.data.needRefresh) {
      this.loadFriendDetail();
      this.setData({ needRefresh: false });
    }
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
    this.loadFriendDetail();
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
    return {
      title: '看看大家给Ta贴了什么标签？',
      path: `/pages/friendDetail/friendDetail?openId=${this.data.friendOpenId}`,
      imageUrl: '/images/share_img.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '看看大家给Ta贴了什么标签？',
      query: `openId=${this.data.friendOpenId}`
    };
  },

  // 给Ta贴标签
  giveTag() {
    wx.navigateTo({
      url: `/pages/tagSelection/tagSelection?openId=${this.data.friendOpenId}`
    });
  },

  // 刷新AI分析
  async refreshAnalysis() {
    wx.showLoading({
      title: '分析中...',
      mask: true
    });
    
    try {
      const analysis = await userAnalysisApi.generateUserAnalysis(this.data.friendOpenId);
      this.setData({
        aiComment: analysis.analysisContent
      });
      
      wx.showToast({
        title: '分析完成',
        icon: 'success'
      });
    } catch (err) {
      console.error('生成AI分析失败', err);
      wx.showToast({
        title: err.message || '分析失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载好友详情
  async loadFriendDetail() {
    this.setData({ loading: true });
    // 调试：打印请求前的friendOpenId
    console.log('请求前的 friendOpenId:', this.data.friendOpenId);
    if (!this.data.friendOpenId) {
      wx.showToast({
        title: 'openId缺失，无法获取好友信息',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }
    
    try {
      // 检查登录状态
      const token = wx.getStorageSync('token');
      if (!token) {
        // 如果没有token，先尝试登录
        console.log('用户未登录，尝试登录...');
        await this.performLogin();
        
        // 登录成功后再次检查token
        const newToken = wx.getStorageSync('token');
        if (!newToken) {
          throw new Error('登录失败，请重试');
        }
      }
      
      // 根据API文档使用 /user-tags/tag-for-friends 接口
      const result = await userTagApi.getTagForFriends(this.data.friendOpenId);
      
      if (result.success) {
        const data = result.data;
        
        // 保留现有的friendInfo，只更新标签相关数据
        const currentFriendInfo = this.data.friendInfo;
        
        // 我给Ta的标签
        const myTags = data.tags || [];
        
        // Ta的标签总览
        let allTags = data.tagCountList || [];
        // 计算最大tagCount
        const maxCount = allTags.length > 0 ? Math.max(...allTags.map(t => t.tagCount || 0)) : 1;
        allTags = allTags.map(tag => ({
          ...tag,
          _percent: maxCount > 0 ? Math.round((tag.tagCount || 0) / maxCount * 100) : 0
        }));
        
        // AI评语
        const aiComment = data.aiContent || '暂无AI分析评语';
        
        // 给Ta打标签的人数
        const totalPeople = data.tagUserCount || 0;
        
        this.setData({
          friendInfo: currentFriendInfo, // 保持现有的用户信息
          myTags: myTags.map(tagName => ({ tagName })), // 转换为对象格式
          allTags,
          aiComment,
          totalPeople,
          loading: false
        });
      } else {
        throw new Error(result.message || '获取好友标签信息失败');
      }
    } catch (error) {
      console.error('获取好友详情失败', error);
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  // 执行登录
  performLogin() {
    return new Promise((resolve, reject) => {
      if (app.globalData.isLoggedIn) {
        resolve();
        return;
      }
      
      app.login((success) => {
        if (success) {
          resolve();
        } else {
          reject(new Error('登录失败'));
        }
      }, false); // 不需要获取用户信息的快速登录
    });
  },

  // 导航到更新标签页面
  navigateToUpdate() {
    wx.navigateTo({
      url: `/pages/tagSelection/tagSelection?openId=${this.data.friendOpenId}&mode=update`
    });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 下拉刷新
  async onPullDownRefresh() {
    try {
      await this.loadFriendDetail()
      wx.stopPullDownRefresh()
    } catch (error) {
      console.error('刷新失败', error)
      wx.stopPullDownRefresh()
    }
  },

  // 头像加载错误处理
  onAvatarError(e) {
    console.log('头像加载失败:', e);
    this.setData({
      'friendInfo.avatarUrl': '/images/empty.png'
    });
  }
})