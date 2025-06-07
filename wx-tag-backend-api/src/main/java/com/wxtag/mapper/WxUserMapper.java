package com.wxtag.mapper;

import com.wxtag.entity.WxUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 微信用户Mapper接口
 */
@Mapper
public interface WxUserMapper {
    
    /**
     * 根据openId查询用户
     */
    WxUser selectByOpenId(@Param("openId") String openId);
    
    /**
     * 插入用户
     */
    int insert(WxUser user);
    
    /**
     * 更新用户信息
     */
    int updateByOpenId(WxUser user);
    
    /**
     * 根据ID查询用户
     */
    WxUser selectById(@Param("id") Long id);

    /**
     * 根据openId列表批量查询用户
     */
    List<WxUser> selectByOpenIds(@Param("openIds") List<String> openIds);
} 