# remand.md（前端需求与联调说明）

## 1. 项目定位

本项目是个人博客 RAG 系统的前端应用，基于 Vue 3 + Vite 构建，主要承载以下能力：

- 公开访问的登录、注册入口。
- 登录后的工作台首页。
- RAG 问答工作台。
- RAG 后台管理总览入口。
- 与认证后端、RAG 后端的本地联调能力。

当前前端以“可联调、可验收、可继续扩展”为优先目标。页面应保持简洁、理性、现代、专业，默认向 Ant Design 6 的中后台产品风格靠拢。

## 2. 技术栈与目录约定

- 前端框架：Vue 3。
- 构建工具：Vite。
- 路由：Vue Router。
- 状态管理：Pinia 已安装，可用于后续全局状态扩展。
- 认证工具：`src/utils/auth.js`。
- 登录注册页面：`src/views/LoginView.vue`。
- RAG 问答服务封装：`src/services/ragService.js`。
- RAG 管理端服务封装：`src/services/adminService.js`。
- 路由入口：`src/router/index.js`。
- 全局样式：`src/styles/base.css`。

## 3. 页面与路由范围

| 路由 | 页面说明 | 是否需要登录 |
| --- | --- | --- |
| `/` | 默认重定向到 `/workspace` | 是 |
| `/workspace` | 登录后的工作台首页 | 是 |
| `/rag` | RAG 问答页 | 是 |
| `/admin` | RAG 后台管理总览页 | 是 |
| `/login` | 登录页 | 否 |
| `/register` | 重定向到 `/login?mode=register` | 否 |
| `/articles` | 当前重定向到 `/workspace` | 是 |
| `/about` | 当前重定向到 `/workspace` | 是 |

鉴权规则：

- 需要登录的路由通过 `meta.requiresAuth` 标记。
- 未登录访问受保护路由时，跳转到 `/login?redirect=原目标路径`。
- 已登录访问 `/login` 时，优先回到 `redirect` 指定路径，否则回到 `/workspace`。
- `redirect` 只允许站内路径，且不能以 `/login` 开头，避免错误跳转或循环跳转。

## 4. UI 与交互要求

- 默认采用接近 Ant Design 6 的中后台设计语言：清晰的信息层级、规整留白、统一圆角、稳定反馈。
- 页面文案默认中文，错误提示需要直接描述用户下一步应该怎么做。
- 表单交互需要包含加载态、禁用态、错误态、成功态。
- 注册流程中的验证码发送按钮需要有 60 秒倒计时。
- 登录成功、注册成功、接口失败、验证码失败等状态都需要给出明确提示。
- 移动端需要保持基础可用，表单宽度、验证码区域、按钮区域不能溢出。
- 如果后续引入组件库，优先考虑 Ant Design Vue 或与 Ant Design 6 风格一致的组件实现。

## 5. 环境变量与代理

环境变量：

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_RAG_API_BASE_URL=/api/ragent
```

当前开发代理：

| 前缀 | 目标服务 | 用途 |
| --- | --- | --- |
| `/luoluo` | `http://localhost:8080` | 认证与会员相关接口 |
| `/api` | `http://localhost:9090` | RAG 问答与管理接口 |

说明：

- `VITE_API_BASE_URL` 控制认证接口基础地址。
- `VITE_RAG_API_BASE_URL` 控制 RAG 接口基础地址，默认值为 `/api/ragent`。
- 本地联调时，如果 `VITE_API_BASE_URL` 为空，认证请求会走 Vite 代理 `/luoluo`。
- 如果 `VITE_API_BASE_URL=http://localhost:8080`，请求会直接发往后端服务。

## 6. 登录注册需求

### 6.1 接口前缀

认证接口统一由以下两部分拼接：

```text
${VITE_API_BASE_URL}/luoluo
```

页面代码中只传业务路径，例如 `/system/public/member/auth/login`。

### 6.2 图形验证码

接口：

```http
GET /luoluo/system/public/captcha/image
```

用途：

- 进入注册模式时加载图形验证码。
- 点击验证码图片时刷新验证码。
- 返回 `captchaKey` 和 `imageBase64`。

前端渲染方式：

```text
data:image/svg+xml;base64,${imageBase64}
```

