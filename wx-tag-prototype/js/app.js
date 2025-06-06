// 标签选择功能
function toggleTag(element) {
  // 检查已选中的标签数量
  const selectedTags = document.querySelectorAll('.tag-selected').length;
  
  // 如果标签未选中且已选中数量小于5，或者标签已选中
  if ((!element.classList.contains('tag-selected') && selectedTags < 5) || element.classList.contains('tag-selected')) {
    element.classList.toggle('tag-selected');
  } else if (!element.classList.contains('tag-selected') && selectedTags >= 5) {
    alert('最多只能选择5个标签');
  }
}

// 页面导航
function navigateTo(page) {
  window.location.href = page;
}

// 简易模拟微信登录
function wxLogin() {
  // 在原型中，只是简单地跳转到首页
  navigateTo('home.html');
}

// 模拟提交标签
function submitTags() {
  const selectedTags = document.querySelectorAll('.tag-selected');
  if (selectedTags.length === 0) {
    alert('请至少选择一个标签');
    return;
  }
  
  alert('标签提交成功！');
  navigateTo('home.html');
}

// 模拟分享给朋友
function shareToFriends() {
  // 在原型中，模拟分享行为
  alert('已生成分享链接，可分享给朋友或发布到朋友圈');
  
  // 在实际应用中，这里会调用微信的分享API
  // 这里为了演示，我们直接跳转到一个模拟的分享成功页面
  setTimeout(function() {
    // 这里保持在当前页面，只是显示提示
  }, 1000);
}

// 提交标签并提示分享
function submitTagsAndShare() {
  const selectedTags = document.querySelectorAll('.tag-selected');
  if (selectedTags.length === 0) {
    alert('请至少选择一个标签');
    return;
  }
  
  alert('标签提交成功！');
  navigateTo('tag_success.html');
}

// 检查是否已经给某位好友打过标签
// 在实际应用中，这应该是通过后端API来检查的
// 在原型中，我们使用localStorage来模拟这个功能
function checkIfAlreadyTagged(friendId) {
  // 在实际应用中，friendId应该是好友的唯一标识符
  // 在原型中，我们使用好友的名字作为简单示例
  const taggedFriends = JSON.parse(localStorage.getItem('taggedFriends') || '{}');
  
  if (taggedFriends[friendId]) {
    return true;
  }
  return false;
}

// 保存用户给好友打的标签
function saveTagsForFriend(friendId, tags) {
  // 获取已有的数据
  const taggedFriends = JSON.parse(localStorage.getItem('taggedFriends') || '{}');
  
  // 保存当前好友的标签
  taggedFriends[friendId] = tags;
  
  // 保存回localStorage
  localStorage.setItem('taggedFriends', JSON.stringify(taggedFriends));
}

// 获取已经给好友打过的标签
function getTagsForFriend(friendId) {
  const taggedFriends = JSON.parse(localStorage.getItem('taggedFriends') || '{}');
  return taggedFriends[friendId] || [];
}

// 更新AI评语区域状态
function updateAICommentStatus() {
  // 从本地存储获取任务状态（实际应用中应从服务器获取）
  const taskStatus = localStorage.getItem('taskStatus') || 'collecting';
  const hasComment = localStorage.getItem('aiComment') ? true : false;
  
  // 获取三个状态区域元素
  const countdownElement = document.getElementById('task-countdown');
  const generateElement = document.getElementById('generate-comment');
  const commentElement = document.getElementById('ai-comment');
  
  // 如果元素不存在，可能不在首页，直接返回
  if (!countdownElement || !generateElement || !commentElement) {
    return;
  }
  
  // 根据任务状态显示对应区域
  if (taskStatus === 'collecting') {
    // 标签收集中，显示倒计时
    countdownElement.style.display = 'block';
    generateElement.style.display = 'none';
    commentElement.style.display = 'none';
    
    // 更新倒计时
    updateCountdown();
  } else if (taskStatus === 'ended' && !hasComment) {
    // 任务已结束但未生成评语，显示生成按钮
    countdownElement.style.display = 'none';
    generateElement.style.display = 'block';
    commentElement.style.display = 'none';
  } else if (hasComment) {
    // 已生成评语，显示评语内容
    countdownElement.style.display = 'none';
    generateElement.style.display = 'none';
    commentElement.style.display = 'block';
    
    // 如果有存储的评语内容，加载它
    if (localStorage.getItem('aiComment')) {
      commentElement.textContent = localStorage.getItem('aiComment');
    }
  }
}

// 更新倒计时
function updateCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');
  if (!countdownTimer) return;
  
  // 获取结束时间（实际应用中应从服务器获取）
  // 这里模拟一个结束时间，比如从现在起24小时后
  const endTimeStr = localStorage.getItem('taskEndTime');
  if (!endTimeStr) {
    // 如果没有设置结束时间，设置一个24小时后的结束时间
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    localStorage.setItem('taskEndTime', endTime.toISOString());
  }
  
  const endTime = new Date(localStorage.getItem('taskEndTime'));
  const now = new Date();
  
  // 计算剩余时间（毫秒）
  let remainingTime = endTime - now;
  
  if (remainingTime <= 0) {
    // 时间已到，更新任务状态
    localStorage.setItem('taskStatus', 'ended');
    updateAICommentStatus();
    return;
  }
  
  // 计算小时、分钟
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  remainingTime -= hours * (1000 * 60 * 60);
  
  const minutes = Math.floor(remainingTime / (1000 * 60));
  
  // 更新倒计时显示
  countdownTimer.textContent = `${hours}小时${minutes}分钟`;
  
  // 每分钟更新一次
  setTimeout(updateCountdown, 60000);
}

// 生成AI评语
function generateAIComment() {
  // 实际应用中应调用后端API生成评语
  // 这里模拟一个简单的评语内容
  const aiComment = "在朋友眼中，你是一个温柔善良的人，对他人细心体贴。你的幽默感让人愉快，同时也展现出勇敢面对挑战的一面。继续保持这些优秀的品质，你的魅力会感染更多人！";
  
  // 存储评语
  localStorage.setItem('aiComment', aiComment);
  
  // 更新UI状态
  updateAICommentStatus();
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
  // 更新AI评语状态
  updateAICommentStatus();
});

// 测试功能：切换AI评语的不同状态
function testAICommentMode(mode) {
  if (mode === 'collecting') {
    // 收集标签中状态（显示倒计时）
    localStorage.setItem('taskStatus', 'collecting');
    // 设置24小时后的结束时间
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    localStorage.setItem('taskEndTime', endTime.toISOString());
    // 清除AI评语
    localStorage.removeItem('aiComment');
  } else if (mode === 'ended') {
    // 已结束但未生成评语状态（显示生成按钮）
    localStorage.setItem('taskStatus', 'ended');
    // 清除AI评语
    localStorage.removeItem('aiComment');
  } else if (mode === 'commented') {
    // 已生成评语状态（显示评语内容）
    localStorage.setItem('taskStatus', 'ended');
    localStorage.setItem('aiComment', "在朋友眼中，你是一个温柔善良的人，对他人细心体贴。你的幽默感让人愉快，同时也展现出勇敢面对挑战的一面。继续保持这些优秀的品质，你的魅力会感染更多人！");
  }
  
  // 更新UI状态
  updateAICommentStatus();
} 