# 当前 Vue 版与 frontend 源码级一致性差距与完善流程

> 对比范围：根目录当前实现（主要是 `src/`、`package.json`、`vite.config.js`、`public/`）与参考实现 `frontend/`。  
> 排除范围：登录页和登录注册交互本身不纳入本次差距判断，但登录态、权限守卫、退出登录、用户信息读取这些跨模块能力会纳入。

## 结论概览

当前版本已经把 `frontend` 的核心业务模块大多迁移到了 Vue：RAG 聊天、后台布局、Dashboard、知识库、文档、切片、意图树、意图列表、意图编辑、数据通道、链路追踪、系统设置、示例问题、关键词映射、用户管理等页面都存在，接口路径也基本覆盖。

但它还没有达到“源码级一样”。主要原因不是单个按钮缺失，而是整体实现方式不同：

1. `frontend` 是 React + TypeScript + Zustand + Tailwind/shadcn/Radix 组件体系；当前版本是 Vue 3 + 原生 CSS + 少量工具函数。
2. `frontend` 按领域拆分了 stores、hooks、services、components、types；当前版本大量逻辑集中在少数 Vue SFC 和 `adminService.js` 里。
3. 当前版本更接近“功能级移植”，还缺少参考源码里的类型约束、表单校验、复杂表单配置、统一 toast、错误边界、组件复用边界、管理员权限守卫和一部分细节交互。

因此后续完善应分两条路线选择其一：

- 路线 A：保持 Vue 技术栈，做到“功能与交互源码级对齐”。也就是不改成 React，但补齐 `frontend` 的模块边界、状态模型、接口模型、交互细节和验收行为。
- 路线 B：完全源码级一致。将当前根目录恢复/迁移为 React + TypeScript 项目，直接以 `frontend` 为基线，再把当前新增的个人博客、工作台、画廊、Live2D 等能力接回去。

如果目标是继续保留当前 Vue 项目，推荐路线 A。

## 已基本对齐的部分

这些模块已经存在，并且接口路径与 `frontend` 大体一致，后续主要是补细节和组织结构。

| 模块 | 当前实现 | frontend 参考 | 当前状态 |
| --- | --- | --- | --- |
| RAG 聊天接口 | `src/services/ragService.js` | `frontend/src/services/chatService.ts`、`sessionService.ts`、`hooks/useStreamResponse.ts` | 接口基本覆盖，状态组织未对齐 |
| 后台总布局 | `src/views/admin/AdminLayoutView.vue` | `frontend/src/pages/admin/AdminLayout.tsx` | 页面存在，权限、toast、组件化不足 |
| Dashboard | `src/views/admin/DashboardPage.vue` | `frontend/src/pages/admin/dashboard/DashboardPage.tsx` | 数据接口覆盖，图表/组件边界需核对 |
| 知识库列表 | `src/views/admin/KnowledgeListPage.vue` | `frontend/src/pages/admin/knowledge/KnowledgeListPage.tsx` | 基础 CRUD 覆盖，弹窗/校验需增强 |
| 文档管理 | `src/views/admin/KnowledgeDocumentsPage.vue` | `frontend/src/pages/admin/knowledge/KnowledgeDocumentsPage.tsx` | 主要能力存在，复杂配置仍有差距 |
| 切片管理 | `src/views/admin/KnowledgeChunksPage.vue` | `frontend/src/pages/admin/knowledge/KnowledgeChunksPage.tsx` | 基础能力存在，批量/日志/编辑细节需核对 |
| 意图树 | `src/views/admin/IntentTreePage.vue` | `frontend/src/pages/admin/intent-tree/IntentTreePage.tsx` | 基础能力存在，选择态/聚焦/知识库联动不足 |
| 意图列表/编辑 | `src/views/admin/IntentListPage.vue`、`IntentEditPage.vue` | `frontend/src/pages/admin/intent-tree/*` | 基础能力存在，筛选、跳转、校验需补 |
| 数据通道 | `src/views/admin/IngestionPage.vue` | `frontend/src/pages/admin/ingestion/IngestionPage.tsx` | 当前明显简化，需要重点补齐 |
| 链路追踪 | `src/views/admin/TracesPage.vue`、`TraceDetailPage.vue` | `frontend/src/pages/admin/traces/*` | 功能存在，组件拆分和详情呈现需补 |
| 系统设置/示例问题/关键词/用户 | `src/views/admin/*.vue` | `frontend/src/pages/admin/*` | CRUD 基本存在，表单校验和交互需补 |

