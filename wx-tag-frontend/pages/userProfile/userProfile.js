const app = getApp();
const { userApi } = require('../../utils/api');

Page({
  data: {
    step: 1, // 1: 头像授权, 2: 设置昵称
    tempUserInfo: {
      avatarUrl: '',
      nickName: '',
      openId: ''
    },
    returnPage: '' // 新增：返回页面路径
  },

  onLoad(options) {
    console.log('用户信息设置页面加载，参数：', options);
    
    // 保存返回页面路径
    if (options.returnPage) {
      const returnPage = decodeURIComponent(options.returnPage);
      console.log('保存返回页面路径：', returnPage);
      this.setData({
        returnPage: returnPage
      });
    }

    // 获取传递过来的用户信息
    const openid = wx.getStorageSync('openid');
    const tempUserInfo = {
      avatarUrl: options.avatarUrl || '',
      nickName: options.nickName || '',
      openId: openid
    };
    
    this.setData({
      tempUserInfo,
      // 如果有昵称，直接进入第二步
      step: options.nickName ? 2 : 1
    });
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

  // 处理头像授权
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
      
      this.setData({
        'tempUserInfo.avatarUrl': finalAvatarUrl
      });

      // 获取到头像后自动进入下一步
      setTimeout(() => {
        this.setData({ step: 2 });
      }, 500);
    } catch (error) {
      console.error('头像处理失败：', error);
      wx.showToast({
        title: '头像设置失败',
        icon: 'none'
      });
    }
  },

  // 处理昵称输入
  onNicknameInput(e) {
    const nickName = e.detail.value.trim();
    this.setData({
      'tempUserInfo.nickName': nickName
    });
  },

  // 处理提交
  async handleSubmit() {
    const { avatarUrl, nickName, openId } = this.data.tempUserInfo;
    
    if (!avatarUrl) {
      wx.showToast({
        title: '请先设置头像',
        icon: 'none'
      });
      this.setData({ step: 1 });
      return;
    }

    if (!nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    if (!openId) {
      wx.showToast({
        title: '用户信息异常，请重新登录',
        icon: 'none'
      });
      // 重新登录
      wx.reLaunch({
        url: '/pages/index/index'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    try {
      // 更新用户信息到服务器
      await app.updateUserInfo(this.data.tempUserInfo);

      wx.hideLoading();
      wx.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 1500
      });

      // 延迟跳转
      setTimeout(() => {
        if (this.data.returnPage) {
          // 如果有返回页面，则跳转到返回页面
          wx.redirectTo({
            url: this.data.returnPage,
            fail: (error) => {
              console.error('跳转到返回页面失败：', error);
              // 如果跳转失败，则跳转到首页
              wx.switchTab({
                url: '/pages/home/home'
              });
            }
          });
        } else {
          // 否则跳转到首页
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '设置失败',
        icon: 'error'
      });
    }
  }
}); 