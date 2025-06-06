package com.wxtag.mapper;

import com.wxtag.entity.UserAnalysis;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户AI分析Mapper接口
 */
@Mapper
public interface UserAnalysisMapper {
    
    /**
     * 根据用户openId和邀请UUID获取AI分析内容
     */
    UserAnalysis selectByOpenIdAndInvitationUuid(@Param("openId") String openId, @Param("invitationUuid") String invitationUuid);
    
    /**
     * 根据邀请UUID获取AI分析内容（获取最新的一条）
     */
    UserAnalysis selectByInvitationUuid(@Param("invitationUuid") String invitationUuid);
    
    /**
     * 根据用户openId获取最新的AI分析内容
     */
    UserAnalysis selectLatestByOpenId(@Param("openId") String openId);
    
    /**
     * 插入用户AI分析记录
     */
    int insert(UserAnalysis userAnalysis);
    
    /**
     * 更新用户AI分析记录
     */
    int update(UserAnalysis userAnalysis);
} 