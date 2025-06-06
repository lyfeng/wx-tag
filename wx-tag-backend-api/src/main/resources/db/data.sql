USE wx_tag;

-- 插入基础标签数据
INSERT INTO tag (tag_uuid, tag_name, description, category, sort_order, created_at, updated_at) VALUES
-- 性格特质
(UUID(), '开朗', '性格开朗活泼', '性格特质', 1, NOW(), NOW()),
(UUID(), '内向', '性格内向安静', '性格特质', 2, NOW(), NOW()),
(UUID(), '幽默', '很有幽默感', '性格特质', 3, NOW(), NOW()),
(UUID(), '认真', '做事认真负责', '性格特质', 4, NOW(), NOW()),
(UUID(), '温柔', '性格温柔体贴', '性格特质', 5, NOW(), NOW()),
(UUID(), '热情', '待人热情', '性格特质', 6, NOW(), NOW()),

-- 能力特长
(UUID(), '聪明', '很聪明', '能力特长', 1, NOW(), NOW()),
(UUID(), '有才华', '多才多艺', '能力特长', 2, NOW(), NOW()),
(UUID(), '领导力', '有领导能力', '能力特长', 3, NOW(), NOW()),
(UUID(), '创意', '很有创意', '能力特长', 4, NOW(), NOW()),
(UUID(), '执行力', '执行力强', '能力特长', 5, NOW(), NOW()),
(UUID(), '沟通能力', '沟通能力强', '能力特长', 6, NOW(), NOW()),

-- 外貌特征
(UUID(), '帅气', '长得很帅', '外貌特征', 1, NOW(), NOW()),
(UUID(), '漂亮', '长得很漂亮', '外貌特征', 2, NOW(), NOW()),
(UUID(), '可爱', '很可爱', '外貌特征', 3, NOW(), NOW()),
(UUID(), '气质', '很有气质', '外貌特征', 4, NOW(), NOW()),
(UUID(), '时尚', '很时尚', '外貌特征', 5, NOW(), NOW()),

-- 兴趣爱好
(UUID(), '运动', '喜欢运动', '兴趣爱好', 1, NOW(), NOW()),
(UUID(), '音乐', '喜欢音乐', '兴趣爱好', 2, NOW(), NOW()),
(UUID(), '读书', '喜欢读书', '兴趣爱好', 3, NOW(), NOW()),
(UUID(), '旅行', '喜欢旅行', '兴趣爱好', 4, NOW(), NOW()),
(UUID(), '美食', '喜欢美食', '兴趣爱好', 5, NOW(), NOW()),
(UUID(), '游戏', '喜欢游戏', '兴趣爱好', 6, NOW(), NOW()); 

