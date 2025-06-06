-- =================================================================
-- 数据库表字段重命名回滚脚本
-- 将 user_tag_summary_uuid 字段回滚为 user_tag_detail_uuid
-- =================================================================

USE wx_tag;

-- =================================================================
-- 回滚操作：将 user_tag_summary_uuid 改回 user_tag_detail_uuid
-- =================================================================

-- 1. 回滚 user_tag_summary 表
-- 重命名字段
ALTER TABLE `user_tag_summary` 
CHANGE COLUMN `user_tag_summary_uuid` `user_tag_detail_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- 更新索引名称
ALTER TABLE `user_tag_summary` 
DROP INDEX IF EXISTS `uk_user_tag_summary_uuid`;

ALTER TABLE `user_tag_summary` 
ADD UNIQUE KEY `uk_user_tag_detail_uuid` (`user_tag_detail_uuid`);

-- 2. 回滚 user_tag_detail 表
-- 重命名字段
ALTER TABLE `user_tag_detail` 
CHANGE COLUMN `user_tag_summary_uuid` `user_tag_detail_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- =================================================================
-- 验证回滚结果
-- =================================================================

SELECT '=== user_tag_summary 表结构 ===' as info;
DESCRIBE user_tag_summary;

SELECT '=== user_tag_detail 表结构 ===' as info;  
DESCRIBE user_tag_detail;

SELECT '=== user_tag_summary 表索引 ===' as info;
SHOW INDEX FROM user_tag_summary;

SELECT '=== user_tag_detail 表索引 ===' as info;
SHOW INDEX FROM user_tag_detail; 