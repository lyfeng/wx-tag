// pages/tagForFriend/tagForFriend.js
const app = getApp();
const { apiUtils, userTagApi } = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendOpenId: '', // 朋友的openId
    invitationCode: '', // 邀请码
    returnPage: '', // 返回页面路径
    originalOptions: {}, // 保存原始参数
    friendInfo: {} // 朋友信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('tagForFriend页面加载，参数：', options);
    
    // 保存原始参数
    this.setData({
      originalOptions: options
    });
    
    // 保存朋友的openId和邀请码
    if (options.friendOpenId) {
      this.setData({
        friendOpenId: options.friendOpenId
      });
      console.log('设置friendOpenId:', options.friendOpenId);
    }
    
    // 处理邀请码
    if (options.code) {
      this.setData({
        invitationCode: options.code
      });
      console.log('设置invitationCode:', options.code);
    }

    console.log('当前data状态:', this.data);

    // 检查登录状态
    if (!apiUtils.isLoggedIn()) {
      wx.showToast({
        title: '请先登录后再操作',
        icon: 'none',
        duration: 1500
      });

      // 构建返回参数
      const returnParams = this.buildReturnParams();
      console.log('构建的返回参数:', returnParams);
      
      // 保存当前页面路径，用于登录后返回
      const currentPage = returnParams ? 
        `/pages/tagForFriend/tagForFriend?${returnParams}` : 
        '/pages/tagForFriend/tagForFriend';
      
      console.log('要保存的当前页面路径:', currentPage);
      
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

  // 构建返回参数
  buildReturnParams() {
    const params = [];
    
    console.log('构建参数时的data状态:', {
      friendOpenId: this.data.friendOpenId,
      invitationCode: this.data.invitationCode,
      originalOptions: this.data.originalOptions
    });
    
    // 优先使用原始参数，确保不丢失
    const options = this.data.originalOptions;
    
    // 处理所有可能的参数
    if (options.friendOpenId || this.data.friendOpenId) {
      params.push(`friendOpenId=${options.friendOpenId || this.data.friendOpenId}`);
    }
    
    if (options.code || this.data.invitationCode) {
      params.push(`code=${options.code || this.data.invitationCode}`);
    }
    
    // 处理其他可能的参数
    Object.keys(options).forEach(key => {
      if (key !== 'friendOpenId' && key !== 'code') {
        params.push(`${key}=${options[key]}`);
      }
    });
    
    const result = params.join('&');
    console.log('构建的参数字符串:', result);
    return result;
  },

  // 加载页面数据
  async loadPageData() {
    console.log('开始加载页面数据');
    console.log('当前data中的参数:', {
      invitationCode: this.data.invitationCode,
      friendOpenId: this.data.friendOpenId,
      originalOptions: this.data.originalOptions
    });
    
    // 如果有邀请码，直接跳转到标签选择页面
    if (this.data.invitationCode) {
      console.log('有邀请码，跳转到标签选择页面:', this.data.invitationCode);
      wx.redirectTo({
        url: `/pages/tagSelection/tagSelection?invitationCode=${this.data.invitationCode}`
      });
      return;
    }
    
    // 如果有朋友的openId，先获取朋友信息，然后跳转到朋友详情页面
    if (this.data.friendOpenId) {
      console.log('有朋友openId，开始获取朋友信息:', this.data.friendOpenId);
      
      try {
        // 调用获取朋友标签情况接口获取朋友信息
        const result = await userTagApi.getTagForFriends(this.data.friendOpenId);
        console.log('获取朋友标签情况返回:', result);
        
        if (result.success && result.data) {
          const data = result.data;
          
          // 保存朋友信息
          this.setData({
            friendInfo: {
              nickname: data.nickName || data.nickname,
              avatarUrl: data.avatarUrl
            }
          });
          
          console.log('获取到朋友信息:', this.data.friendInfo);
          
          // 跳转到朋友详情页面，传递朋友信息
          const nickname = this.data.friendInfo.nickname;
          const url = nickname ? 
            `/pages/friendDetail/friendDetail?openId=${this.data.friendOpenId}&nickname=${encodeURIComponent(nickname)}` :
            `/pages/friendDetail/friendDetail?openId=${this.data.friendOpenId}`;
            
          console.log('跳转到朋友详情页面:', url);
          wx.redirectTo({
            url: url
          });
          return;
        } else {
          console.error('获取朋友信息失败:', result.message);
          // 如果获取朋友信息失败，仍然跳转但不传递昵称
          wx.redirectTo({
            url: `/pages/friendDetail/friendDetail?openId=${this.data.friendOpenId}`
          });
          return;
        }
      } catch (error) {
        console.error('获取朋友信息异常:', error);
        // 如果出现异常，仍然跳转但不传递昵称
        wx.redirectTo({
          url: `/pages/friendDetail/friendDetail?openId=${this.data.friendOpenId}`
        });
        return;
      }
    }
    
    // 检查原始参数中是否有其他形式的参数
    const options = this.data.originalOptions;
    console.log('检查原始参数中的所有键值:', Object.keys(options));
    console.log('原始参数详情:', options);
    
    // 尝试其他可能的参数名
    if (options.invitationCode) {
      console.log('在原始参数中找到 invitationCode:', options.invitationCode);
      wx.redirectTo({
        url: `/pages/tagSelection/tagSelection?invitationCode=${options.invitationCode}`
      });
      return;
    }
    
    if (options.openId || options.openid) {
      const openId = options.openId || options.openid;
      console.log('在原始参数中找到 openId:', openId);
      
      try {
        // 同样先获取朋友信息
        const result = await userTagApi.getTagForFriends(openId);
        console.log('获取朋友标签情况返回:', result);
        
        if (result.success && result.data) {
          const data = result.data;
          const nickname = data.nickName || data.nickname;
          const url = nickname ? 
            `/pages/friendDetail/friendDetail?openId=${openId}&nickname=${encodeURIComponent(nickname)}` :
            `/pages/friendDetail/friendDetail?openId=${openId}`;
            
          wx.redirectTo({
            url: url
          });
          return;
        }
      } catch (error) {
        console.error('获取朋友信息异常:', error);
      }
      
      // 如果获取失败，仍然跳转
      wx.redirectTo({
        url: `/pages/friendDetail/friendDetail?openId=${openId}`
      });
      return;
    }
    
    // 如果都没有，跳转到首页
    console.log('没有有效参数，跳转到首页');
    console.log('最终检查 - 所有可能的参数:', {
      'this.data.invitationCode': this.data.invitationCode,
      'this.data.friendOpenId': this.data.friendOpenId,
      'options.code': options.code,
      'options.invitationCode': options.invitationCode,
      'options.friendOpenId': options.friendOpenId,
      'options.openId': options.openId,
      'options.openid': options.openid
    });
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    if (this.data.invitationCode) {
      return {
        title: '帮我贴个标签，看看我在你眼中是什么样的吧！',
        path: `/pages/tagForFriend/tagForFriend?code=${this.data.invitationCode}`,
        imageUrl: '/images/share_img.png'
      };
    }
    return null;
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
})