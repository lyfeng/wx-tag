package com.wxtag.config;

import com.wxtag.model.WxUserDTO;
import com.wxtag.service.WxUserService;
import com.wxtag.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT拦截器
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private WxUserService wxUserService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 跳过登录接口
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/login")) {
            return true;
        }

        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                String openId = jwtUtil.getOpenIdFromToken(token);
                WxUserDTO wxUser = wxUserService.getUserByOpenId(openId);
                // 对/user/update接口跳过用户不存在的校验
                if (wxUser == null && !requestURI.contains("/user/update")) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"success\":false,\"code\":401,\"message\":\"未授权访问\"}");
                    return false;
                }
                request.setAttribute("openId", openId);
                return true;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"success\":false,\"code\":401,\"message\":\"未授权访问\"}");
        return false;
    }
} 