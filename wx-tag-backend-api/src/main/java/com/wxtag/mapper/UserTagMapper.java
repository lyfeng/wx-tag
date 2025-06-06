package com.wxtag.mapper;

import com.wxtag.entity.UserTagDetail;
import com.wxtag.entity.UserTagSummary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 用户标签Mapper接口
 */
@Mapper
public interface UserTagMapper {
    
    /**
     * 插入用户标签明细
     */
    int insertDetail(UserTagDetail detail);
    
    /**
     * 插入用户标签汇总
     */
    int insertSummary(UserTagSummary summary);
    
    /**
     * 根据openid查询用户给他人的标签
     */
    List<UserTagSummary> selectGivenTagsByOpenid(@Param("taggerOpenid") String taggerOpenid);
    
    /**
     * 根据openid查询用户收到的标签
     */
    List<UserTagSummary> selectReceivedTagsByOpenid(@Param("openid") String openid);
    
    /**
     * 根据邀请ID查询标签
     */
    List<UserTagSummary> selectTagsByInvitationId(@Param("invitationId") Long invitationId);
    
    /**
     * 根据openid统计收到的标签数量
     */
    List<Map<String, Object>> countTagsByOpenid(@Param("openid") String openid);
    
    /**
     * 根据openid查询收到的总标签数
     */
    Integer countTotalTagsByOpenid(@Param("openid") String openid);
    
    /**
     * 根据openid统计给该用户打标签的不同用户数量
     */
    Integer countTaggersByOpenid(@Param("openid") String openid);
    
    /**
     * 根据打标签者和被标记者openid查询标签列表
     */
    List<String> selectTagsByTaggerAndOpenid(@Param("taggerOpenid") String taggerOpenid, @Param("openid") String openid);
    
    /**
     * 统计指定用户对指定邀请的打标签数量
     */
    Integer countTagsByTaggerAndInvitation(@Param("taggerOpenid") String taggerOpenid, @Param("invitationCode") String invitationCode);
    
    /**
     * 统计用户给自己打标签的数量
     */
    Integer countSelfTags(@Param("openid") String openid);
} 