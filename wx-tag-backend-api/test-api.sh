#!/bin/bash

# 微标签小程序后端API测试脚本

BASE_URL="http://localhost:8080/api"

echo "=== 微标签小程序后端API测试 ==="

# 1. 测试登录接口（需要真实的微信code，这里只是示例）
echo "1. 测试登录接口..."
curl -X POST "${BASE_URL}/home/login" \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code"}' \
  -w "\n状态码: %{http_code}\n\n"

# 2. 测试获取打标签页面数据（不需要token）
echo "2. 测试获取打标签页面数据..."
curl -X GET "${BASE_URL}/user-tags/home?invitationCode=123456" \
  -H "Content-Type: application/json" \
  -w "\n状态码: %{http_code}\n\n"

# 3. 测试创建用户
echo "3. 测试创建用户..."
curl -X POST "${BASE_URL}/user/update" \
  -H "Content-Type: application/json" \
  -d '{
    "openId": "test_openid_123",
    "nickname": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg",
    "gender": 1,
    "country": "中国",
    "province": "广东省",
    "city": "深圳市"
  }' \
  -w "\n状态码: %{http_code}\n\n"

# 4. 测试创建邀请任务
echo "4. 测试创建邀请任务..."
curl -X POST "${BASE_URL}/invitations" \
  -H "Content-Type: application/json" \
  -d '{
    "openid": "test_openid_123",
    "nickname": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg"
  }' \
  -w "\n状态码: %{http_code}\n\n"

# 5. 测试获取邀请任务状态
echo "5. 测试获取邀请任务状态..."
curl -X GET "${BASE_URL}/invitations/status?openId=test_openid_123" \
  -H "Content-Type: application/json" \
  -w "\n状态码: %{http_code}\n\n"

echo "=== 测试完成 ==="
echo "注意：某些接口需要有效的JWT token才能正常访问"
echo "请先启动应用程序：mvn spring-boot:run" 