你现在的任务是 **“API 定义”**，要求提交一份接口文档，包含 **URL、方法、请求/返回参数及状态码**。  
这份文档可以直接放在你仓库的 `docs/api.md` 里，用 Markdown 书写；如果需要更正式的展示，也可以用 Swagger 等工具自动生成，但课程作业手写 Markdown 完全足够。

下面我帮你 **梳理这份文档怎么写，并给出完整草稿**，你只要根据实际微调后提交即可。

---

## 一、整体思路

1. **根据需求分析提取出核心资源**：
   - 用户（注册/登录/个人信息）
   - 猫咪档案
   - 地图点位
   - 打卡记录（偶遇 & 投喂）
   - 评论 / 故事墙
   - 收藏
   - 审核（管理员）
   - 数据看板（统计接口）

2. **设计 URL 规则**：全部以 `/api` 为前缀，资源名用复数，如 `/api/users`、`/api/cats`。

3. **统一返回格式**：
   ```json
   {
     "code": 200,
     "message": "success",
     "data": { ... }
   }
   ```
4. **认证方式**：使用 JWT Token，在请求头里带 `Authorization: Bearer <token>`。

5. **状态码**：遵循标准 HTTP 状态码（200/201/400/401/403/404/500 等）。

---

## 二、你需要交付的文档 `docs/api.md`

在项目根目录下新建 `docs/api.md`，内容参考下面草稿。

### 📄 完整接口文档草稿（可复制使用）

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
- **描述**：创建普通用户账号
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
    "data": {
      "user_id": 1,
      "username": "cat_lover",
      "nickname": "喵喵侠"
    }
  }
  ```
- **状态码**：`201 Created`、`400 Validation Error`

### 2.2 登录
- **URL**：`/users/login`
- **方法**：`POST`
- **描述**：用户登录，返回 JWT token
- **请求参数**：
  ```json
  {
    "username": "cat_lover",
    "password": "123456"
  }
  ```
- **返回**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 1,
        "username": "cat_lover",
        "role": "user"
      }
    }
  }
  ```
- **状态码**：`200 OK`、`401 Unauthorized`

### 2.3 获取个人信息
- **URL**：`/users/me`
- **方法**：`GET`
- **描述**：获取当前登录用户的个人信息
- **请求头**：`Authorization: Bearer <token>`
- **返回**：
  ```json
  {
    "code": 200,
    "data": {
      "id": 1,
      "username": "cat_lover",
      "nickname": "喵喵侠",
      "email": "lover@school.edu",
      "role": "user",
      "avatar_url": null,
      "created_at": "2026-04-27T10:00:00Z"
    }
  }
  ```

## 3. 猫咪档案模块

### 3.1 获取所有猫咪
- **URL**：`/cats`
- **方法**：`GET`
- **描述**：分页获取猫咪列表，支持筛选
- **查询参数**：
  - `page` ：页码（默认 1）
  - `limit`：每页条数（默认 10）
  - `gender`：性别筛选（可选）
  - `neutered`：是否绝育（`true`/`false`）
- **返回**：
  ```json
  {
    "code": 200,
    "data": {
      "total": 25,
      "page": 1,
      "cats": [
        {
          "id": 1,
          "name": "小橘",
          "gender": "公",
          "color": "橘白",
          "personality_tags": ["亲人", "贪吃"],
          "health_status": "健康",
          "neutered": true,
          "main_photo_url": "https://...",
          "description": "常驻图书馆东侧"
        }
      ]
    }
  }
  ```

### 3.2 获取猫咪详情
- **URL**：`/cats/{id}`
- **方法**：`GET`
- **返回**：单只猫咪完整信息（含常驻点位、最近打卡记录）

### 3.3 创建猫咪档案（需管理员）
- **URL**：`/cats`
- **方法**：`POST`
- **请求头**：`Authorization: Bearer <admin_token>`
- **请求体**：
  ```json
  {
    "name": "小橘",
    "gender": "公",
    "color": "橘白",
    "personality_tags": ["亲人", "贪吃"],
    "health_status": "健康",
    "neutered": true,
    "description": "常驻图书馆东侧"
  }
  ```
- **状态码**：`201 Created`、`403 Forbidden`

### 3.4 更新猫咪信息（管理员）
- **URL**：`/cats/{id}`
- **方法**：`PUT`
- **权限**：管理员
- **请求体**：同创建，可部分字段

### 3.5 删除猫咪（管理员）
- **URL**：`/cats/{id}`
- **方法**：`DELETE`

---

## 4. 地图点位模块

### 4.1 获取所有点位
- **URL**：`/locations`
- **方法**：`GET`
- **返回**：点位列表，含经纬度、名称、关联的猫咪数量

### 4.2 获取点位详情
- **URL**：`/locations/{id}`
- **方法**：`GET`
- **返回**：点位详细信息，包括常驻猫咪列表

### 4.3 创建点位（管理员）
- **URL**：`/locations`
- **方法**：`POST`
- **请求体**：
  ```json
  {
    "name": "图书馆东侧",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "description": "有固定投喂点"
  }
  ```

