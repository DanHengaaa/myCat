```markdown
# 校园流浪猫管理系统 - API 接口文档

## 1. 概述
- 基础 URL：`http://localhost:5000/api`
- 认证方式：JWT Token（登录后返回 token，后续请求在 Header 中携带 `Authorization: Bearer <token>`）
- 通用返回格式：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": { ... }
  }
```
- 错误时返回示例：
  ```json
  {
    "code": 401,
    "message": "Unauthorized"
  }
  ```

## 2. 用户模块

### 2.1 注册
- **URL**：`/users/register`
- **方法**：`POST`
- **请求参数**（JSON Body）：
  ```json
  {
    "username": "cat_lover",
    "password": "123456",
    "nickname": "喵喵侠",
    "email": "lover@school.edu"
  }
  ```
- **返回**：
  ```json
  {
    "code": 201,
    "message": "注册成功",
    "data": { "id": 1, "username": "cat_lover", "nickname": "喵喵侠" }
  }
  ```

### 2.2 登录
- **URL**：`/users/login`
- **方法**：`POST`
- **请求参数**：
  ```json
  { "username": "cat_lover", "password": "123456" }
  ```
- **返回**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": { "token": "eyJhbG...", "user": { "id": 1, "username": "cat_lover", "role": "user" } }
  }
  ```

### 2.3 获取个人信息
- **URL**：`/users/me`
- **方法**：`GET`
- **认证**：需要 token
- **返回**：
  ```json
  {
    "code": 200,
    "data": { "id": 1, "username": "cat_lover", "nickname": "喵喵侠", "email": "lover@school.edu", "role": "user" }
  }
  ```

### 2.4 修改个人信息
- **URL**：`/users/me`
- **方法**：`PUT`
- **认证**：需要 token
- **请求参数**（可选）：
  ```json
  {
    "nickname": "新昵称",
    "email": "new@school.edu",
    "oldPassword": "旧密码",
    "newPassword": "新密码"
  }
  ```
- **说明**：若提供 `newPassword` 则必须提供 `oldPassword` 验证。
- **返回**：更新后的用户信息

---

## 3. 猫咪档案模块

### 3.1 获取猫咪列表（仅已审核通过）
- **URL**：`/cats`
- **方法**：`GET`
- **查询参数**：`page`, `limit`, `gender`, `neutered`
- **返回**：
  ```json
  {
    "code": 200,
    "data": { "total": 25, "page": 1, "cats": [...] }
  }
  ```

### 3.2 获取猫咪详情
- **URL**：`/cats/:id`
- **方法**：`GET`
- **返回**：猫咪完整信息（含常驻点位）

### 3.3 创建猫咪档案（需登录，状态为待审核）
- **URL**：`/cats`
- **方法**：`POST`
- **认证**：需要 token（任意用户）
- **请求体**：
  ```json
  {
    "name": "小橘",
    "gender": "公",
    "color": "橘白",
    "personality_tags": ["亲人", "贪吃"],
    "health_status": "健康",
    "neutered": true,
    "description": "常驻图书馆东侧",
    "main_photo_url": "/uploads/xxx.jpg"
  }
  ```
- **返回**：`201 Created`

### 3.4 提交猫咪编辑请求（需登录）
- **URL**：`/cats/:id/edit-request`
- **方法**：`PUT`
- **认证**：需要 token（任意用户）
- **请求体**：与创建类似，只提交要修改的字段
- **说明**：修改不会立即生效，提交后进入 `pending_changes`，等待管理员审核。

### 3.5 管理员审核猫咪创建
- **URL**：`/cats/:id/review`
- **方法**：`PUT`
- **认证**：管理员
- **请求体**：`{ "status": "approved" 或 "rejected" }`

### 3.6 管理员获取待审核创建列表
- **URL**：`/cats/admin/pending`
- **方法**：`GET`
- **认证**：管理员

### 3.7 管理员获取待审核编辑列表
- **URL**：`/cats/admin/pending-edits`
- **方法**：`GET`
- **认证**：管理员

### 3.8 管理员审核编辑请求
- **URL**：`/cats/:id/review-edit`
- **方法**：`PUT`
- **认证**：管理员
- **请求体**：`{ "action": "approve" 或 "reject" }`

### 3.9 管理员直接更新猫咪
- **URL**：`/cats/:id`
- **方法**：`PUT`
- **认证**：管理员

### 3.10 管理员删除猫咪
- **URL**：`/cats/:id`
- **方法**：`DELETE`
- **认证**：管理员

---

## 4. 地图点位模块

### 4.1 获取点位列表（仅已审核通过）
- **URL**：`/locations`
- **方法**：`GET`
- **返回**：点位列表（含猫咪数量、投喂次数）

### 4.2 获取点位详情
- **URL**：`/locations/:id`
- **方法**：`GET`

### 4.3 创建点位（需登录，状态为待审核）
- **URL**：`/locations`
- **方法**：`POST`
- **认证**：需要 token（任意用户）
- **请求体**：
  ```json
  { "name": "图书馆东侧", "latitude": 39.9042, "longitude": 116.4074, "description": "有固定投喂点" }
  ```

