-- 为user_tag_detail表添加user_tag_summary_uuid索引
ALTER TABLE `user_tag_detail` ADD INDEX `idx_user_tag_summary_uuid` (`user_tag_summary_uuid`); 