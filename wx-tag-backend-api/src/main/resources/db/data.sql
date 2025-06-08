USE wx_tag;

-- 插入基础标签数据
INSERT INTO wx_tag.tag (tag_uuid, tag_name, description, category, sort_order, created_at, updated_at) VALUES
(UUID(), '开朗', '性格开朗活泼', '性格特质', 1, NOW(), NOW()),
(UUID(), '幽默', '很有幽默感', '性格特质', 2, NOW(), NOW()),
(UUID(), '认真', '做事认真负责', '性格特质', 3, NOW(), NOW()),
(UUID(), '温柔', '性格温柔体贴', '性格特质', 4, NOW(), NOW()),
(UUID(), '热情', '待人热情', '性格特质', 5, NOW(), NOW()),
(UUID(), '善良', '心地善良', '性格特质', 6, NOW(), NOW()),
(UUID(), '真诚', '为人真诚', '性格特质', 7, NOW(), NOW()),
(UUID(), '独立', '独立自主', '性格特质', 8, NOW(), NOW()),
(UUID(), '乐观', '积极乐观', '性格特质', 9, NOW(), NOW()),
(UUID(), '勇敢', '勇敢有担当', '性格特质', 10, NOW(), NOW()),
(UUID(), '细心', '做事细致入微', '性格特质', 11, NOW(), NOW()),
(UUID(), '坚韧', '意志坚韧不拔', '性格特质', 12, NOW(), NOW()),
(UUID(), '随和', '性格随和', '性格特质', 13, NOW(), NOW()),
(UUID(), '谦逊', '待人谦逊有礼', '性格特质', 14, NOW(), NOW()),
(UUID(), '友善', '待人友善', '性格特质', 15, NOW(), NOW()),
(UUID(), '活泼', '性格活泼开朗', '性格特质', 16, NOW(), NOW()),
(UUID(), '淡定', '遇事淡定从容', '性格特质', 17, NOW(), NOW()),
(UUID(), '豁达', '心胸开阔豁达', '性格特质', 18, NOW(), NOW()),
(UUID(), '包容', '善于包容他人', '性格特质', 19, NOW(), NOW()),
(UUID(), '稳重', '处事稳重', '性格特质', 20, NOW(), NOW()),

(UUID(), '聪明', '很聪明', '能力特长', 1, NOW(), NOW()),
(UUID(), '有才华', '多才多艺', '能力特长', 2, NOW(), NOW()),
(UUID(), '领导力', '有领导能力', '能力特长', 3, NOW(), NOW()),
(UUID(), '创意', '很有创意', '能力特长', 4, NOW(), NOW()),
(UUID(), '执行力', '执行力强', '能力特长', 5, NOW(), NOW()),
(UUID(), '沟通能力', '沟通能力强', '能力特长', 6, NOW(), NOW()),
(UUID(), '学习能力', '学习能力强', '能力特长', 7, NOW(), NOW()),
(UUID(), '解决问题', '善于解决问题', '能力特长', 8, NOW(), NOW()),
(UUID(), '协作', '善于团队协作', '能力特长', 9, NOW(), NOW()),
(UUID(), '抗压', '抗压能力强', '能力特长', 10, NOW(), NOW()),
(UUID(), '创新', '勇于创新', '能力特长', 11, NOW(), NOW()),
(UUID(), '分析', '擅长分析', '能力特长', 12, NOW(), NOW()),
(UUID(), '组织', '组织能力强', '能力特长', 13, NOW(), NOW()),
(UUID(), '表达', '表达能力强', '能力特长', 14, NOW(), NOW()),
(UUID(), '规划', '善于规划', '能力特长', 15, NOW(), NOW()),
(UUID(), '专注', '做事专注', '能力特长', 16, NOW(), NOW()),
(UUID(), '记忆力好', '记忆力很棒', '能力特长', 17, NOW(), NOW()),
(UUID(), '反应快', '反应敏捷', '能力特长', 18, NOW(), NOW()),
(UUID(), '动手能力', '动手能力强', '能力特长', 19, NOW(), NOW()),
(UUID(), '适应力', '适应能力强', '能力特长', 20, NOW(), NOW()),

(UUID(), '帅气', '长得很帅', '外貌特征', 1, NOW(), NOW()),
(UUID(), '漂亮', '长得很漂亮', '外貌特征', 2, NOW(), NOW()),
(UUID(), '可爱', '很可爱', '外貌特征', 3, NOW(), NOW()),
(UUID(), '气质', '很有气质', '外貌特征', 4, NOW(), NOW()),
(UUID(), '时尚', '很时尚', '外貌特征', 5, NOW(), NOW()),
(UUID(), '阳光外形', '外形阳光，积极向上', '外貌特征', 6, NOW(), NOW()),
(UUID(), '清新', '气质清新脱俗', '外貌特征', 7, NOW(), NOW()),
(UUID(), '魅力', '很有个人魅力', '外貌特征', 8, NOW(), NOW()),
(UUID(), '活力', '充满青春活力', '外貌特征', 9, NOW(), NOW()),
(UUID(), '甜美', '笑容甜美可人', '外貌特征', 10, NOW(), NOW()),
(UUID(), '英俊', '相貌英俊不凡', '外貌特征', 11, NOW(), NOW()),
(UUID(), '高挑', '身材高挑有型', '外貌特征', 12, NOW(), NOW()),
(UUID(), '匀称', '身材匀称健康', '外貌特征', 13, NOW(), NOW()),
(UUID(), '精神', '看上去精神饱满', '外貌特征', 14, NOW(), NOW()),
(UUID(), '整洁', '穿着打扮干净整洁', '外貌特征', 15, NOW(), NOW()),
(UUID(), '大气', '气场大气，风度翩翩', '外貌特征', 16, NOW(), NOW()),
(UUID(), '眼神温柔', '眼神温柔有神', '外貌特征', 17, NOW(), NOW()),
(UUID(), '文艺', '气质文艺范儿十足', '外貌特征', 18, NOW(), NOW()),
(UUID(), '精致', '五官精致立体', '外貌特征', 19, NOW(), NOW()),
(UUID(), '优雅', '举止优雅大方', '外貌特征', 20, NOW(), NOW()),

