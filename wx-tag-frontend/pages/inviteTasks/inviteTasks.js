// pages/inviteTasks/inviteTasks.js
const app = getApp();
const { invitationApi } = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInvitations: [],
    closedInvitations: [],
    currentTab: 'active', // active或closed
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadInvitations();
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
   * 加载邀请任务
   */
  async loadInvitations() {
    this.setData({ loading: true });
    
    try {
      // 检查用户信息是否存在
      if (!app.globalData.userInfo) {
        // 这里可以根据实际情况选择重定向到登录页或者调用获取用户信息的方法
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        this.setData({ loading: false });
        return;
      }
      
      // 从缓存中获取openid，而不是从app.globalData.userInfo中获取
      const openid = wx.getStorageSync('openid');
      
      if (!openid) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        this.setData({ loading: false });
        return;
      }
      
      // 获取进行中的邀请任务
      const activeInvitations = await invitationApi.getActiveInvitations(openid);
      
      // 获取已关闭的邀请任务
      const closedInvitations = await invitationApi.getClosedInvitations(openid);
      
      this.setData({
        activeInvitations,
        closedInvitations
      });
    } catch (err) {
      wx.showToast({
        title: err.message || '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // 创建新邀请
  async createInvitation() {
    wx.showLoading({
      title: '创建中...',
      mask: true
    });
    
    try {
      const openId = app.globalData.userInfo.openId;
      const now = new Date();
      const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天后过期
      
      const invitation = await invitationApi.createInvitation({
        openId: openId,
        status: 1,
        startTime: now.toISOString(),
        endTime: endTime.toISOString()
      });
      
      // 刷新列表
      this.loadInvitations();
      
      // 显示分享弹窗
      this.setData({
        currentInvitation: invitation,
        isShowShareModal: true
      });
    } catch (err) {
      wx.showToast({
        title: err.message || '创建失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 关闭邀请任务
  async closeInvitation(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认关闭',
      content: '关闭后好友将无法继续贴标签，确定要关闭吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '关闭中...',
            mask: true
          });
          
          try {
            await invitationApi.closeInvitation(id);
            
            // 刷新列表
            this.loadInvitations();
            
            wx.showToast({
              title: '关闭成功',
              icon: 'success'
            });
          } catch (err) {
            wx.showToast({
              title: err.message || '关闭失败',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  // 删除邀请任务
  async deleteInvitation(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
            mask: true
          });
          
          try {
            await invitationApi.deleteInvitation(id);
            
            // 刷新列表
            this.loadInvitations();
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (err) {
            wx.showToast({
              title: err.message || '删除失败',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  // 查看邀请详情
  viewInvitationDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/invitationDetail/invitationDetail?id=${id}`
    });
  },

  // 关闭分享弹窗
  closeShareModal() {
    this.setData({
      isShowShareModal: false,
      currentInvitation: null
    });
  },

  // 复制邀请链接
  copyInviteLink() {
    const link = `${app.globalData.shareBaseUrl}?code=${this.data.currentInvitation.invitationCode}`;
    
    wx.setClipboardData({
      data: link,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    if (this.data.currentInvitation) {
      return {
        title: '帮我贴个标签，看看我在你眼中是什么样的吧！',
        path: `/pages/tagForFriend/tagForFriend?code=${this.data.currentInvitation.invitationCode}`,
        imageUrl: '/images/share_img.png'
      };
    }
    return {};
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '我开启了标签收集任务，快来给我贴标签吧！',
      query: `invitationCode=${this.data.currentInvitation?.invitationCode}`
    };
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
})