### 4.4 请求删除点位（需登录）
- **URL**：`/locations/:id/request-delete`
- **方法**：`PUT`
- **认证**：需要 token（任意用户）
- **说明**：提交删除请求，管理员审核后才真正删除。

### 4.5 管理员审核点位创建
- **URL**：`/locations/:id/review`
- **方法**：`PUT`
- **认证**：管理员
- **请求体**：`{ "status": "approved" 或 "rejected" }`

### 4.6 管理员获取待审核创建列表
- **URL**：`/locations/admin/pending`
- **方法**：`GET`
- **认证**：管理员

### 4.7 管理员获取待审核删除列表
- **URL**：`/locations/admin/pending-deletes`
- **方法**：`GET`
- **认证**：管理员

### 4.8 管理员审核删除请求
- **URL**：`/locations/:id/review-delete`
- **方法**：`PUT`
- **认证**：管理员
- **请求体**：`{ "action": "approve" 或 "reject" }`

### 4.9 管理员更新点位
- **URL**：`/locations/:id`
- **方法**：`PUT`
- **认证**：管理员

### 4.10 管理员删除点位
- **URL**：`/locations/:id`
- **方法**：`DELETE`
- **认证**：管理员

---

## 5. 打卡模块

### 5.1 发布打卡
- **URL**：`/checkins`
- **方法**：`POST`
- **认证**：需要 token
- **请求体**：
  ```json
  {
    "type": "sighting",
    "cat_id": 1,
    "location_id": 2,
    "latitude": 31.92,
    "longitude": 118.79,
    "note": "看到小橘",
    "photo_url": "/uploads/..." 
  }
  ```
- **说明**：坐标优先使用关联点位的坐标，否则使用 `latitude`/`longitude`。

### 5.2 获取打卡记录（支持筛选）
- **URL**：`/checkins`
- **方法**：`GET`
- **查询参数**：`cat_id`, `user_id`, `type`, `status`, `page`, `limit`, `date`（日期格式 YYYY-MM-DD）

### 5.3 审核打卡（管理员）
- **URL**：`/checkins/:id/review`
- **方法**：`PUT`
- **认证**：管理员
- **请求体**：`{ "status": "approved" 或 "rejected" }`

### 5.4 用户删除自己的打卡记录
- **URL**：`/checkins/:id`
- **方法**：`DELETE`
- **认证**：需要 token（作者本人）

### 5.5 获取今日打卡点（含坐标、猫咪头像）
- **URL**：`/checkins/today`
- **方法**：`GET`
- **认证**：需要 token

### 5.6 获取热力图数据
- **URL**：`/checkins/heatmap`
- **方法**：`GET`
- **查询参数**：`days`（默认30）
- **返回**：`[[lat, lng, intensity], ...]`

## 6. 评论模块

### 6.1 发表评论
- **URL**：`/comments`
- **方法**：`POST`
- **认证**：需要 token
- **请求体**：
  ```json
  { "target_type": "cat", "target_id": 1, "content": "好可爱", "photo_url": "/uploads/..." }
  ```

### 6.2 获取评论列表
- **URL**：`/comments`
- **方法**：`GET`
- **查询参数**：`target_type`, `target_id`, `page`, `limit`

### 6.3 删除评论
- **URL**：`/comments/:id`
- **方法**：`DELETE`
- **认证**：需要 token（作者本人或管理员）

---

## 7. 排行榜与成就

### 7.1 猫咪排行
- **URL**：`/leaderboard/cats`
- **方法**：`GET`
- **查询参数**：`limit`（默认10）

### 7.2 用户排行
- **URL**：`/leaderboard/users`
- **方法**：`GET`
- **查询参数**：`type`（`all`/`sighting`/`feeding`），`limit`

### 7.3 个人图鉴成就
- **URL**：`/achievements/me`
- **方法**：`GET`
- **认证**：需要 token
- **返回**：已收集猫咪数、总猫咪数，以及每只猫的打卡状态

---

## 8. 数据看板（管理员）

- **URL**：`/dashboard`
- **方法**：`GET`
- **认证**：管理员
- **返回**：猫咪总数、点位总数、打卡总数、本周投喂次数、热门猫咪/点位、活跃用户数

---

## 9. 文件上传

- **URL**：`/upload`
- **方法**：`POST`
- **认证**：需要 token
- **Body**：`multipart/form-data`，字段名 `photo`
- **返回**：`{ "code": 200, "data": { "url": "/uploads/photo-xxx.jpg" } }`

---

## 10. 通用状态码说明

| 状态码 | 含义                |
| ------ | ------------------- |
| 200    | 请求成功            |
| 201    | 创建成功            |
| 400    | 请求参数有误        |
| 401    | 未登录 / token 无效 |
| 403    | 无权限              |
| 404    | 资源不存在          |
| 500    | 服务器内部错误      |

---

> 所有接口以 JSON 交互，需要认证的在 Header 中携带 `Authorization: Bearer <token>`。