(UUID(), '运动', '喜欢运动健身', '兴趣爱好', 1, NOW(), NOW()),
(UUID(), '音乐', '热爱音乐艺术', '兴趣爱好', 2, NOW(), NOW()),
(UUID(), '读书', '喜欢阅读学习', '兴趣爱好', 3, NOW(), NOW()),
(UUID(), '旅行', '热爱旅行探索', '兴趣爱好', 4, NOW(), NOW()),
(UUID(), '美食', '喜欢品尝美食', '兴趣爱好', 5, NOW(), NOW()),
(UUID(), '游戏', '喜欢玩电子游戏', '兴趣爱好', 6, NOW(), NOW()),
(UUID(), '电影', '喜欢观看电影', '兴趣爱好', 7, NOW(), NOW()),
(UUID(), '摄影', '爱好摄影艺术', '兴趣爱好', 8, NOW(), NOW()),
(UUID(), '绘画', '喜欢绘画创作', '兴趣爱好', 9, NOW(), NOW()),
(UUID(), '编程', '对编程有兴趣', '兴趣爱好', 10, NOW(), NOW()),
(UUID(), '写作', '喜欢写作表达', '兴趣爱好', 11, NOW(), NOW()),
(UUID(), '健身', '定期进行健身锻炼', '兴趣爱好', 12, NOW(), NOW()),
(UUID(), '户外', '喜欢户外活动', '兴趣爱好', 13, NOW(), NOW()),
(UUID(), '园艺', '对园艺有热情', '兴趣爱好', 14, NOW(), NOW()),
(UUID(), '宠物', '喜欢饲养宠物', '兴趣爱好', 15, NOW(), NOW()),
(UUID(), '烹饪', '擅长烹饪美食', '兴趣爱好', 16, NOW(), NOW()),
(UUID(), '科技', '对科技前沿感兴趣', '兴趣爱好', 17, NOW(), NOW()),
(UUID(), '历史', '对历史文化感兴趣', '兴趣爱好', 18, NOW(), NOW()),
(UUID(), '艺术', '对各类艺术形式感兴趣', '兴趣爱好', 19, NOW(), NOW()),
(UUID(), '志愿者', '积极参与志愿者活动', '兴趣爱好', 20, NOW(), NOW());

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
INSERT INTO invitation (invitation_uuid, openid, invitation_code, status, start_time, end_time, created_at, updated_at) VALUES
-- 张小明发起的邀请任务
('invitation-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'INV001', 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
-- 其他用户发起的邀请任务
('invitation-uuid-002', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'INV002', 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW());

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
INSERT INTO user_tag_summary (user_tag_summary_uuid, openid, tagger_openid, invitation_uuid, tag_summary, created_at, updated_at) VALUES
-- 张小明的标签汇总
('summary-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'invitation-uuid-002', '开朗,内向,认真,温柔,多才多艺', NOW(), NOW()),
('summary-uuid-002', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test2', 'invitation-uuid-002', '沟通能力,开朗,内向,认真,多才多艺', NOW(), NOW()),
('summary-uuid-003', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test3', 'invitation-uuid-002', '多才多艺、沟通能力,喜欢运动,内向,认真', NOW(), NOW()),
('summary-uuid-004', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'oj1uy7dY58Sgh3lxSQjSPVv-Test4', 'invitation-uuid-002', '温柔、富有创意、喜欢音乐,沟通能力,运动', NOW(), NOW()),

-- 李小红的标签汇总（张小明给她的评价）
('summary-uuid-005', 'oj1uy7dY58Sgh3lxSQjSPVv-Test1', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'invitation-uuid-001', '漂亮,温柔,聪明,有才华,爱读书', NOW(), NOW());

-- 插入用户AI分析数据
INSERT INTO user_analysis (analysis_uuid, open_id, invitation_uuid, analysis_content, created_at, updated_at) VALUES
('analysis-uuid-001', 'oj1uy7dY58Sgh3lxSQjSPVv-Coe4', 'invitation-uuid-002', 
'根据朋友们的评价，张小明是一个非常受欢迎的人。他性格开朗幽默，待人热情温柔，这使他在人际交往中很有亲和力。在能力方面，他聪明有才华，富有创意，沟通能力强，是一个很有潜力的人。外表上，朋友们认为他很帅气有魅力。兴趣爱好方面，他喜欢运动和音乐，说明他是一个生活丰富多彩的人。总的来说，张小明是一个全面发展、魅力十足的优秀青年。', 
NOW(), NOW());

