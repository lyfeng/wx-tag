-- =================================================================
-- 数据库表字段重命名脚本
-- 将 user_tag_detail_uuid 字段重命名为 user_tag_summary_uuid
-- =================================================================

USE wx_tag;

-- =================================================================
-- 正向变更：将 user_tag_detail_uuid 改为 user_tag_summary_uuid
-- =================================================================

-- 1. 修改 user_tag_summary 表
-- 重命名字段
ALTER TABLE `user_tag_summary` 
CHANGE COLUMN `user_tag_detail_uuid` `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- 更新唯一索引名称
ALTER TABLE `user_tag_summary` 
DROP INDEX IF EXISTS `uk_user_tag_detail_uuid`;

ALTER TABLE `user_tag_summary` 
ADD UNIQUE KEY `uk_user_tag_summary_uuid` (`user_tag_summary_uuid`);

-- 2. 修改 user_tag_detail 表  
-- 重命名字段
ALTER TABLE `user_tag_detail` 
CHANGE COLUMN `user_tag_detail_uuid` `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- =================================================================
-- 验证变更结果
-- =================================================================

SELECT '=== user_tag_summary 表结构 ===' as info;
DESCRIBE user_tag_summary;

SELECT '=== user_tag_detail 表结构 ===' as info;  
DESCRIBE user_tag_detail;

SELECT '=== user_tag_summary 表索引 ===' as info;
SHOW INDEX FROM user_tag_summary;

SELECT '=== user_tag_detail 表索引 ===' as info;
SHOW INDEX FROM user_tag_detail;

-- =================================================================
-- 回滚脚本（如需要可单独执行）
-- =================================================================

/*
-- 回滚操作：将 user_tag_summary_uuid 改回 user_tag_detail_uuid

-- 1. 回滚 user_tag_summary 表
ALTER TABLE `user_tag_summary` 
CHANGE COLUMN `user_tag_summary_uuid` `user_tag_detail_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- 更新索引名称
ALTER TABLE `user_tag_summary` 
DROP INDEX IF EXISTS `uk_user_tag_summary_uuid`;

ALTER TABLE `user_tag_summary` 
ADD UNIQUE KEY `uk_user_tag_detail_uuid` (`user_tag_detail_uuid`);

-- 2. 回滚 user_tag_detail 表
ALTER TABLE `user_tag_detail` 
CHANGE COLUMN `user_tag_summary_uuid` `user_tag_detail_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';
*/ 