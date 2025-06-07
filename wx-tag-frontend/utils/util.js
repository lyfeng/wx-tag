// 工具函数

/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

/**
 * 格式化日期
 */
const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${[year, month, day].map(formatNumber).join('-')}`;
};

/**
 * 格式化数字
 */
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * 生成随机字符串
 */
const randomString = length => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 处理头像URL，为空时返回默认头像
 */
const getAvatarUrl = avatarUrl => {
  return avatarUrl || '/images/empty.png';
};

/**
 * 计算剩余时间
 */
const calculateRemainingTime = endTimeStr => {
  if (!endTimeStr) return null;
  
  const endTime = new Date(endTimeStr).getTime();
  const now = new Date().getTime();
  
  // 已结束
  if (now >= endTime) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isExpired: true
    };
  }
  
  // 计算剩余时间
  const total = endTime - now;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    total,
    isExpired: false
  };
};

/**
 * 根据标签类别返回颜色
 */
const getTagColor = category => {
  const colorMap = {
    '品德': '#4095E5',
    '性格': '#FF9500',
    '能力': '#4CD964'
  };
  
  return colorMap[category] || '#888888';
};

/**
 * 检查是否为空对象
 */
const isEmptyObject = obj => {
  return Object.keys(obj).length === 0;
};

/**
 * 生成分享配置
 * @param {Object} options 配置选项
 * @param {string} options.invitationCode 邀请码
 * @param {Object} options.targetUserInfo 被评价用户信息
 * @param {string} options.currentUserNickname 当前用户昵称
 * @param {string} options.type 分享类型 'appMessage' | 'timeline'
 * @returns {Object} 分享配置对象
 */
const generateShareConfig = (options) => {
  const { invitationCode, targetUserInfo, currentUserNickname, type = 'appMessage' } = options;
  
  if (!invitationCode) {
    return {
      title: '友谊标签 - 给朋友贴标签',
      path: '/pages/index/index'
    };
  }
  
  const shareTitle = targetUserInfo 
    ? `来给${targetUserInfo.nickname}打标签吧！` 
    : `来给${currentUserNickname || '我'}打标签吧！`;
    
  const sharePath = `/pages/tagSelection/tagSelection?invitationCode=${invitationCode}`;
  const shareImage = targetUserInfo?.avatarUrl || '';
  
  if (type === 'timeline') {
    return {
      title: shareTitle,
      query: `invitationCode=${invitationCode}`,
      imageUrl: shareImage
    };
  }
  
  return {
    title: shareTitle,
    path: sharePath,
    imageUrl: shareImage
  };
};

/**
 * 复制邀请码到剪贴板
 * @param {string} invitationCode 邀请码
 */
const copyInvitationCode = (invitationCode) => {
  if (!invitationCode) {
    wx.showToast({
      title: '邀请码不存在',
      icon: 'none'
    });
    return Promise.reject(new Error('邀请码不存在'));
  }
  
  // 构造完整的小程序链接
  const fullLink = `https://wxtag.cn/pages/tagSelection/tagSelection?invitationCode=${invitationCode}`;
  
  return wx.setClipboardData({
    data: fullLink
  }).then(() => {
    wx.showToast({
      title: '链接已复制',
      icon: 'success'
    });
  }).catch((error) => {
    wx.showToast({
      title: '复制失败',
      icon: 'none'
    });
    throw error;
  });
};

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  randomString,
  getAvatarUrl,
  calculateRemainingTime,
  getTagColor,
  isEmptyObject,
  generateShareConfig,
  copyInvitationCode
}; 