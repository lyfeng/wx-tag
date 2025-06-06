package com.wxtag.common;

import lombok.Data;

/**
 * API统一响应结构
 */
@Data
public class ApiResponse<T> {
    
    /**
     * 是否成功
     */
    private boolean success;
    
    /**
     * 响应码
     */
    private int code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(200);
        response.setMessage("操作成功");
        response.setData(data);
        return response;
    }
    
    /**
     * 成功响应（自定义消息）
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }
    
    /**
     * 失败响应
     */
    public static <T> ApiResponse<T> fail(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(400);
        response.setMessage(message);
        return response;
    }
    
    /**
     * 失败响应（自定义错误码）
     */
    public static <T> ApiResponse<T> fail(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
} 