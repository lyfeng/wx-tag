CREATE DATABASE IF NOT EXISTS wx_tag DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wx_tag;


-- 用户表
CREATE TABLE IF NOT EXISTS `wx_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `open_id` varchar(64) NOT NULL COMMENT '微信OpenID',
  `union_id` varchar(64) DEFAULT NULL COMMENT '微信UnionID',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint(4) DEFAULT '0' COMMENT '性别：0未知，1男，2女',
  `country` varchar(64) DEFAULT NULL COMMENT '国家',
  `province` varchar(64) DEFAULT NULL COMMENT '省份',
  `city` varchar(64) DEFAULT NULL COMMENT '城市',
  `language` varchar(32) DEFAULT NULL COMMENT '语言',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_open_id` (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='微信用户表';

-- 标签表
CREATE TABLE IF NOT EXISTS `tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `tag_uuid` varchar(36) NOT NULL COMMENT '标签UUID',
  `tag_name` varchar(32) NOT NULL COMMENT '标签名称',
  `description` varchar(255) DEFAULT NULL COMMENT '标签描述',
  `category` varchar(32) DEFAULT NULL COMMENT '标签分类',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tag_uuid` (`tag_uuid`),
  UNIQUE KEY `uk_tag_name` (`tag_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 用户打标签汇总表
CREATE TABLE IF NOT EXISTS `user_tag_summary` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID',
  `openid` varchar(64) NOT NULL COMMENT '被标记的用户OpenID',
  `nickname` varchar(64) DEFAULT NULL COMMENT '被标记的用户昵称',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '被标记的用户头像URL',
  `tagger_openid` varchar(64) NOT NULL COMMENT '打标签的用户OpenID',
  `tagger_nickname` varchar(64) DEFAULT NULL COMMENT '打标签的用户昵称',
  `tagger_avatar_url` varchar(500) DEFAULT NULL COMMENT '打标签的用户头像URL',
  `invitation_uuid` varchar(36) DEFAULT NULL COMMENT '邀请UUID',
  `tag_summary` varchar(1000) NOT NULL COMMENT '标签汇总内容',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_tag_summary_uuid` (`user_tag_summary_uuid`),
  UNIQUE KEY `uk_relation` (`openid`,`tagger_openid`,`invitation_uuid`),
  KEY `idx_openid` (`openid`),
  KEY `idx_tagger_openid` (`tagger_openid`),
  KEY `idx_invitation_uuid` (`invitation_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户标签汇总表';

-- 用户打标签明细表
CREATE TABLE IF NOT EXISTS `user_tag_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_tag_summary_uuid` varchar(36) NOT NULL COMMENT '用户标签关系UUID',
  `openid` varchar(64) NOT NULL COMMENT '被标记的用户OpenID',
  `tagger_openid` varchar(64) NOT NULL COMMENT '打标签的用户OpenID',
  `tag_uuid` varchar(36) NOT NULL COMMENT '标签UUID',
  `tag_name` varchar(32) NOT NULL COMMENT '标签名称',
  `invitation_uuid` varchar(36) DEFAULT NULL COMMENT '邀请UUID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_relation` (`openid`,`tagger_openid`,`tag_uuid`),
  KEY `idx_openid` (`openid`),
  KEY `idx_tagger_openid` (`tagger_openid`),
  KEY `idx_tag_uuid` (`tag_uuid`),
  KEY `idx_user_tag_summary_uuid` (`user_tag_summary_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户标签明细表';

-- 邀请任务表
CREATE TABLE IF NOT EXISTS `invitation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '邀请ID',
  `invitation_uuid` varchar(36) NOT NULL COMMENT '邀请UUID',
  `openid` varchar(64) NOT NULL COMMENT '发起邀请的用户OpenID',
  `nickname` varchar(64) DEFAULT NULL COMMENT '发起邀请的用户昵称',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '发起邀请的用户头像URL',
  `invitation_code` varchar(32) NOT NULL COMMENT '邀请码',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0已关闭，1进行中',
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invitation_uuid` (`invitation_uuid`),
  UNIQUE KEY `uk_invitation_code` (`invitation_code`),
  KEY `idx_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请任务表';

-- 用户AI评语表
CREATE TABLE IF NOT EXISTS `user_analysis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `analysis_uuid` varchar(36) NOT NULL COMMENT '分析UUID',
  `open_id` varchar(64) NOT NULL COMMENT '用户OpenID',
  `invitation_uuid` varchar(36) NOT NULL COMMENT '关联的邀请UUID',
  `analysis_content` text COMMENT 'AI分析内容',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_analysis_uuid` (`analysis_uuid`),
  UNIQUE KEY `uk_user_invitation` (`open_id`, `invitation_uuid`),
  KEY `idx_invitation_uuid` (`invitation_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户AI评语表';
