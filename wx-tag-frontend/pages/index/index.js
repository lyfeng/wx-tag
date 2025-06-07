const app = getApp();

Page({
  data: {
    isLoading: false,
    canIUseGetUserProfile: false,
    agreedToTerms: false  // 新增：用户是否同意协议
  },

  onLoad() {
    // 判断是否支持getUserProfile接口
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 如果已登录且用户信息完整，直接跳转到首页
    const userInfo = wx.getStorageSync('userInfo');
    if (app.globalData.isLoggedIn && userInfo && userInfo.avatarUrl && userInfo.nickName) {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  },

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      agreedToTerms: !this.data.agreedToTerms
    });
  },

  // 执行登录操作
  performLogin() {
    if (this.data.isLoading) return;
    
    this.setData({
      isLoading: true
    });
    
    app.login((success) => {
      this.setData({
        isLoading: false
      });
      
      // 登录成功后，检查用户信息是否完整
      if (success) {
        const userInfo = wx.getStorageSync('userInfo');
        if (!userInfo || !userInfo.avatarUrl || !userInfo.nickName) {
          // 用户信息不完整，跳转到信息设置页面
          wx.redirectTo({
            url: '/pages/userProfile/userProfile'
          });
        } else {
          // 用户信息完整，跳转到首页
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }
    });
  },

  // 开始登录
  startLogin() {
    if (this.data.isLoading) return;
    
    // 检查是否同意协议
    if (!this.data.agreedToTerms) {
      wx.showModal({
        title: '用户协议确认',
        content: '登录前需要您同意《用户协议》和《隐私政策》，是否同意并继续登录？',
        confirmText: '同意',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              agreedToTerms: true
            });
            this.performLogin();
          }
        }
      });
      return;
    }
    
    this.performLogin();
  },

  // 取消登录，返回着陆页
  goToLanding() {
    wx.redirectTo({
      url: '/pages/landing/landing'
    });
  },

  // 获取用户信息并登录
  getUserProfile() {
    if (this.data.isLoading) return;
    
    // 检查是否同意协议
    if (!this.data.agreedToTerms) {
      wx.showModal({
        title: '用户协议确认',
        content: '登录前需要您同意《用户协议》和《隐私政策》，是否同意并继续登录？',
        confirmText: '同意',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              agreedToTerms: true
            });
            this.performLogin();
          }
        }
      });
      return;
    }
    
    this.performLogin();
  },
  
  // 兼容旧版本的getUserInfo
  getUserInfo(e) {
    if (this.data.isLoading) return;
    
    // 检查是否同意协议
    if (!this.data.agreedToTerms) {
      wx.showModal({
        title: '用户协议确认',
        content: '登录前需要您同意《用户协议》和《隐私政策》，是否同意并继续登录？',
        confirmText: '同意',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              agreedToTerms: true
            });
            this.handleUserInfo(e);
          }
        }
      });
      return;
    }
    
    this.handleUserInfo(e);
  },

  // 处理用户信息
  handleUserInfo(e) {
    if (e.detail.userInfo) {
      this.performLogin();
    } else {
      wx.showToast({
        title: '请授权用户信息',
        icon: 'none'
      });
    }
  }
});