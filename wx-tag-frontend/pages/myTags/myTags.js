// pages/myTags/myTags.js
const app = getApp();
const { userTagApi } = require('../../utils/api');
const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tagData: {
      tagCount: 0,
      tagUserCount: 0,
      userTagSummaryList: [],
      aiContent: null
    },
    tagStats: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    this.loadTagData();
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
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
  async onPullDownRefresh() {
    console.log('下拉刷新开始');
    
    try {
      await this.loadTagData();
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      console.error('下拉刷新失败:', error);
      wx.stopPullDownRefresh();
      
      wx.showToast({
        title: '刷新失败',
        icon: 'error'
      });
    }
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
      title: '看看大家给我贴了什么标签？',
      path: '/pages/myTags/myTags'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '看看大家会给我贴了什么标签？'
    };
  },

  // 加载标签数据
  async loadTagData() {
    this.setData({ loading: true });
    
    try {
      // 使用新的API获取他人给我的标签
      const response = await userTagApi.getReceivedTags();
      console.log('获取他人给我的标签返回:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        
        // 处理用户标签汇总列表，添加格式化时间
        const processedList = (data.userTagSummaryList || []).map(item => {
          return {
            ...item,
            formattedTime: this.formatDate(item.createdAt),
            formattedTags: (item.tags || []).map(tag => ({
              name: tag
            }))
          };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // 生成标签统计
        const tagStats = this.generateTagStats(data.userTagSummaryList || []);
        
        this.setData({
          tagData: {
            tagCount: data.tagCount || 0,
            tagUserCount: data.tagUserCount || 0,
            userTagSummaryList: processedList,
            aiContent: data.aiContent
          },
          tagStats: tagStats
        });
        
        console.log('处理后的数据:', this.data.tagData);
        console.log('标签统计:', this.data.tagStats);
      } else {
        console.log('API返回success为false或data为空:', response);
        this.setData({
          tagData: {
            tagCount: 0,
            tagUserCount: 0,
            userTagSummaryList: [],
            aiContent: null
          },
          tagStats: []
        });
      }
    } catch (err) {
      console.error('加载标签数据失败', err);
      wx.showToast({
        title: err.message || '加载数据失败',
        icon: 'none'
      });
      this.setData({
        tagData: {
          tagCount: 0,
          tagUserCount: 0,
          userTagSummaryList: [],
          aiContent: null
        },
        tagStats: []
      });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  // 生成标签统计数据（排行榜）
  generateTagStats(userTagSummaryList) {
    const tagCountMap = {};
    
    // 统计每个标签的出现次数
    userTagSummaryList.forEach(item => {
      (item.tags || []).forEach(tag => {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
      });
    });
    
    // 转换为数组并排序
    const tagStats = Object.entries(tagCountMap)
      .map(([tagName, count]) => ({ tagName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 只取前10个
    
    // 计算百分比（相对于最高标签的比例）
    const maxCount = tagStats.length > 0 ? tagStats[0].count : 1;
    return tagStats.map(item => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100)
    }));
  },

  // 格式化日期
  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  },

  // 获取标签颜色
  getTagColorByName(tagName) {
    // 预定义一些颜色
    const colors = ['#4095E5', '#FF9500', '#4CD964', '#FF3B30', '#5856D6', '#AF52DE', '#FF9500', '#FFCC00'];
    // 根据标签名生成一个固定的颜色索引
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  // 用户头像加载错误处理
  onUserAvatarError(e) {
    console.log('用户头像加载失败:', e);
    this.setData({
      'userInfo.avatarUrl': '/images/empty.png'
    });
  },

  // 标签者头像加载错误处理
  onTaggerAvatarError(e) {
    const { index } = e.currentTarget.dataset;
    const tagData = this.data.tagData;
    tagData.userTagSummaryList[index].taggerAvatarUrl = '/images/empty.png';
    this.setData({ tagData });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
})