### 6.3 发送邮箱验证码

接口：

```http
POST /luoluo/system/public/member/auth/code/send
```

当前请求参数：

```json
{
  "grantType": "email",
  "bizType": "REGISTER",
  "email": "user@example.com",
  "captchaKey": "captcha-key",
  "captchaCode": "ABCD"
}
```

前端校验：

- 邮箱格式必须正确。
- 图形验证码必须已加载。
- 图形验证码输入不能为空。
- 发送中禁用按钮。
- 发送成功后进入 60 秒倒计时。

### 6.4 邮箱注册

接口：

```http
POST /luoluo/system/public/member/auth/register
```

当前请求参数：

```json
{
  "grantType": "email",
  "deviceType": "web",
  "displayName": "昵称",
  "email": "user@example.com",
  "emailCode": "123456",
  "password": "123456",
  "confirmPassword": "123456",
  "phone": "13800138000"
}
```

字段说明：

- `displayName` 必填，最长 20 个字符。
- `email` 必填，需要符合邮箱格式。
- `emailCode` 必填，当前为 6 位数字。
- `password` 必填，当前前端要求至少 6 位。
- `confirmPassword` 必填，必须与 `password` 一致。
- `phone` 选填，填写时必须为 11 位手机号。

注册成功后的处理：

- 如果后端返回 `token`，直接保存登录态并跳转到登录后目标页。
- 如果后端未返回 `token`，切换回登录模式并提示用户登录。

### 6.5 密码登录

接口：

```http
POST /luoluo/system/public/member/auth/login
```

当前请求参数：

```json
{
  "grantType": "password",
  "deviceType": "web",
  "email": "user@example.com",
  "password": "123456"
}
```

登录成功后的处理：

- 保存后端返回的 token。
- 保存后端返回的用户信息。
- 跳转到 `redirect` 指定页面，默认 `/workspace`。

## 7. 登录态存储约定

本地存储键名：

| Key | 内容 |
| --- | --- |
| `auth_token` | 标准化后的认证 token |
| `auth_user` | JSON 字符串形式的用户信息 |

Token 标准化规则：

- 如果后端返回的 token 已包含认证类型，例如 `Bearer xxx`，直接保存。
- 如果后端返回裸 token，则按 `tokenType` 拼接，默认使用 `Bearer`。

后续认证请求头：

```http
Authorization: Bearer xxxxxxxxxxxxxxxx
```

401 处理：

- RAG 请求收到 401 时清理本地登录态。
- 当前页面不是 `/login` 时，跳转到 `/login`。

## 8. RAG 问答需求

接口前缀：

```env
VITE_RAG_API_BASE_URL=/api/ragent
```

当前已接入接口：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/conversations` | 获取会话列表 |
| `GET` | `/conversations/{conversationId}/messages` | 获取会话消息 |
| `PUT` | `/conversations/{conversationId}` | 重命名会话 |
| `DELETE` | `/conversations/{conversationId}` | 删除会话 |
| `GET` | `/rag/sample-questions` | 获取推荐问题 |
| `GET` | `/rag/v3/chat` | 发起流式问答 |
| `POST` | `/rag/v3/stop` | 停止生成任务 |

流式问答约定：

- 请求方式为 `GET`。
- 请求头包含 `Accept: text/event-stream`。
- 如果存在登录态，需要携带 `Authorization`。
- 当前前端支持的 SSE 事件包括 `meta`、`message`、`title`、`finish`、`cancel`、`done`、`reject`、`error`。

## 9. RAG 后台管理需求

当前已接入接口：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/admin/dashboard/overview` | 管理端概览 |
| `GET` | `/knowledge-base` | 知识库列表 |
| `GET` | `/rag/settings` | RAG 系统设置 |
| `GET` | `/sample-questions` | 示例问题分页 |
| `GET` | `/users` | 用户分页 |
| `GET` | `/rag/traces/runs` | RAG 运行追踪列表 |

分页参数约定：

- `current`：当前页码。
- `size`：每页数量。
- `keyword`、`name`、`status` 等筛选项为空时不传。

## 10. 常用命令

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

默认开发地址：

```text
http://localhost:5173
```

## 11. 联调前置条件

