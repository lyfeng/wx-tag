-- 数据库表变更脚本
-- 将 user_tag_detail_uuid 字段重命名为 user_tag_summary_uuid

USE wx_tag;

-- 1. 修改 user_tag_summary 表
-- 重命名字段 user_tag_detail_uuid 为 user_tag_summary_uuid
ALTER TABLE `user_tag_summary` 
CHANGE COLUMN `user_tag_detail_uuid` `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- 更新对应的唯一索引名称（如果原来有的话）
-- 注意：根据原始schema，索引名可能是 uk_user_tag_detail_uuid
ALTER TABLE `user_tag_summary` 
DROP INDEX IF EXISTS `uk_user_tag_detail_uuid`;

ALTER TABLE `user_tag_summary` 
ADD UNIQUE KEY `uk_user_tag_summary_uuid` (`user_tag_summary_uuid`);

-- 2. 修改 user_tag_detail 表  
-- 重命名字段 user_tag_detail_uuid 为 user_tag_summary_uuid
ALTER TABLE `user_tag_detail` 
CHANGE COLUMN `user_tag_detail_uuid` `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID';

-- 注意：user_tag_detail 表中此字段不是唯一索引，所以不需要修改索引

-- 验证修改结果
SELECT 'user_tag_summary表结构:' as info;
DESCRIBE user_tag_summary;

SELECT 'user_tag_detail表结构:' as info;  
DESCRIBE user_tag_detail;

-- 显示索引信息
SELECT 'user_tag_summary表索引:' as info;
SHOW INDEX FROM user_tag_summary;

SELECT 'user_tag_detail表索引:' as info;
SHOW INDEX FROM user_tag_detail; 