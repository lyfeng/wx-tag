package com.wxtag.mapper;

import com.wxtag.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 标签Mapper接口
 */
@Mapper
public interface TagMapper {
    
    /**
     * 查询所有标签
     */
    List<Tag> selectAll();
    
    /**
     * 根据分类查询标签
     */
    List<Tag> selectByCategory(@Param("category") String category);
    
    /**
     * 根据标签名称查询
     */
    Tag selectByName(@Param("tagName") String tagName);
    
    /**
     * 插入标签
     */
    int insert(Tag tag);
} 