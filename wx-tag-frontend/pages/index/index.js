const app = getApp();

Page({
  data: {
    isLoading: false,
    canIUseGetUserProfile: false,
    agreedToTerms: false,  // 新增：用户是否同意协议
    returnPage: '' // 新增：登录后返回的页面路径
  },

  onLoad(options) {
    // 判断是否支持getUserProfile接口
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 保存返回页面路径
    if (options.returnPage) {
      const returnPage = decodeURIComponent(options.returnPage);
      this.setData({
        returnPage: returnPage
      });
    }
    
    // 如果已登录且用户信息完整，直接跳转
    const userInfo = wx.getStorageSync('userInfo');
    if (app.globalData.isLoggedIn && userInfo && userInfo.avatarUrl && userInfo.nickName) {
      this.handleLoginSuccess();
    }
  },

  // 执行登录操作
  performLogin() {
    if (this.data.isLoading) return;
    
    this.setData({
      isLoading: true
    });
    
    app.login((success) => {
      // 无论成功失败都要重置loading状态
      this.setData({
        isLoading: false
      });
      
      if (success) {
        const userInfo = wx.getStorageSync('userInfo');
        if (!userInfo || !userInfo.avatarUrl || !userInfo.nickName) {
          // 用户信息不完整，跳转到信息设置页面，并传递返回页面参数
          const returnPageParam = this.data.returnPage ? 
            `?returnPage=${encodeURIComponent(this.data.returnPage)}` : '';
          wx.redirectTo({
            url: `/pages/userProfile/userProfile${returnPageParam}`
          });
        } else {
          this.handleLoginSuccess();
        }
      }
      // 登录失败的情况已经在app.login中处理了错误提示
    });
  },

  // 处理登录成功后的跳转
  handleLoginSuccess() {
    // 确保全局登录状态已更新
    app.globalData.isLoggedIn = true;
    
    if (this.data.returnPage) {
      // 如果有返回页面，则跳转到返回页面
      wx.redirectTo({
        url: this.data.returnPage,
        fail: (error) => {
          // 如果跳转失败，则跳转到首页
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      });
    } else {
      // 否则跳转到首页，增加短暂延迟确保状态同步
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 50);
    }
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

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      agreedToTerms: !this.data.agreedToTerms
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