-- 插入测试用户数据
INSERT INTO wx_user (open_id, union_id, nickname, avatar_url, gender, country, province, city, language, created_at, updated_at) VALUES
-- 主要测试用户
('oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'union_001', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 1, '中国', '广东', '深圳', 'zh_CN', NOW(), NOW()),
-- 其他测试用户（用来给主用户打标签）
('oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'union_002', '李小红', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx2/132', 2, '中国', '北京', '北京', 'zh_CN', NOW(), NOW()),
('oj1uy7dY58Sgh3lxSQjSPVv-Test2', 'union_003', '王小刚', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx3/132', 1, '中国', '上海', '上海', 'zh_CN', NOW(), NOW()),
('oj1uy7dY58Sgh3lxSQjSPVv-Test3', 'union_004', '赵小美', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx4/132', 2, '中国', '浙江', '杭州', 'zh_CN', NOW(), NOW()),
('oj1uy7dY58Sgh3lxSQjSPVv-Test4', 'union_005', '陈小伟', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx5/132', 1, '中国', '江苏', '南京', 'zh_CN', NOW(), NOW());

-- 插入邀请任务数据
INSERT INTO invitation (invitation_uuid, openid, nickname, avatar_url, invitation_code, status, start_time, end_time, created_at, updated_at) VALUES
-- 张小明发起的邀请任务
('invitation-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'INV001', 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
-- 其他用户发起的邀请任务
('invitation-uuid-002', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', '李小红', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx2/132', 'INV002', 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW());

-- 插入用户标签明细数据（其他用户给张小明打标签）
INSERT INTO user_tag_detail (user_tag_summary_uuid, openid, tagger_openid, tag_uuid, tag_name, invitation_uuid, created_at, updated_at) VALUES
-- 李小红给张小明打的标签
('detail-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', (SELECT tag_uuid FROM tag WHERE tag_name = '开朗' LIMIT 1), '开朗', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-002', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', (SELECT tag_uuid FROM tag WHERE tag_name = '幽默' LIMIT 1), '幽默', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-003', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', (SELECT tag_uuid FROM tag WHERE tag_name = '聪明' LIMIT 1), '聪明', 'invitation-uuid-002', NOW(), NOW()),

-- 王小刚给张小明打的标签
('detail-uuid-004', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test2', (SELECT tag_uuid FROM tag WHERE tag_name = '热情' LIMIT 1), '热情', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-005', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test2', (SELECT tag_uuid FROM tag WHERE tag_name = '有才华' LIMIT 1), '有才华', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-006', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test2', (SELECT tag_uuid FROM tag WHERE tag_name = '帅气' LIMIT 1), '帅气', 'invitation-uuid-002', NOW(), NOW()),

-- 赵小美给张小明打的标签
('detail-uuid-007', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test3', (SELECT tag_uuid FROM tag WHERE tag_name = '认真' LIMIT 1), '认真', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-008', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test3', (SELECT tag_uuid FROM tag WHERE tag_name = '沟通能力' LIMIT 1), '沟通能力', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-009', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test3', (SELECT tag_uuid FROM tag WHERE tag_name = '运动' LIMIT 1), '运动', 'invitation-uuid-002', NOW(), NOW()),

-- 陈小伟给张小明打的标签
('detail-uuid-010', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test4', (SELECT tag_uuid FROM tag WHERE tag_name = '温柔' LIMIT 1), '温柔', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-011', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test4', (SELECT tag_uuid FROM tag WHERE tag_name = '创意' LIMIT 1), '创意', 'invitation-uuid-002', NOW(), NOW()),
('detail-uuid-012', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test4', (SELECT tag_uuid FROM tag WHERE tag_name = '音乐' LIMIT 1), '音乐', 'invitation-uuid-002', NOW(), NOW()),

-- 张小明给李小红打的标签
('detail-uuid-013', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', (SELECT tag_uuid FROM tag WHERE tag_name = '漂亮' LIMIT 1), '漂亮', 'invitation-uuid-001', NOW(), NOW()),
('detail-uuid-014', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', (SELECT tag_uuid FROM tag WHERE tag_name = '温柔' LIMIT 1), '温柔', 'invitation-uuid-001', NOW(), NOW()),
('detail-uuid-015', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', (SELECT tag_uuid FROM tag WHERE tag_name = '聪明' LIMIT 1), '聪明', 'invitation-uuid-001', NOW(), NOW()),
('detail-uuid-016', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', (SELECT tag_uuid FROM tag WHERE tag_name = '有才华' LIMIT 1), '有才华', 'invitation-uuid-001', NOW(), NOW()),
('detail-uuid-017', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', (SELECT tag_uuid FROM tag WHERE tag_name = '读书' LIMIT 1), '读书', 'invitation-uuid-001', NOW(), NOW());

-- 插入用户标签汇总数据
INSERT INTO user_tag_summary (user_tag_summary_uuid, openid, nickname, avatar_url, tagger_openid, tagger_nickname, tagger_avatar_url, invitation_uuid, tag_summary, created_at, updated_at) VALUES
-- 张小明的标签汇总
('summary-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', '李小红', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx2/132', 'invitation-uuid-002', '开朗,内向,认真,温柔,多才多艺', NOW(), NOW()),
('summary-uuid-002', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'oj1uy7dY58Sgh3lxSQjSPVv-Test2', '王小刚', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx3/132', 'invitation-uuid-002', '沟通能力,开朗,内向,认真,多才多艺', NOW(), NOW()),
('summary-uuid-003', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'oj1uy7dY58Sgh3lxSQjSPVv-Test3', '赵小美', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx4/132', 'invitation-uuid-002', '多才多艺、沟通能力,喜欢运动,内向,认真', NOW(), NOW()),
('summary-uuid-004', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'oj1uy7dY58Sgh3lxSQjSPVv-Test4', '陈小伟', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx5/132', 'invitation-uuid-002', '温柔、富有创意、喜欢音乐,沟通能力,运动', NOW(), NOW()),

-- 李小红的标签汇总（张小明给她的评价）
('summary-uuid-005', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', '李小红', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx2/132', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', '张小明', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxxxxxxx1/132', 'invitation-uuid-001', '漂亮,温柔,聪明,有才华,爱读书', NOW(), NOW());

-- 插入用户AI分析数据
INSERT INTO user_analysis (analysis_uuid, open_id, invitation_uuid, analysis_content, created_at, updated_at) VALUES
('analysis-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'invitation-uuid-002', 
'根据朋友们的评价，张小明是一个非常受欢迎的人。他性格开朗幽默，待人热情温柔，这使他在人际交往中很有亲和力。在能力方面，他聪明有才华，富有创意，沟通能力强，是一个很有潜力的人。外表上，朋友们认为他很帅气有魅力。兴趣爱好方面，他喜欢运动和音乐，说明他是一个生活丰富多彩的人。总的来说，张小明是一个全面发展、魅力十足的优秀青年。', 
NOW(), NOW());

