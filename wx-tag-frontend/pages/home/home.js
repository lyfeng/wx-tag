// home.js
const app = getApp();
const { homeApi, invitationApi, apiUtils } = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: {},
    tagCounts: [],
    totalTagCount: 0,
    taggerCount: 0, // 添加评价人数字段
    isShowShareModal: false,
    taskStatus: 1, // 1进行中，0已关闭
    countdownTime: '',
    aiComment: '',
    currentInviteCode: '', // 当前邀请码
    hasTaggedForMySelf: false, // 是否给自己打过标签
    taggerCountInsufficient: false, // 标记评价人数是否不足
    isClosing: false,
    minAiTaggerCount: 3, // 获取AI生成评语所需的最低评价人数
  },

  onLoad() {
    console.log('Home页面加载');
    
    // 检查登录状态
    this.checkLoginStatus();
    this.getUserInfo();
    this.getHomeData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
    
    // 每次显示页面时重新加载数据
    this.getUserInfo();
    this.getHomeData();
  },

  // 检查登录状态
  checkLoginStatus() {
    // 使用API工具方法检查登录状态
    if (!apiUtils.isLoggedIn()) {
      console.log('用户未登录，缺少token');
      
      wx.showModal({
        title: '登录提示',
        content: '检测到您尚未登录，需要先登录才能使用完整功能',
        confirmText: '去登录',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        }
      });
      return false;
    }
    return true;
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const userInfo = await wx.getStorageSync('userInfo') || {}
      this.setData({ userInfo })
      
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  },

  // 获取首页数据
  async getHomeData() {
    try {
      const response = await homeApi.getHomeData();
      console.log('获取首页数据返回:', response);
      
      if (response.success && response.data) {
        const { 
          tagCount = 0, 
          myTagsCount = [], 
          aiContent = '', 
          hasTaggedForMySelf = false,
          taggerCount = 0, // 新增获取评价人数
          minAiTaggerCount = 3 // 获取AI生成评语所需的最低评价人数
        } = response.data;
        
        // 处理标签数据，确保字段名正确
        const processedTagCounts = myTagsCount.map(item => ({
          tagName: item.tagName,
          count: item.tagCount // API返回的是tagCount，模板需要count
        }));
        
        // 判断评价人数是否不足
        const isInsufficientTaggerCount = taggerCount < minAiTaggerCount;
        
        // 设置数据
        this.setData({ 
          tagCounts: processedTagCounts.slice(0, 5), // 只显示前5个
          totalTagCount: tagCount,
          taggerCount: taggerCount, // 设置评价人数
          aiComment: aiContent, // 设置AI评语
          taskStatus: aiContent ? 'commented' : 'ended', // 如果有AI评语则显示评语，否则显示生成按钮
          hasTaggedForMySelf: hasTaggedForMySelf, // 设置是否给自己打过标签
          taggerCountInsufficient: isInsufficientTaggerCount, // 标记评价人数是否不足
          minAiTaggerCount: minAiTaggerCount // 保存最低评价人数要求
        });
        
        // 打印日志，便于调试
        console.log('评价人数:', taggerCount);
        console.log('最低评价人数要求:', minAiTaggerCount);
        console.log('评价人数是否不足:', isInsufficientTaggerCount);
        console.log('taggerCountInsufficient:', this.data.taggerCountInsufficient);
      }
    } catch (error) {
      console.error('获取首页数据失败', error);
    }
  },

  // 创建邀请
  async createInvitation() {
    try {
      // 检查登录状态
      if (!this.checkLoginStatus()) {
        return;
      }
      
      console.log('开始创建邀请任务');
      
      wx.showLoading({
        title: '创建邀请中...',
        mask: true
      });
      
      const response = await invitationApi.createInvitation();
      
      wx.hideLoading();
      
      if (response.success && response.data) {
        const { invitationCode } = response.data;
        console.log('创建邀请成功，邀请码:', invitationCode);
        
        // 设置邀请码并显示分享弹窗
        this.setData({
          currentInviteCode: invitationCode,
          isShowShareModal: true
        });
        
        console.log('显示分享弹窗，状态:', this.data.isShowShareModal);
      } else {
        wx.showToast({
          title: '创建邀请失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('创建邀请失败:', error);
      apiUtils.handleError(error, '创建邀请失败');
    }
  },

  // 创建自己打标签的邀请
  async createSelfTagInvitation() {
    // 检查登录状态
    if (!this.checkLoginStatus()) {
      return;
    }
    
    console.log('开始创建自我标签邀请任务');
    
    try {
      const response = await invitationApi.createInvitation();
      console.log('创建自我标签邀请成功:', response);
      
      if (response.success && response.data) {
        const { invitationCode } = response.data;
        
        wx.showToast({
          title: '邀请创建成功',
          icon: 'success'
        });
        
        // 跳转到tagSelection页面
        wx.navigateTo({
          url: `/pages/tagSelection/tagSelection?invitationCode=${invitationCode}`
        });
      }
    } catch (error) {
      console.error('创建自我标签邀请失败:', error);
      apiUtils.handleError(error, '创建邀请失败');
    }
  },

  // 页面跳转
  navigateToTaggedByMe() {
    wx.navigateTo({
      url: '/pages/taggedByMe/taggedByMe'
    })
  },

  navigateToMyTags() {
    console.log('点击了别人给我的标签按钮');
    wx.showToast({
      title: '按钮被点击了',
      icon: 'success'
    });
    
    try {
      wx.switchTab({
        url: '/pages/myTags/myTags',
        success: function(res) {
          console.log('页面跳转成功', res);
        },
        fail: function(err) {
          console.error('页面跳转失败', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } catch (error) {
      console.error('跳转出现异常', error);
      wx.showToast({
        title: '跳转出现异常',
        icon: 'none'
      });
    }
  },

  // 分享相关
  onShareAppMessage() {
    const { currentInviteCode, userInfo } = this.data;
    
    return util.generateShareConfig({
      invitationCode: currentInviteCode,
      currentUserNickname: userInfo.nickname,
      type: 'appMessage'
    });
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { currentInviteCode, userInfo } = this.data;
    
    return util.generateShareConfig({
      invitationCode: currentInviteCode,
      currentUserNickname: userInfo.nickname,
      type: 'timeline'
    });
  },

  closeShareModal() {
    console.log('关闭分享弹窗');
    // 设置动画效果，先变为透明，然后再隐藏
    this.setData({
      isClosing: true
    });
    
    // 300毫秒后完全关闭弹窗
    setTimeout(() => {
      this.setData({
        isShowShareModal: false,
        isClosing: false
      });
    }, 300);
  },

  // 生成AI评语（实际是重新获取数据检查是否有新的AI评语）
  async generateAIComment() {
    // 先检查评价人数是否足够
    if (this.data.taggerCount < this.data.minAiTaggerCount) {
      wx.showModal({
        title: '评价人数不足',
        content: '当前评价人数不足' + this.data.minAiTaggerCount + '人，请邀请更多朋友给您评价后再生成AI评语。',
        confirmText: '去邀请',
        cancelText: '我知道了',
        success: (res) => {
          if (res.confirm) {
            // 点击"去邀请"，创建邀请
            this.createInvitation();
          }
        }
      });
      return;
    }
    
    wx.showLoading({
      title: '生成中...'
    });
    
    try {
      // 调用生成AI评语接口
      const response = await homeApi.generateAiComment();
      
      wx.hideLoading();
      
      if (response.success && response.data) {
        // 更新AI评语
        this.setData({
          aiComment: response.data,
          taskStatus: 'commented'
        });
        
        wx.showToast({
          title: 'AI评语已生成',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: response.message || '评语生成失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('生成AI评语失败:', error);
      apiUtils.handleError(error, '生成AI评语失败');
    }
  },

  // 头像加载错误处理
  onAvatarError(e) {
    console.log('头像加载失败:', e);
    this.setData({
      'userInfo.avatarUrl': '/images/empty.png'
    });
  },
  
  // 跳转到查看给自己打的标签详情页
  navigateToSelfTagDetail() {
    // 获取当前用户openId
    const openId = app.globalData.userInfo.openId;
    
    wx.navigateTo({
      url: `/pages/friendDetail/friendDetail?openId=${openId}`
    });
  },

  // 广告相关事件处理
  onAdLoad() {
    console.log('广告加载成功');
  },

  onAdError(err) {
    console.error('广告加载失败', err);
  },

  onAdClose() {
    console.log('广告被关闭');
  },

  // 将图片转换为base64
  async imageToBase64(filePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath,
        encoding: 'base64',
        success: res => {
          resolve('data:image/jpeg;base64,' + res.data);
        },
        fail: err => {
          console.error('图片转base64失败：', err);
          reject(err);
        }
      });
    });
  },

  // 选择头像
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    
    try {
      let finalAvatarUrl = avatarUrl;
      
      // 如果不是微信头像，需要转换为base64
      if (e.detail.source !== 'avatar') {
        wx.showLoading({
          title: '处理中...',
          mask: true
        });
        
        try {
          // 压缩图片
          const compressRes = await wx.compressImage({
            src: avatarUrl,
            quality: 80
          });
          
          // 转换为base64
          finalAvatarUrl = await this.imageToBase64(compressRes.tempFilePath);
        } catch (error) {
          console.error('图片处理失败：', error);
          throw new Error('图片处理失败');
        } finally {
          wx.hideLoading();
        }
      }
      
      // 更新用户信息
      const userInfo = this.data.userInfo || {};
      userInfo.avatarUrl = finalAvatarUrl;
      
      this.setData({
        userInfo
      });
      
      // 更新到服务器
      await app.updateUserInfo(userInfo);

      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('头像更新失败：', error);
      wx.showToast({
        title: '头像更新失败',
        icon: 'error'
      });
    }
  },

  // 昵称变更
  onNicknameChange(e) {
    const nickName = e.detail.value;
    const userInfo = this.data.userInfo || {};
    userInfo.nickName = nickName;
    
    this.setData({
      userInfo
    });
    
    // 更新到服务器
    app.updateUserInfo(userInfo);
  },
});