### 4.4 关联猫咪与点位
- **URL**：`/locations/{location_id}/cats`
- **方法**：`POST`
- **请求体**：`{ "cat_id": 1 }`
- **描述**：为点位添加常驻猫咪（管理员）

---

## 5. 打卡模块

### 5.1 发布打卡
- **URL**：`/checkins`
- **方法**：`POST`
- **认证**：需要 token
- **请求体**：
  ```json
  {
    "type": "sighting",          // "sighting" 或 "feeding"
    "cat_id": 1,
    "location_id": 2,
    "photo_url": "https://...",
    "note": "又看到小橘在晒太阳"
  }
  ```
- **说明**：`cat_id` 和 `location_id` 为可选项（未识别时可省略），照片必须上传
- **返回**：打卡记录对象，状态为 `pending`
- **状态码**：`201 Created`

### 5.2 审核打卡（管理员）
- **URL**：`/checkins/{id}/review`
- **方法**：`PUT`
- **请求体**：
  ```json
  {
    "status": "approved",        // "approved" 或 "rejected"
    "reviewer_id": 5
  }
  ```

### 5.3 获取打卡记录
- **URL**：`/checkins`
- **方法**：`GET`
- **查询参数**：`cat_id`、`user_id`、`type`、`status`（仅管理员可查 `pending`）
- **返回**：打卡列表（含用户昵称、猫咪姓名、时间等）

### 5.4 获取热门投喂点 / 轨迹数据
- **URL**：`/checkins/heatmap`
- **方法**：`GET`
- **描述**：返回指定猫咪的坐标轨迹点数组或全局热力图数据
- **返回示例**：
  ```json
  {
    "cat_id": 1,
    "trajectory": [
      { "lat": 39.9042, "lng": 116.4074, "time": "2026-04-25T08:00" },
      { "lat": 39.9045, "lng": 116.4080, "time": "2026-04-25T12:00" }
    ]
  }
  ```

---

## 6. 评论模块

### 6.1 发表评论
- **URL**：`/comments`
- **方法**：`POST`
- **认证**：需要 token
- **请求体**：
  ```json
  {
    "target_type": "cat",     // "cat" 或 "checkin"
    "target_id": 1,
    "content": "小橘今天居然让我摸肚子了！"
  }
  ```
- **返回**：`201 Created`

### 6.2 获取评论列表
- **URL**：`/comments?target_type=cat&target_id=1`
- **方法**：`GET`
- **返回**：分页评论列表（含用户昵称、时间）

---

## 7. 收藏模块

### 7.1 收藏 / 取消收藏猫咪
- **URL**：`/favorites`
- **方法**：`POST`
- **请求体**：`{ "cat_id": 1 }`
- **说明**：如果已收藏则取消收藏（toggle）
- **返回**：当前收藏状态 `{ "favorited": true/false }`

### 7.2 获取我的收藏列表
- **URL**：`/favorites`
- **方法**：`GET`
- **返回**：猫咪简略信息数组

---

## 8. 数据看板（管理员）

### 8.1 获取核心统计数据
- **URL**：`/dashboard`
- **方法**：`GET`
- **权限**：管理员
- **返回示例**：
  ```json
  {
    "total_cats": 25,
    "total_locations": 8,
    "total_checkins": 340,
    "feeding_count_last_week": 45,
    "top_cats": [
      { "cat_id": 1, "name": "小橘", "checkin_count": 58 }
    ],
    "active_users": 12
  }
  ```

---

## 9. 通用状态码说明

| 状态码 | 含义                     |
| ------ | ------------------------ |
| 200    | 请求成功                 |
| 201    | 创建成功                 |
| 400    | 请求参数有误             |
| 401    | 未登录 / token 无效      |
| 403    | 无权限（如非管理员操作） |
| 404    | 资源不存在               |
| 500    | 服务器内部错误           |

---

> 以上接口均以 JSON 格式交互，所有需要认证的接口在 Header 中携带 `Authorization: Bearer <token>`。
```

---

## 三、你现在要做的具体操作

1. 在项目根目录的 `docs/` 文件夹里新建 `api.md`（如果没有这个文件夹就创建一个）
2. 把上面的草稿复制进去，检查一下有没有需要调整的功能（目前已经覆盖了需求分析里所有核心点）
3. 保存文件
4. 把文件加入 Git 并提交：
   ```bash
   git add docs/api.md
   git commit -m "docs: 添加 RESTful API 接口文档"
   git push
```

---

## 四、如何让这份文档“看起来更专业”（可选）

- 在 README.md 的“接口入口”一行里，写上 `http://localhost:5000/api`，并说明 **详细文档见 `docs/api.md`**。
- 如果后续你用 Swagger 或 Postman 生成了更动态的文档，可以把链接放进去。

---

这份 `docs/api.md` 完全满足作业里“**提交接口文档（包含 URL、方法、请求/返回参数及状态码）**”的要求，而且和你的数据库设计、需求分析完美对应。接下来只管提交就行了。