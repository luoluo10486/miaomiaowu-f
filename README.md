# Personal-Blog-RAG-Front-End-Project

个人博客前端项目（Vue 3 + Vite）。

## 运行

```bash
npm install
npm run dev
```

默认地址：`http://localhost:5173`

## 页面路由

- `/`：默认重定向到工作台首页
- `/workspace`：登录后的工作台首页
- `/rag`：RAG 问答页
- `/admin`：RAG 后台管理总览页
- `/login`：登录页
- `/register`：注册页

## 登录注册联调说明

登录/注册页面目前会请求以下接口：

- `POST /api/ragent/luoluo/system/public/member/auth/code/send`
- `POST /api/ragent/luoluo/system/public/member/auth/register`
- `POST /api/ragent/luoluo/system/public/member/auth/login`

当前前端登录/注册参数约定：

- 发送邮箱验证码：`POST /api/ragent/luoluo/system/public/member/auth/code/send`
- 登录：`POST /api/ragent/luoluo/system/public/member/auth/login`
- 邮箱注册：`POST /api/ragent/luoluo/system/public/member/auth/register`

当前前端登录/注册请求体约定：

- 发送邮箱验证码：`grantType=email`、`bizType=REGISTER`、`captchaKey`、`captchaCode`、`email`
- 登录：`grantType=password`、`deviceType=web`、`email`、`password`
- 邮箱注册：`grantType=email`、`deviceType=web`、`displayName`、`email`、`emailCode`、`password`、`confirmPassword`，`phone` 为选填

## RAG 问答联调说明

登录成功后默认进入 `/workspace`，再通过左侧菜单分别进入：

- `工作台首页`
- `RAG问答`
- `RAG后台管理`

其中 `RAG问答` 和 `RAG后台管理` 都基于 `frontend` 目录中的 `ragent` 接口能力做了 Vue 版重构。

当前接入的 RAG 接口包括：

- `GET /api/ragent/conversations`
- `GET /api/ragent/conversations/{conversationId}/messages`
- `DELETE /api/ragent/conversations/{conversationId}`
- `GET /api/ragent/luoluo/system/public/captcha/image`
- `POST /api/ragent/luoluo/system/public/member/auth/login`
- `POST /api/ragent/luoluo/system/public/member/auth/register`
- `POST /api/ragent/luoluo/system/public/member/auth/code/send`
- `GET /api/ragent/rag/sample-questions`
- `GET /api/ragent/rag/v3/chat`
- `POST /api/ragent/rag/v3/stop`
- `GET /api/ragent/admin/dashboard/overview`
- `GET /api/ragent/knowledge-base`
- `GET /api/ragent/rag/traces/runs`
- `GET /api/ragent/sample-questions`
- `GET /api/ragent/users`
- `GET /api/ragent/rag/settings`

前端默认通过 `VITE_RAG_API_BASE_URL` 指向后端统一前缀：

```env
VITE_RAG_API_BASE_URL=/api/ragent
```

开发环境内置了两组代理：

- `/api/*` 转发到 `http://localhost:9090`
- `/luoluo/*` 保留为旧后端直连代理，当前前端主流程已不再依赖它

这样本地联调时可以避免浏览器跨域拦截。
