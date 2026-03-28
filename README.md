# Personal-Blog-RAG-Front-End-Project

个人博客前端项目（Vue 3 + Vite）。

## 运行

```bash
npm install
npm run dev
```

默认地址：`http://localhost:5173`

## 页面路由

- `/`：首页
- `/articles`：文章页
- `/about`：关于页
- `/login`：登录页
- `/register`：注册页

## 登录注册联调说明

登录/注册页面目前会请求以下接口：

- `POST /api/auth/send-code`
- `POST /api/auth/register`
- `POST /api/auth/login`

可通过环境变量配置后端地址：

```env
VITE_API_BASE_URL=http://localhost:8080
```

开发环境如果后端在 `http://localhost:8080`，项目也内置了 Vite 代理：

- 前端请求 `/luoluo/*`
- Vite 自动转发到 `http://localhost:8080/luoluo/*`

这样本地联调时可以避免浏览器跨域拦截。

> 当后端实际路径是 `/api/v1/member/auth/*` 时，可通过网关转发或前端路径映射来对齐。
