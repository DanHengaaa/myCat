-- =============================================
-- 校园流浪猫管理系统 - 数据库建表脚本（最终版）
-- 适配 PostgreSQL
-- =============================================

-- 1. 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);

-- 2. 猫咪档案表
CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('公', '母', '未知')),
    color VARCHAR(30),
    personality_tags TEXT[],
    health_status TEXT,
    neutered BOOLEAN DEFAULT FALSE,
    description TEXT,
    main_photo_url TEXT,
    -- 审核与提交者
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    -- 待审核修改内容
    pending_changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cats_name ON cats(name);
CREATE INDEX idx_cats_status ON cats(status);

-- 3. 地图点位表
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    -- 审核与提交者
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    -- 删除请求标记
    delete_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_coord ON locations(latitude, longitude);
CREATE INDEX idx_locations_status ON locations(status);

-- 4. 猫咪-点位多对多关联
CREATE TABLE cat_locations (
    cat_id INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    PRIMARY KEY (cat_id, location_id)
);

CREATE INDEX idx_cat_loc_location ON cat_locations(location_id);

-- 5. 打卡记录表（偶遇/投喂）
CREATE TABLE checkins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cat_id INTEGER REFERENCES cats(id) ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sighting', 'feeding')),
    photo_url TEXT,
    note TEXT,
    -- 打卡坐标（用户手动标记或GPS获取）
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    -- 审核状态
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checkins_cat ON checkins(cat_id);
CREATE INDEX idx_checkins_user ON checkins(user_id);
CREATE INDEX idx_checkins_created ON checkins(created_at);
CREATE INDEX idx_checkins_status ON checkins(status);

-- 6. 评论/故事墙
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('cat', 'checkin')),
    target_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,   -- 评论附带图片
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id);

-- 7. 用户收藏表
CREATE TABLE user_favorites (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cat_id INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, cat_id)
);

CREATE INDEX idx_fav_user ON user_favorites(user_id);