## 仍未达到源码级一致的主要差距

### 1. 项目工程体系没有对齐

当前根目录 `package.json` 只有 Vue、Vue Router、Pinia、marked、three、GSAP、Live2D 等依赖；`frontend/package.json` 包含 React、TypeScript、Zustand、Axios、Radix UI、react-hook-form、zod、sonner、lucide、recharts、react-virtuoso、Tailwind 等完整工程体系。

差距：

- 当前没有 TypeScript 类型体系，对接口返回、表单 payload、消息流 payload 没有源码级约束。
- 当前没有 ESLint/Prettier/Tailwind/PostCSS/tsconfig 等与 `frontend` 对应的工程配置。
- 当前没有 `components.json`、shadcn 风格 UI 组件体系。
- 当前全局样式主要在 `src/styles/base.css`、`src/styles/admin-console.css`，与 `frontend/src/styles/globals.css` 的工具类体系不同。

完善步骤：

1. 明确路线：如果保留 Vue，则不引入 React 依赖，但要建立 Vue 版的 `types/`、领域 service、stores/composables 和统一 UI 组件层。
2. 新增 `src/types/`，按 `frontend/src/types/index.ts` 和各 service 类型定义拆出 Vue 版 JSDoc 或 TypeScript 类型。
3. 拆分 `src/services/adminService.js`，至少拆成：
   - `dashboardService`
   - `knowledgeService`
   - `ingestionService`
   - `intentTreeService`
   - `ragTraceService`
   - `sampleQuestionService`
   - `queryTermMappingService`
   - `userService`
   - `settingsService`
4. 统一 API 层，把 `requestRag` 升级成与 `frontend/src/services/api.ts` 等价的拦截器能力：业务 code 判断、401 清理、错误消息规范、请求超时、FormData 自动处理。
5. 增加格式化与检查命令，例如 `npm run lint`、`npm run format`，让后续差距能被工具持续发现。

验收标准：

- 每个后台领域 service 都有独立文件。
- 页面不再直接依赖一个巨大的 `adminService.js`。
- API 错误处理、认证头注入、业务 code 判断有统一入口。
- 至少能通过 `npm run build`，并具备可重复执行的 lint/format 命令。

### 2. 路由与权限守卫没有完全一致

参考实现 `frontend/src/router.tsx` 有 `RequireAuth`、`RequireAdmin`、`RedirectIfAuth`、`HomeRedirect` 和 `NotFoundPage`。当前 `src/router/index.js` 主要根据 token 判断是否登录，后台路由没有管理员角色守卫。

差距：

- `/admin` 当前只要求 token，不检查 `user.role === "admin"`。
- `/` 当前重定向到 `/workspace`，而 `frontend` 是登录后进 `/chat`，未登录进 `/login`。
- 当前聊天主路径是 `/rag`，参考实现主路径是 `/chat`。当前有 `/chat` 到 `/rag` 的兼容重定向，但源码语义不同。
- 当前没有真正的 `NotFoundPage`，大量未知/旧路径被重定向到工作台或后台。
- 当前路由 meta 中存在乱码描述，需要清理，否则后续文档、调试和 UI 都会混乱。

完善步骤：

1. 决定主聊天路径是否改回 `/chat`。如果保留 `/rag`，需要在文档和代码中明确这是 Vue 版差异。
2. 引入 `isAdminUser` 到路由守卫，后台路由校验用户角色，非管理员跳回聊天页。
3. 补一个 `NotFoundView.vue`，让未匹配路径走明确的 404 页面。
4. 清理 `src/router/index.js` 中 meta 的乱码中文。
5. 梳理旧路径兼容表：`/dashboard`、`/knowledge`、`/traces` 等保留重定向，但不要用它们掩盖未知路由。

验收标准：

- 普通用户不能进入 `/admin`。
- 未登录访问任意受保护页面都会带 `redirect` 去登录。
- 已登录访问登录页会回到安全 redirect 或默认聊天/工作台入口。
- 未知路径显示 404，而不是无条件去工作台。

