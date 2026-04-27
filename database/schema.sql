-- =============================================
-- 校园流浪猫管理系统 - 数据库建表脚本
-- 适配 PostgreSQL
-- =============================================

-- 1. 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,          -- 登录用户名
    password_hash VARCHAR(255) NOT NULL,           -- 加密后的密码
    nickname VARCHAR(50),                          -- 显示昵称
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user'       -- 角色：'user' 或 'admin'
        CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引：用户名用于登录
CREATE INDEX idx_users_username ON users(username);

-- 2. 猫咪档案表
CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,                      -- 昵称
    gender VARCHAR(10) CHECK (gender IN ('公', '母', '未知')),
    color VARCHAR(30),                              -- 毛色（如“橘白”、“三花”）
    personality_tags TEXT[],                        -- 性格标签数组，如{'亲人','社恐'}
    health_status TEXT,                             -- 健康状态描述
    neutered BOOLEAN DEFAULT FALSE,                 -- 是否绝育
    description TEXT,                               -- 详细描述
    main_photo_url TEXT,                            -- 代表照片
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引：按名字搜索猫咪
CREATE INDEX idx_cats_name ON cats(name);

-- 3. 地图点位表
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                     -- 点位名称（如“图书馆东侧”）
    latitude DOUBLE PRECISION NOT NULL,             -- 纬度
    longitude DOUBLE PRECISION NOT NULL,            -- 经度
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引：加速按坐标范围查询（后续可能用于“附近点位”功能）
CREATE INDEX idx_locations_coord ON locations(latitude, longitude);

-- 4. 猫咪与点位多对多关联表
CREATE TABLE cat_locations (
    cat_id INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (cat_id, location_id)
);

-- 索引：快速查询某点位上有哪些猫，或某只猫的常驻点位
CREATE INDEX idx_cat_loc_location ON cat_locations(location_id);

-- 5. 打卡记录表（偶遇/投喂）
CREATE TABLE checkins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cat_id INTEGER REFERENCES cats(id) ON DELETE SET NULL,  -- 可能AI未识别出具体猫
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sighting', 'feeding')),  -- sighting=偶遇, feeding=投喂
    photo_url TEXT,                                 -- 用户上传的照片
    note TEXT,                                      -- 用户附言
    status VARCHAR(20) NOT NULL DEFAULT 'pending'   -- 审核状态：pending, approved, rejected
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- 审核管理员
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引：按猫咪、用户、时间查询打卡记录，用于轨迹生成
CREATE INDEX idx_checkins_cat ON checkins(cat_id);
CREATE INDEX idx_checkins_user ON checkins(user_id);
CREATE INDEX idx_checkins_created ON checkins(created_at);
-- 按经纬度查询（打卡记录可能直接有坐标，但这里点位关联了坐标，暂不冗余存储坐标）

-- 6. 评论 / 故事墙
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('cat', 'checkin')), -- 评论目标：猫咪或打卡记录
    target_id INTEGER NOT NULL,                                                -- 对应 cats.id 或 checkins.id
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引：按目标查询评论
CREATE INDEX idx_comments_target ON comments(target_type, target_id);

-- 7. 用户收藏表（用户与猫咪多对多）
CREATE TABLE user_favorites (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cat_id INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, cat_id)
);

-- 索引：查看某用户收藏列表
CREATE INDEX idx_fav_user ON user_favorites(user_id);