- 前端开发服务已启动，默认端口为 `5173`。
- 认证后端已启动，默认端口为 `8080`。
- RAG 后端已启动，默认端口为 `9090`。
- 邮箱验证码能力可用，或后端在开发环境提供可查看的调试验证码。
- 图形验证码接口能返回 `captchaKey` 和 `imageBase64`。
- 浏览器未禁用 localStorage。

## 12. 联调验收清单

登录注册：

- 访问 `/login` 能展示登录模式。
- 访问 `/register` 能重定向到 `/login?mode=register` 并展示注册模式。
- 登录模式和注册模式切换正常，表单状态不会互相污染。
- 注册模式能加载图形验证码。
- 点击图形验证码能刷新验证码。
- 未输入合法邮箱时不能发送邮箱验证码。
- 未输入图形验证码时不能发送邮箱验证码。
- 邮箱验证码发送成功后进入 60 秒倒计时。
- 注册时能校验昵称、邮箱、邮箱验证码、密码、确认密码和手机号。
- 注册成功且返回 token 时，能保存登录态并跳转到 `/workspace` 或 `redirect`。
- 注册成功但未返回 token 时，能回到登录模式并提示用户登录。
- 登录成功后能保存 `auth_token` 和 `auth_user`。
- 登录成功后访问 `/workspace`、`/rag`、`/admin` 不再被拦截。

RAG 问答：

- 未登录访问 `/rag` 会跳转到 `/login?redirect=/rag`。
- 登录后访问 `/rag` 能加载会话列表和推荐问题。
- 发送问题后能接收流式响应。
- 流式响应结束、取消、异常时页面状态能恢复。
- 停止生成时能调用 `/rag/v3/stop`。
- 会话删除、重命名后列表状态能更新。

RAG 管理：

- 未登录访问 `/admin` 会跳转到登录页。
- 登录后访问 `/admin` 能请求管理概览数据。
- 知识库、示例问题、用户、运行追踪等列表能正常分页展示。
- 接口失败时页面能显示可理解的错误提示。

构建验收：

- `npm run build` 能成功完成。
- 构建后不出现明显的路由空白页。
- 控制台不出现阻断主流程的运行时错误。

## 13. 常见问题与排查

### 13.1 `grantType must not be blank`

原因：

- 登录或注册请求没有传 `grantType`。

处理：

- 密码登录传 `grantType: "password"`。
- 邮箱注册传 `grantType: "email"`。
- 发送邮箱验证码传 `grantType: "email"`。

### 13.2 `No static resource luoluo/api/auth/register`

原因：

- 调用了不存在的旧路径 `/luoluo/api/auth/register`。

处理：

- 改为 `/luoluo/system/public/member/auth/register`。

### 13.3 图形验证码接口返回 HTML

原因：

- 接口地址错误。
- Vite 代理未命中。
- 后端网关或静态资源兜底返回了 HTML。

处理：

- 检查请求地址是否为 `/luoluo/system/public/captcha/image`。
- 检查 `VITE_API_BASE_URL` 和 `vite.config.js` 代理配置。
- 检查后端服务是否启动在 `8080`。

### 13.4 登录成功但仍被拦截

原因：

- 后端未返回 `token`。
- token 字段不在 `data.token` 或根对象 `token` 中。
- localStorage 写入失败。

处理：

- 检查登录响应结构是否符合 `{ code, message, data: { token, tokenType, user } }`。
- 在浏览器 Application 面板检查 `auth_token` 是否存在。

### 13.5 RAG 接口 401

原因：

- token 缺失、过期或后端不认可。

处理：

- 重新登录。
- 检查请求头是否包含 `Authorization: Bearer xxx`。
- 检查 RAG 后端是否与认证后端使用同一套鉴权规则。

## 14. 后续可扩展事项

- 抽离认证请求到独立 `authService.js`，减少登录页组件体积。
- 修复路由 meta 中的中文乱码，保证浏览器标题和描述可读。
- 增加统一请求错误码映射，避免不同页面重复处理错误文案。
- 增加退出登录入口，并调用后端登出接口。
- 增加构建前检查或基础端到端联调脚本。
- 如需统一中后台 UI，可评估引入 Ant Design Vue，并逐步统一表单、表格、弹窗、反馈组件。
