// tagSelection.js
const app = getApp();
const { userTagApi } = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    invitationCode: '',
    invitationUuid: '',
    userInfo: null,
    targetUserInfo: null,
    tags: [],
    selectedTags: [],
    categories: [],
    activeCategory: '',
    maxTags: 5,
    loading: true
  },

  onLoad(options) {
    // 获取邀请码 - 优先使用参数，其次从本地存储恢复
    let invitationCode = '';
    
    if (options.invitationCode) {
      invitationCode = options.invitationCode;
      // 保存到本地存储，防止登录跳转后丢失
      wx.setStorageSync('temp_invitationCode', invitationCode);
    } else {
      // 尝试从本地存储恢复
      const tempCode = wx.getStorageSync('temp_invitationCode');
      if (tempCode) {
        invitationCode = tempCode;
      }
    }
    
    this.setData({
      invitationCode: invitationCode
    });
    
    // 检查登录状态
    if (!app.globalData.isLoggedIn) {
      this.handleUnauthorized();
      return;
    }
    
    // 获取当前用户
    this.setData({
      userInfo: app.globalData.userInfo
    });
    
    // 加载标签数据
    this.loadTaggingPageData();
  },

  // 处理未登录状态
  handleUnauthorized() {
    wx.showModal({
      title: '登录提示', 
      content: '请先登录后再进行打标签操作',
      confirmText: '去登录',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          // 构建返回页面URL，包含邀请码参数
          const currentPageUrl = `/pages/tagSelection/tagSelection?invitationCode=${this.data.invitationCode}`;
          const returnPageParam = encodeURIComponent(currentPageUrl);
          
          wx.redirectTo({
            url: `/pages/index/index?returnPage=${returnPageParam}`
          });
        } else {
          // 用户取消登录，返回首页
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }
    });
  },
  
  // 加载打标签页面数据
  async loadTaggingPageData() {
    this.setData({ loading: true });
    
    try {
      const response = await userTagApi.getTaggingPageData(this.data.invitationCode);
      
      if (response.success && response.data) {
        const data = response.data;
        
        // 如果已经打过标签了，跳转到朋友详情页面
        if (data.hasTagged === true) {
          
          wx.showToast({
            title: `您已经给${data.nickname}打过标签了`,
            icon: 'none',
            duration: 2000
          });
          
          // 延迟跳转，让用户看到提示信息
          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/friendDetail/friendDetail?openId=${data.openid}&nickname=${encodeURIComponent(data.nickname)}`
            });
          }, 2000);
          
          return;
        }
        
        // 设置被标记用户信息
        this.setData({
          targetUserInfo: {
            nickname: data.nickname,
            avatarUrl: data.avatarUrl
          }
        });
        
        // 处理标签数据
        const categories = [];
        const tagsByCategory = {};
        
        data.tags.forEach(categoryData => {
          const { category, tags: categoryTags } = categoryData;
          categories.push(category);
          tagsByCategory[category] = categoryTags.map((tagName, index) => ({
            id: `${category}_${index}`, // 生成临时ID
            name: tagName,
            category: category,
            selected: false
          }));
        });
        
        this.setData({
          tags: tagsByCategory,
          categories: categories,
          activeCategory: categories.length > 0 ? categories[0] : ''
        });
      }
    } catch (err) {
      wx.showToast({
        title: err.message || '获取数据失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },
  
  // 切换标签类别
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
  },
  
  // 选择或取消选择标签
  toggleTag(e) {
    const tagName = e.currentTarget.dataset.name;
    const category = e.currentTarget.dataset.category;
    const selectedTags = [...this.data.selectedTags];
    const tagsCopy = JSON.parse(JSON.stringify(this.data.tags));
    
    // 查找对应标签
    const tagIndex = tagsCopy[category].findIndex(tag => tag.name === tagName);
    if (tagIndex === -1) return;
    
    const tag = tagsCopy[category][tagIndex];
    
    // 如果已选中，则取消选中
    if (tag.selected) {
      tag.selected = false;
      const selectedIndex = selectedTags.findIndex(name => name === tagName);
      if (selectedIndex !== -1) {
        selectedTags.splice(selectedIndex, 1);
      }
    } 
    // 如果未选中且未超过最大数量，则选中
    else if (selectedTags.length < this.data.maxTags) {
      tag.selected = true;
      selectedTags.push(tagName);
    } 
    // 如果已经达到最大数量
    else {
      wx.showToast({
        title: `最多只能选择${this.data.maxTags}个标签`,
        icon: 'none'
      });
      return;
    }
    
    tagsCopy[category][tagIndex] = tag;
    
    this.setData({
      tags: tagsCopy,
      selectedTags: selectedTags
    });
  },
  
  // 提交选中的标签
  async submitTags() {
    if (this.data.selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个标签',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    
    try {
      // 根据API文档，需要传递invitationUuid，但我们目前只有invitationCode
      // 这里需要从邀请码转换为UUID，或者后端支持直接使用邀请码
      const submitData = {
        invitationUuid: this.data.invitationCode, // 暂时使用邀请码，可能需要后端调整
        tags: this.data.selectedTags
      };
      
      const response = await userTagApi.postTags(submitData);
      
      if (response.success) {
        // 提交成功，清除临时存储的邀请码
        wx.removeStorageSync('temp_invitationCode');
        
        // 跳转到成功页面
        wx.redirectTo({
          url: '/pages/tagSuccess/tagSuccess'
        });
      }
    } catch (err) {
      wx.showToast({
        title: err.message || '提交失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 页面显示时的处理
  onShow() {
    // 如果当前没有邀请码，尝试从本地存储恢复
    if (!this.data.invitationCode) {
      const tempCode = wx.getStorageSync('temp_invitationCode');
      if (tempCode) {
        this.setData({
          invitationCode: tempCode
        });
        
        // 如果用户已登录且有邀请码，重新加载数据
        if (app.globalData.isLoggedIn) {
          this.loadTaggingPageData();
        }
      }
    }
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `来给${this.data.targetUserInfo?.nickname || '好友'}打标签吧！`,
      path: '/pages/tagSelection/tagSelection?invitationCode=' + this.data.invitationCode,
      imageUrl: ''
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `来给${this.data.targetUserInfo?.nickname || '好友'}打标签吧！`,
      path: '/pages/tagSelection/tagSelection?invitationCode=' + this.data.invitationCode,
      imageUrl: ''
    };
  },

  // 自定义分享按钮事件
  onCustomShare() {
    // 在微信小程序中，无法直接调用系统分享菜单
    // 我们可以提示用户使用右上角的分享按钮
    wx.showModal({
      title: '分享提示',
      content: '请点击页面右上角的"..."按钮来分享给好友',
      showCancel: false,
      confirmText: '知道了'
    });
  }
}); 