package com.wxtag.mapper;

import com.wxtag.entity.Invitation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 邀请任务Mapper接口
 */
@Mapper
public interface InvitationMapper {
    
    /**
     * 根据用户openid查询邀请任务
     */
    List<Invitation> selectByOpenid(@Param("openid") String openid);
    
    /**
     * 根据邀请码查询邀请任务
     */
    Invitation selectByInvitationCode(@Param("invitationCode") String invitationCode);
    
    /**
     * 根据ID查询邀请任务
     */
    Invitation selectById(@Param("id") Long id);
    
    /**
     * 插入邀请任务
     */
    int insert(Invitation invitation);
    
    /**
     * 更新邀请任务
     */
    int updateById(Invitation invitation);
    
    /**
     * 删除邀请任务
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 根据openid获取当前进行中的邀请任务
     */
    Invitation selectActiveByOpenid(@Param("openid") String openid);
} 