### 3. 聊天模块还没有达到源码组织一致

参考实现拆分为：

- `frontend/src/pages/ChatPage.tsx`
- `frontend/src/stores/chatStore.ts`
- `frontend/src/hooks/useStreamResponse.ts`
- `frontend/src/components/layout/MainLayout.tsx`
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/session/SessionList.tsx`
- `frontend/src/components/session/SessionItem.tsx`
- `frontend/src/components/chat/MessageList.tsx`
- `frontend/src/components/chat/MessageItem.tsx`
- `frontend/src/components/chat/ChatInput.tsx`
- `frontend/src/components/chat/WelcomeScreen.tsx`
- `frontend/src/components/chat/ThinkingIndicator.tsx`
- `frontend/src/components/chat/FeedbackButtons.tsx`
- `frontend/src/components/chat/MarkdownRenderer.tsx`

当前 Vue 版主要集中在 `src/views/RagChatView.vue`，一个文件承担了页面、布局、会话侧栏、消息列表、输入框、SSE、反馈、Markdown、欢迎问题、深度思考状态等大量职责。

差距：

- 没有 Vue 版 `chatStore` 或 composable，聊天状态无法像参考源码一样被组件共享和复位。
- SSE 读取逻辑缺少参考实现中的 `onThinking` 语义拆分和重试能力。
- 组件拆分不足，后续改一个消息渲染会影响整个页面。
- 参考实现按 `today / 7天内 / 30天内 / 更早` 分组会话；当前是 `今天 / 昨天 / 更早`，行为不一致。
- 参考实现有 `sessionsLoaded`、`inputFocusKey`、`isCreatingNew` 等状态边界；当前状态字段不完全一致。
- Markdown 渲染当前使用 `marked.parse(escapeHtml(content))`，需要确认是否会破坏代码块、表格、链接等 GFM 行为；参考实现用独立 `MarkdownRenderer`。
- 当前含有静态检索来源面板和 requestStats 演示数据，需要判断是否为产品需要；若目标对齐 `frontend`，这部分应变成真实数据或移除。

完善步骤：

1. 新建 `src/stores/chatStore.js` 或 `src/composables/useChatStore.js`，把 `RagChatView.vue` 中的会话、消息、发送、取消、反馈、深度思考状态迁出。
2. 新建 `src/composables/useStreamResponse.js`，按参考实现补齐：
   - `onMeta`
   - `onMessage`
   - `onThinking`
   - `onFinish`
   - `onDone`
   - `onCancel`
   - `onReject`
   - `onTitle`
   - `onError`
   - `onEvent`
   - retry/backoff
3. 拆分聊天 UI：
   - `src/layouts/RagMainLayout.vue`
   - `src/components/chat/ChatSidebar.vue`
   - `src/components/chat/SessionList.vue`
   - `src/components/chat/SessionItem.vue`
   - `src/components/chat/MessageList.vue`
   - `src/components/chat/MessageItem.vue`
   - `src/components/chat/ChatInput.vue`
   - `src/components/chat/WelcomeScreen.vue`
   - `src/components/chat/ThinkingIndicator.vue`
   - `src/components/chat/FeedbackButtons.vue`
   - `src/components/chat/MarkdownRenderer.vue`
4. 对齐会话生命周期：
   - 首次进入无 session 时创建空会话状态，不立即请求后端创建。
   - 发送第一条消息后通过 SSE meta 拿到 `conversationId` 并更新路由。
   - 进入不存在的 session 时回到新聊天。
   - 退出登录时取消生成并清空聊天 store。
5. 对齐反馈按钮出现条件：仅 assistant、非 streaming、有真实后端 message id 时显示。
6. 把当前静态检索面板改为真实 trace/source 数据，或标注为当前 Vue 版附加功能，不纳入 frontend 对齐。

验收标准：

- `RagChatView.vue` 只负责组合页面，不再包含大段业务逻辑。
- SSE deep thinking、普通消息、finish、title、cancel、reject 都能按事件正确更新状态。
- 会话搜索、分组、重命名、删除、新建、选择与 `frontend` 行为一致。
- 构建通过，连续快速切换 session 不会把旧流内容写入新会话。

### 4. 后台布局与公共交互还未完全一致

当前 `AdminLayoutView.vue` 已经有侧边栏、面包屑、知识库搜索、修改密码、折叠菜单等能力。但参考源码使用 lucide 图标、Avatar、DropdownMenu、Dialog、toast、GitHub star 获取、布局状态等更完整。

差距：

- 当前图标多为文本符号，不是 lucide 图标体系。
- 当前修改密码失败使用 `alert`，不是统一 toast/dialog 反馈。
- 当前没有统一 `Avatar` 组件和头像加载失败 fallback。
- 当前没有完整对齐 GitHub star 展示行为。
- 当前 admin 导航文案中有乱码，需要清理。
- 当前管理员布局没有独立公共组件，如 PageHeader、StatCard、RunsTable、FilterBar 等。

完善步骤：

1. 新建 `src/components/common/Toast.vue` 或接入一个 Vue toast 库，替代 `alert` 和页面内散落错误文本。
2. 新建 `src/components/common/Avatar.vue`，对齐 `frontend/src/components/common/Avatar.tsx` 的头像与 fallback 行为。
3. 新建 `src/components/admin/PageHeader.vue`、`StatCard.vue`、`FilterBar.vue`、`RunsTable.vue` 等后台复用组件。
4. 把 `src/views/admin/adminShared.js` 的导航文案、图标、分组、面包屑全部清理成正常中文。
5. 对齐知识库全局搜索：
   - 200ms debounce
   - 同时查知识库和文档
   - Enter 优先打开第一个匹配项
   - Escape 关闭浮层
   - 空结果提示
6. 修改密码使用统一表单校验和 toast，成功后清空表单并关闭弹窗。

验收标准：

- 后台所有成功/失败提示统一。
- 不再出现 `alert(...)`。
- 管理后台中文文案无乱码。
- 折叠侧栏、子菜单激活、面包屑、知识库搜索与参考版本行为一致。

### 5. 知识库与文档管理缺少复杂配置细节

知识库列表、文档列表、上传、启用、删除、切片、日志等核心能力已存在。但 `frontend/src/pages/admin/knowledge/KnowledgeDocumentsPage.tsx` 里有更复杂的文档配置与表单状态。

差距：

- 参考实现使用 zod + react-hook-form 做表单校验；当前多为手写 `if (!value) return`。
- 文档详情编辑中，参考实现会解析 `chunkConfig`，动态编辑 chunk 参数。
- 参考实现支持 `scheduleEnabled`、`scheduleCron`、`sourceLocation` 等更多字段的编辑。
- 参考实现加载系统设置、切分策略、数据通道后动态决定可选项；当前只覆盖部分字段。
- 文档上传/URL 添加的处理模式、数据通道、切分策略配置还不够完整。
- `KnowledgeChunksPage` 需要核对批量启停、chunk logs、排序、元数据、编辑弹窗字段是否完全一致。

完善步骤：

1. 对照 `frontend/src/services/knowledgeService.ts` 为 Vue 版补齐所有类型字段：
   - `KnowledgeBase`
   - `KnowledgeDocument`
   - `KnowledgeDocumentUploadPayload`
   - `KnowledgeChunk`
   - `KnowledgeDocumentChunkLog`
   - `ChunkStrategyOption`
2. 为知识库创建弹窗补齐参考实现 `CreateKnowledgeBaseDialog` 的字段、校验和默认值。
3. 文档上传弹窗补齐：
   - file/url source type
   - process mode: `chunk` / `pipeline`
   - chunk strategy
   - pipeline id
   - source location
   - schedule enabled
   - schedule cron
   - chunk config 动态参数
4. 文档详情弹窗打开时调用 `getDocument` 获取最新详情，而不只依赖列表行数据。
5. 对 `chunkConfig` 做 JSON parse/stringify，非法 JSON 时给出明确错误。
6. 切片管理补齐：
   - enabled 过滤
   - create/edit/delete
   - single enable/disable
   - batch enable/disable
   - chunk logs 分页
   - 元数据展示

验收标准：

- 用同一份后端数据，Vue 版可完成 React 版所有知识库/文档/切片操作。
- 表单非法输入有明确错误提示。
- 复杂字段保存后刷新页面仍能正确回显。

### 6. 数据通道 Ingestion 当前是重点缺口

这是当前与 `frontend` 差距最大的后台模块之一。参考 `frontend/src/pages/admin/ingestion/IngestionPage.tsx` 超过两千行，包含 pipeline nodes 可视化/结构化配置、任务创建、来源类型、凭据、metadata、节点详情等。当前 `src/views/admin/IngestionPage.vue` 明显简化。

差距：

- 当前 pipeline 表单只有 `name`、`description`，参考实现支持 `nodesJson` 和结构化 nodes 编辑。
- 参考实现支持节点类型：`fetcher`、`parser`、`enhancer`、`chunker`、`enricher`、`indexer`。
- 参考实现支持 enhancer/enricher tasks、chunker 参数、parser rules、indexer metadataFields 等复杂配置。
- 当前任务创建主要是 URL/file，参考实现支持 `file`、`url`、`feishu`、`s3`。
- 当前任务表单缺少 `fileName`、`credentialsJson`、`metadataJson`。
- 当前没有完整 `getIngestionPipeline(id)`、`getIngestionTask(id)` 详情加载流程。
- 当前分页固定拉 30 条，参考实现有 pipeline/task 独立分页状态。

完善步骤：

1. 先完整迁移 `frontend/src/services/ingestionService.ts` 的类型模型到 Vue：
   - `IngestionPipeline`
   - `IngestionPipelineNode`
   - `IngestionPipelinePayload`
   - `IngestionTask`
   - `IngestionTaskCreatePayload`
   - `IngestionTaskNode`
   - `IngestionResult`
2. 拆分 Ingestion 页面：
   - `IngestionPage.vue`
   - `PipelineTable.vue`
   - `PipelineDialog.vue`
   - `PipelineNodeEditor.vue`
   - `TaskTable.vue`
   - `TaskDialog.vue`
   - `TaskDetailDialog.vue`
3. PipelineDialog 补齐两种编辑方式：
   - JSON 方式：直接编辑 `nodesJson`
   - 表单方式：结构化增删节点，自动生成 nodes payload
4. PipelineNodeEditor 支持不同 nodeType 的专属字段：
   - chunker: strategy、chunkSize、overlapSize、separator
   - enhancer: modelId、tasks、systemPrompt、userPromptTemplate
   - enricher: modelId、attachDocumentMetadata、tasks
   - parser: rulesJson
   - indexer: embeddingModel、metadataFields
   - common: nodeId、nodeType、nextNodeId、condition
5. TaskDialog 补齐来源：
   - file: 文件上传
   - url: location 必填
   - feishu: credentialsJson + location
   - s3: credentialsJson + location
   - metadataJson
6. 任务详情补齐 `getIngestionTask` 和 `getIngestionTaskNodes`，展示节点状态、耗时、输入输出、错误信息。
7. 每个 JSON 输入框增加格式化、校验、错误提示。

验收标准：

- 能在 Vue 版创建与 React 版等价的复杂 pipeline。
- 能创建 file/url/feishu/s3 四类任务。
- 任务详情能看到 pipeline 节点执行明细。
- 非法 JSON 无法提交，并提示具体字段。

### 7. 意图树/意图列表还需补齐选择态、校验和联动

当前 Vue 版已经有意图树、节点创建编辑、批量启停、删除、意图列表和编辑页。但参考实现有更多交互细节。

差距：

- 参考 `IntentTreePage` 支持通过 `?intentCode=` 聚焦节点；当前树页没有完整对齐。
- 参考树页有 selected node 详情视图、expandedMap、parent options、knowledgeBases 选择联动。
- 当前表单校验较弱，缺少 intentCode 正则、名称长度、TopK 正整数等校验。
- 当前 KB 节点与知识库选择/collectionName 的关系需要核对。
- `IntentEditPage` 参考实现会保留 `from` 返回路径；当前返回逻辑较简单。
- `IntentListPage` 参考实现筛选条件更多：层级、类型、状态、父节点，且可跳转树页定位 pathCodes。

完善步骤：

1. 意图树读取 `route.query.intentCode`，加载树后自动展开祖先并选中目标节点。
2. 补齐 selected node 详情区域，展示：
   - level/kind badge
   - intentCode
   - parentCode
   - kbId/collectionName/mcpToolId
   - examples
   - promptSnippet/promptTemplate/paramPromptTemplate
3. 补齐表单校验：
   - name 必填且最大 50
   - intentCode 必填、最大 80、只允许字母数字下划线短横线
   - topK 必须为正整数或为空
   - MCP 节点必须有 mcpToolId
   - KB 节点必须正确处理 kbId/collectionName
4. 意图列表补齐全部筛选项，并与 URL query 同步。
5. 意图编辑页支持 `from` query，保存/取消后回到来源页。

验收标准：

- 从意图列表点击 pathCode 能打开树页并定位节点。
- 新建/编辑时非法字段不能提交。
- 批量启停/删除后列表和树状态一致。

### 8. 链路追踪缺少组件化与详情呈现完整度

参考实现把 trace 页面拆成 `RagTracePage`、`RagTraceDetailPage`、`traceUtils`、`FilterBar`、`PageHeader`、`RunsTable`、`StatCard`。当前 Vue 版是页面内直接实现。

差距：

- 当前没有复用的 StatCard、FilterBar、RunsTable。
- trace 状态颜色、耗时格式化、节点类型格式化需要与 `traceUtils.ts` 对齐。
- 详情页需要核对是否完整展示 request、response、error、nodes、metadata、时间线。
- 当前筛选项和分页需要与参考实现逐项确认。

完善步骤：

1. 新建 `src/views/admin/traceUtils.js`，迁移状态格式化、耗时格式化、颜色映射。
2. 拆分 `TraceFilterBar.vue`、`TraceRunsTable.vue`、`TraceStatCard.vue`。
3. 列表页对齐筛选字段：
   - traceId
   - conversationId
   - taskId
   - status
4. 详情页对齐展示：
   - 基本信息
   - 状态与耗时
   - request/response
   - error
   - nodes timeline
   - 每个节点的输入、输出、metadata

验收标准：

- 同一个 traceId 在 Vue 版与 React 版看到的信息量一致。
- 列表筛选结果与参考实现一致。

### 9. Dashboard 图表与指标组件需要继续核对

当前 Dashboard 已调用 overview、performance、trends 三类接口；参考实现还有 `SimpleLineChart` 组件和一套 KPI 展示。

差距：

- 当前 `src/styles/admin-console.css` 中仍有 `.admin-chart-placeholder`，需要确认是否存在占位图表。
- 参考实现对趋势数据、KPI delta、性能指标有更细的格式化。
- 当前图表实现需要核对是否真实渲染 series，而不是占位或静态布局。

完善步骤：

1. 对照 `frontend/src/pages/admin/dashboard/DashboardPage.tsx` 列出全部 KPI 和图表。
2. 抽出 Vue 版 `SimpleLineChart.vue` 或使用现有轻量图表实现。
3. 对齐 window、metric、granularity 切换。
4. 对齐 delta、deltaPct、successRate、errorRate、noDocRate、slowRate 的格式化。

验收标准：

- Dashboard 没有空白占位图。
- 切换时间窗口后 KPI、性能、趋势都重新请求并刷新。

### 10. 设置、用户、示例问题、关键词映射需要补齐表单体验

这些页面 CRUD 基本存在，但参考实现普遍使用统一表单、弹窗、确认框、toast 和字段校验。

差距：

- 用户管理需要确认 `avatar`、`role`、编辑时密码留空不修改等行为。
- 示例问题需要确认 title、description、question 的校验与展示。
- 关键词映射需要确认 priority、enabled、remark 字段是否完整。
- 系统设置需要确认所有 setting key、boolean/number/string 类型展示是否一致。

完善步骤：

1. 逐页建立字段对照表，以 `frontend/src/services/*.ts` 的类型为准。
2. 每个创建/编辑弹窗补齐：
   - 默认值
   - 必填校验
   - 最大长度
   - 数字范围
   - 保存中 disabled
   - 成功 toast
   - 失败 toast
3. 删除操作全部使用确认弹窗，不直接删除。
4. 列表页补齐搜索、分页、刷新和空状态。

验收标准：

- 每个 CRUD 页面在空数据、加载中、错误、提交中、成功、失败六种状态下都有明确表现。
- 字段保存后刷新仍正确回显。

### 11. 公共 UI 组件体系缺失

参考实现有大量 `frontend/src/components/ui/*`：button、input、select、dialog、table、badge、card、checkbox、tabs、tooltip、separator、alert-dialog 等。当前 Vue 版主要靠 CSS 类和原生控件。

差距：

- 不同页面按钮、弹窗、表格、输入框的状态和样式容易漂移。
- Select、Dialog、AlertDialog、Tooltip、Tabs 等交互不具备统一行为。
- 后续页面补齐时会重复写很多模板。

完善步骤：

1. 建立 Vue 版 UI 基础组件：
   - `UiButton.vue`
   - `UiInput.vue`
   - `UiTextarea.vue`
   - `UiSelect.vue`
   - `UiCheckbox.vue`
   - `UiDialog.vue`
   - `UiAlertDialog.vue`
   - `UiTable.vue`
   - `UiBadge.vue`
   - `UiCard.vue`
   - `UiTabs.vue`
   - `UiTooltip.vue`
2. 先只覆盖后台页面需要的 props，不要一次性追求 shadcn 全量 API。
3. 逐页替换原生控件，优先替换弹窗、按钮、表格、select。
4. 统一 loading、empty、error 组件。

验收标准：

- 后台页面常见控件全部来自统一组件。
- 视觉和交互状态在各页面一致。

### 12. 文案编码和乱码问题必须单独处理

当前与 `frontend` 里都能看到大量乱码中文，例如 `鐭ヨ瘑搴撶鐞?`。当前 Vue 版源码、路由 meta、错误提示、页面文案都有类似问题。

差距：

- 源码可读性差，后续维护成本高。
- UI 若显示乱码，会直接影响用户体验。
- 文档、提示、错误信息无法被稳定搜索和复用。

完善步骤：

1. 建立文案清理清单，优先处理当前 Vue 版用户可见文案：
   - `src/router/index.js`
   - `src/views/RagChatView.vue`
   - `src/views/admin/*.vue`
   - `src/views/admin/adminShared.js`
   - `src/services/*.js`
2. 不要盲目全局替换；按页面运行和截图检查。
3. 把常用中文文案抽到 `src/constants/messages.js` 或各领域常量文件。
4. 清理后执行构建，确认没有因为字符串引号或换行造成语法错误。

验收标准：

- 主路径 `/rag`、`/admin` 所有可见中文无乱码。
- 错误提示、空状态、按钮、导航、面包屑都能正常显示。

## 推荐实施顺序

### 第一阶段：建立对齐基线

目标：先让后续工作有可比对、可验证的基础。

1. 确定路线 A 或路线 B。
2. 写一份模块对照表，记录每个 `frontend/src/...` 文件对应当前 Vue 文件。
3. 清理路由 meta、后台导航、核心错误提示中的乱码。
4. 增加统一 API 错误处理和 toast。
5. 增加管理员角色守卫和 404 页面。
6. 每次改完执行 `npm run build`。

### 第二阶段：拆分服务层和状态层

目标：把“大文件功能移植”变成“可维护源码结构”。

1. 拆分 `adminService.js` 为领域 service。
2. 抽出聊天 store/composable。
3. 抽出 SSE stream composable，并补齐 retry 和 thinking 事件。
4. 抽出 auth/session/user 相关状态同步逻辑。
5. 页面改为依赖领域 service 和 store，不直接塞大量请求逻辑。

### 第三阶段：补齐聊天源码结构

目标：让聊天模块在源码边界和行为上接近 `frontend`。

1. 拆组件：sidebar、session item、message list、message item、input、welcome、thinking、feedback、markdown。
2. 对齐会话创建、选择、删除、重命名、搜索、分组。
3. 对齐 SSE 事件处理。
4. 对齐 deep thinking 展示和结束后的折叠面板。
5. 对齐反馈按钮条件与提交行为。

### 第四阶段：补齐后台公共能力

目标：减少重复代码，为复杂页面改造铺路。

1. 建立基础 UI 组件。
2. 建立 admin 复用组件：PageHeader、StatCard、FilterBar、RunsTable。
3. 替换 `alert` 和页面内散落的错误提示。
4. 统一 loading、empty、error、pagination。
5. 清理所有后台文案乱码。

### 第五阶段：优先补 Ingestion

目标：补齐当前最大缺口。

1. 迁移 ingestion 类型模型。
2. 重写 pipeline dialog，支持 JSON 和结构化节点编辑。
3. 支持所有 nodeType 专属配置。
4. 重写 task dialog，支持 file/url/feishu/s3。
5. 补齐 task detail 的节点执行明细。
6. 加 JSON 校验、格式化和错误提示。

### 第六阶段：补知识库、文档、切片高级配置

目标：让知识库相关页面能覆盖参考实现的所有字段。

1. 补 CreateKnowledgeBaseDialog 字段和校验。
2. 补文档上传和详情编辑中的 processMode、pipeline、chunkStrategy、chunkConfig、schedule 字段。
3. 补 chunk logs、batch enable、metadata 展示。
4. 补系统设置对文档处理策略的联动。

### 第七阶段：补意图、Trace、Dashboard 和其它 CRUD 细节

目标：完成剩余页面的源码级行为对齐。

1. 意图树支持 query 聚焦、展开和 selected detail。
2. 意图列表补完整筛选和跳转。
3. Trace 拆组件并补齐详情。
4. Dashboard 去掉占位，确保图表真实渲染。
5. 用户、示例问题、关键词映射、系统设置逐字段验收。

### 第八阶段：验收与回归

目标：确认不只是代码看起来像，而是操作行为一致。

1. 建立手工验收脚本：
   - 未登录访问 `/rag`、`/admin`
   - 普通用户访问 `/admin`
   - 管理员访问所有后台页面
   - RAG 新建会话、发送、取消、反馈、重命名、删除
   - 知识库创建、上传文档、切片、编辑 chunk、查看日志
   - Ingestion 创建 pipeline、创建 task、查看 task nodes
   - 意图树创建/编辑/删除/跳转定位
   - Trace 筛选和详情
2. 每个模块至少跑一次真实后端联调。
3. 每轮大改后执行：
   - `npm run build`
   - 浏览器打开关键页面检查 console error
   - 对移动端和桌面端各检查一次布局

## 建议优先级

| 优先级 | 工作项 | 原因 |
| --- | --- | --- |
| P0 | 权限守卫、API 错误处理、toast、乱码清理 | 影响全局稳定性和可用性 |
| P0 | 聊天 store/SSE 拆分 | 聊天是核心入口，当前大文件风险高 |
| P1 | Ingestion 完整补齐 | 当前与 `frontend` 差距最大 |
| P1 | 知识库/文档高级配置 | 与 RAG 管理核心流程直接相关 |
| P1 | 公共 UI 组件 | 后续页面补齐效率和一致性依赖它 |
| P2 | 意图树/列表细节 | 功能已有，但需要补交互和校验 |
| P2 | Trace 组件化和详情增强 | 影响排障体验 |
| P2 | Dashboard 图表细节 | 影响管理端观测体验 |
| P3 | 用户/示例问题/关键词/设置细节 | CRUD 已可用，主要补一致性 |

## 最小可交付切片建议

如果不想一次性重构太大，建议按下面的小切片推进：

1. `权限 + toast + 乱码清理`：改路由守卫、统一提示、清理导航和错误文案。
2. `服务层拆分`：只移动函数，不改行为，保证 build 通过。
3. `聊天状态拆分`：先抽 store/composable，不改 UI。
4. `聊天组件拆分`：每次拆一个组件，保持页面行为不变。
5. `Ingestion pipeline dialog`：先支持 JSON 编辑，再做结构化节点编辑。
6. `Ingestion task dialog`：补 file/url/feishu/s3 和 JSON 校验。
7. `知识库文档高级配置`：补 chunkConfig、schedule、pipeline。
8. `Trace/Dashboard/其它 CRUD`：按页面逐个验收。

## 最终判定标准

登录除外，达到源码级一致应满足：

1. `frontend` 中每个非登录页面、service、store、hook、公共组件能力，都能在当前项目找到对应实现。
2. 同一后端接口、同一用户角色、同一数据状态下，主要页面可完成相同操作。
3. 错误、加载、空数据、提交中、成功、失败状态都有对应 UI。
4. 路由、权限、会话生命周期、SSE 事件、表单 payload 与参考实现一致或有明确记录的 Vue 版差异。
5. 构建通过，并完成关键流程浏览器回归。

