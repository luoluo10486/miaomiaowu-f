export const articleManifest = [
  {
    "slug": "RAG项目全链路学习手册",
    "title": "Ragent 项目 RAG 全链路学习手册",
    "fileName": "RAG项目全链路学习手册.md",
    "category": "RAG 架构",
    "excerpt": "这个项目是一个基于 Spring Boot 的企业级 RAG 平台，核心能力包括：",
    "readTime": "49 min",
    "readingUnits": 38331,
    "sectionCount": 18,
    "headingCount": 103,
    "updatedAt": "2026-04-27T02:27:16.916Z",
    "priority": 100,
    "headings": [
      {
        "depth": 2,
        "text": "1. 先用一句话理解这个项目",
        "id": "section-1-先用一句话理解这个项目-1"
      },
      {
        "depth": 2,
        "text": "2. 项目模块总览",
        "id": "section-2-项目模块总览-2"
      },
      {
        "depth": 3,
        "text": "2.1 模块划分",
        "id": "section-21-模块划分-3"
      },
      {
        "depth": 3,
        "text": "2.2 主程序入口",
        "id": "section-22-主程序入口-4"
      },
      {
        "depth": 3,
        "text": "2.3 bootstrap 下的核心业务包",
        "id": "section-23-bootstrap-下的核心业务包-5"
      },
      {
        "depth": 3,
        "text": "2.4 如果你只关心后端，建议这样看",
        "id": "section-24-如果你只关心后端建议这样看-6"
      },
      {
        "depth": 3,
        "text": "2.5 后端模块依赖关系",
        "id": "section-25-后端模块依赖关系-7"
      },
      {
        "depth": 3,
        "text": "2.6 后端每层分别放什么",
        "id": "section-26-后端每层分别放什么-8"
      },
      {
        "depth": 2,
        "text": "3. 先建立整体架构图",
        "id": "section-3-先建立整体架构图-9"
      },
      {
        "depth": 3,
        "text": "3.1 运行时架构",
        "id": "section-31-运行时架构-10"
      },
      {
        "depth": 3,
        "text": "3.2 最重要的三条主线",
        "id": "section-32-最重要的三条主线-11"
      },
      {
        "depth": 2,
        "text": "4. 启动顺序与启动后系统是怎么“活起来”的",
        "id": "section-4-启动顺序与启动后系统是怎么活起来的-12"
      },
      {
        "depth": 3,
        "text": "4.1 后端主服务启动后会发生什么",
        "id": "section-41-后端主服务启动后会发生什么-13"
      },
      {
        "depth": 3,
        "text": "4.2 启动阶段关键初始化",
        "id": "section-42-启动阶段关键初始化-14"
      },
      {
        "depth": 3,
        "text": "4.3 MCP 服务启动后会发生什么",
        "id": "section-43-mcp-服务启动后会发生什么-15"
      },
      {
        "depth": 3,
        "text": "4.4 主服务启动后，后端关键 Bean 是怎么分层装配的",
        "id": "section-44-主服务启动后后端关键-bean-是怎么分层装配的-16"
      },
      {
        "depth": 2,
        "text": "5. 配置文件怎么读",
        "id": "section-5-配置文件怎么读-17"
      },
      {
        "depth": 3,
        "text": "5.1 最关键配置项",
        "id": "section-51-最关键配置项-18"
      },
      {
        "depth": 3,
        "text": "5.2 你一定要形成的配置认知",
        "id": "section-52-你一定要形成的配置认知-19"
      },
      {
        "depth": 3,
        "text": "5.3 每组配置最终绑定到哪些后端类",
        "id": "section-53-每组配置最终绑定到哪些后端类-20"
      },
      {
        "depth": 3,
        "text": "5.4 线程池配置与业务的对应关系",
        "id": "section-54-线程池配置与业务的对应关系-21"
      },
      {
        "depth": 2,
        "text": "6. 前端入口与登录流程",
        "id": "section-6-前端入口与登录流程-22"
      },
      {
        "depth": 3,
        "text": "6.1 前端入口",
        "id": "section-61-前端入口-23"
      },
      {
        "depth": 3,
        "text": "6.2 登录流程",
        "id": "section-62-登录流程-24"
      },
      {
        "depth": 3,
        "text": "6.3 登录调用链",
        "id": "section-63-登录调用链-25"
      },
      {
        "depth": 3,
        "text": "6.4 鉴权机制",
        "id": "section-64-鉴权机制-26"
      },
      {
        "depth": 3,
        "text": "6.5 默认登录账号",
        "id": "section-65-默认登录账号-27"
      },
      {
        "depth": 2,
        "text": "7. 从不熟悉到掌握整个项目的推荐学习路径",
        "id": "section-7-从不熟悉到掌握整个项目的推荐学习路径-28"
      },
      {
        "depth": 3,
        "text": "第 1 阶段：先建立“系统外形”",
        "id": "section-第-1-阶段先建立系统外形-29"
      },
      {
        "depth": 3,
        "text": "第 2 阶段：先打通“登录 + 会话列表 + 聊天页”",
        "id": "section-第-2-阶段先打通登录-会话列表-聊天页-30"
      },
      {
        "depth": 3,
        "text": "第 3 阶段：只盯住“聊天主链路”",
        "id": "section-第-3-阶段只盯住聊天主链路-31"
      },
      {
        "depth": 3,
        "text": "第 4 阶段：拆开理解“改写 / 意图 / 检索”",
        "id": "section-第-4-阶段拆开理解改写-意图-检索-32"
      },
      {
        "depth": 3,
        "text": "第 5 阶段：理解“Prompt 和模型路由”",
        "id": "section-第-5-阶段理解prompt-和模型路由-33"
      },
      {
        "depth": 3,
        "text": "第 6 阶段：理解“知识库入库链路”",
        "id": "section-第-6-阶段理解知识库入库链路-34"
      },
      {
        "depth": 3,
        "text": "第 7 阶段：理解“Pipeline 摄取引擎”",
        "id": "section-第-7-阶段理解pipeline-摄取引擎-35"
      },
      {
        "depth": 3,
        "text": "第 8 阶段：理解“治理能力”",
        "id": "section-第-8-阶段理解治理能力-36"
      },
      {
        "depth": 2,
        "text": "8. 在线问答主链路：完整调用链逐层拆解",
        "id": "section-8-在线问答主链路完整调用链逐层拆解-37"
      },
      {
        "depth": 3,
        "text": "8.1 前端发起聊天",
        "id": "section-81-前端发起聊天-38"
      },
      {
        "depth": 3,
        "text": "8.2 后端聊天入口",
        "id": "section-82-后端聊天入口-39"
      },
      {
        "depth": 3,
        "text": "8.3 限流与排队",
        "id": "section-83-限流与排队-40"
      },
      {
        "depth": 3,
        "text": "8.4 RAGChatServiceImpl ：整个聊天编排总控",
        "id": "section-84-ragchatserviceimpl-整个聊天编排总控-41"
      },
      {
        "depth": 3,
        "text": "8.5 会话记忆链路",
        "id": "section-85-会话记忆链路-42"
      },
      {
        "depth": 3,
        "text": "8.6 Query Rewrite：问题改写与多问拆分",
        "id": "section-86-query-rewrite问题改写与多问拆分-43"
      },
      {
        "depth": 3,
        "text": "8.7 意图识别链路",
        "id": "section-87-意图识别链路-44"
      },
      {
        "depth": 3,
        "text": "8.8 歧义引导链路",
        "id": "section-88-歧义引导链路-45"
      },
      {
        "depth": 3,
        "text": "8.9 检索引擎：KB 与 MCP 的汇合点",
        "id": "section-89-检索引擎kb-与-mcp-的汇合点-46"
      },
      {
        "depth": 3,
        "text": "8.10 KB 检索底层：到底查的是谁",
        "id": "section-810-kb-检索底层到底查的是谁-47"
      },
      {
        "depth": 3,
        "text": "8.11 MCP 工具调用链路",
        "id": "section-811-mcp-工具调用链路-48"
      },
      {
        "depth": 3,
        "text": "8.12 Prompt 组装",
        "id": "section-812-prompt-组装-49"
      },
      {
        "depth": 3,
        "text": "8.13 模型路由层",
        "id": "section-813-模型路由层-50"
      },
      {
        "depth": 3,
        "text": "8.14 SSE 回传与消息落库",
        "id": "section-814-sse-回传与消息落库-51"
      },
      {
        "depth": 2,
        "text": "9. 知识库链路：从创建知识库到可被检索",
        "id": "section-9-知识库链路从创建知识库到可被检索-52"
      },
      {
        "depth": 3,
        "text": "9.1 知识库创建链路",
        "id": "section-91-知识库创建链路-53"
      },
      {
        "depth": 3,
        "text": "9.2 文档上传链路",
        "id": "section-92-文档上传链路-54"
      },
      {
        "depth": 3,
        "text": "9.3 启动分块链路：为什么要走 MQ",
        "id": "section-93-启动分块链路为什么要走-mq-55"
      },
      {
        "depth": 3,
        "text": "9.4 普通分块模式（chunk 模式）",
        "id": "section-94-普通分块模式chunk-模式-56"
      },
      {
        "depth": 3,
        "text": "9.5 Pipeline 模式（pipeline 模式）",
        "id": "section-95-pipeline-模式pipeline-模式-57"
      },
      {
        "depth": 3,
        "text": "9.6 摄取引擎 IngestionEngine",
        "id": "section-96-摄取引擎-ingestionengine-58"
      },
      {
        "depth": 3,
        "text": "9.7 各类 Pipeline 节点具体做什么",
        "id": "section-97-各类-pipeline-节点具体做什么-59"
      },
      {
        "depth": 3,
        "text": "9.8 Chunk 手工管理链路",
        "id": "section-98-chunk-手工管理链路-60"
      },
      {
        "depth": 3,
        "text": "9.9 文档定时刷新链路",
        "id": "section-99-文档定时刷新链路-61"
      },
      {
        "depth": 2,
        "text": "10. 数据模型：你至少要认识这些表",
        "id": "section-10-数据模型你至少要认识这些表-62"
      },
      {
        "depth": 3,
        "text": "10.1 用户与会话",
        "id": "section-101-用户与会话-63"
      },
      {
        "depth": 3,
        "text": "10.2 RAG 治理配置",
        "id": "section-102-rag-治理配置-64"
      },
      {
        "depth": 3,
        "text": "10.3 知识库与文档",
        "id": "section-103-知识库与文档-65"
      },
      {
        "depth": 3,
        "text": "10.4 摄取流水线",
        "id": "section-104-摄取流水线-66"
      },
      {
        "depth": 2,
        "text": "11. 管理后台接口清单与调用链入口",
        "id": "section-11-管理后台接口清单与调用链入口-67"
      },
      {
        "depth": 3,
        "text": "11.1 用户与认证",
        "id": "section-111-用户与认证-68"
      },
      {
        "depth": 3,
        "text": "11.2 会话与聊天",
        "id": "section-112-会话与聊天-69"
      },
      {
        "depth": 3,
        "text": "11.3 RAG 配置治理",
        "id": "section-113-rag-配置治理-70"
      },
      {
        "depth": 3,
        "text": "11.4 知识库与文档",
        "id": "section-114-知识库与文档-71"
      },
      {
        "depth": 3,
        "text": "11.5 Chunk 管理",
        "id": "section-115-chunk-管理-72"
      },
      {
        "depth": 3,
        "text": "11.6 摄取流水线",
        "id": "section-116-摄取流水线-73"
      },
      {
        "depth": 3,
        "text": "11.7 仪表盘与 MCP",
        "id": "section-117-仪表盘与-mcp-74"
      },
      {
        "depth": 3,
        "text": "11.8 如果你要按“接口 调用链”排查后端问题，建议优先从这些入口下手",
        "id": "section-118-如果你要按接口-调用链排查后端问题建议优先从这些入口下手-75"
      },
      {
        "depth": 2,
        "text": "12. 中间件在项目里分别干什么",
        "id": "section-12-中间件在项目里分别干什么-76"
      },
      {
        "depth": 3,
        "text": "12.1 PostgreSQL",
        "id": "section-121-postgresql-77"
      },
      {
        "depth": 3,
        "text": "12.2 Redis / Redisson",
        "id": "section-122-redis-redisson-78"
      },
      {
        "depth": 3,
        "text": "12.3 RocketMQ",
        "id": "section-123-rocketmq-79"
      },
      {
        "depth": 3,
        "text": "12.4 RustFS（S3 兼容）",
        "id": "section-124-rustfss3-兼容-80"
      },
      {
        "depth": 3,
        "text": "12.5 Milvus",
        "id": "section-125-milvus-81"
      },
      {
        "depth": 3,
        "text": "12.6 Sa Token",
        "id": "section-126-sa-token-82"
      },
      {
        "depth": 3,
        "text": "12.7 Apache Tika",
        "id": "section-127-apache-tika-83"
      },
      {
        "depth": 3,
        "text": "12.8 OkHttp",
        "id": "section-128-okhttp-84"
      },
      {
        "depth": 2,
        "text": "13. Trace、幂等、限流这些“看起来不是业务，实际上很重要”的能力",
        "id": "section-13-trace幂等限流这些看起来不是业务实际上很重要的能力-85"
      },
      {
        "depth": 3,
        "text": "13.1 Trace",
        "id": "section-131-trace-86"
      },
      {
        "depth": 3,
        "text": "13.2 幂等",
        "id": "section-132-幂等-87"
      },
      {
        "depth": 3,
        "text": "13.3 全局聊天限流",
        "id": "section-133-全局聊天限流-88"
      },
      {
        "depth": 2,
        "text": "14. 如果你要真正掌握这个项目，建议你这样“动手验证”",
        "id": "section-14-如果你要真正掌握这个项目建议你这样动手验证-89"
      },
      {
        "depth": 3,
        "text": "14.1 第一轮：只验证登录和聊天",
        "id": "section-141-第一轮只验证登录和聊天-90"
      },
      {
        "depth": 3,
        "text": "14.2 第二轮：只验证文档入库",
        "id": "section-142-第二轮只验证文档入库-91"
      },
      {
        "depth": 3,
        "text": "14.3 第三轮：只验证意图与治理",
        "id": "section-143-第三轮只验证意图与治理-92"
      },
      {
        "depth": 3,
        "text": "14.4 第四轮：只验证 Pipeline",
        "id": "section-144-第四轮只验证-pipeline-93"
      },
      {
        "depth": 2,
        "text": "15. 最后给你一个“真正掌握”的判断标准",
        "id": "section-15-最后给你一个真正掌握的判断标准-94"
      },
      {
        "depth": 2,
        "text": "16. 最后给你的最短阅读清单（如果你时间不多）",
        "id": "section-16-最后给你的最短阅读清单如果你时间不多-95"
      },
      {
        "depth": 2,
        "text": "16.5 只从后端掌握项目的精读顺序",
        "id": "section-165-只从后端掌握项目的精读顺序-96"
      },
      {
        "depth": 3,
        "text": "第一步：先看“系统骨架”",
        "id": "section-第一步先看系统骨架-97"
      },
      {
        "depth": 3,
        "text": "第二步：看“聊天主骨架”",
        "id": "section-第二步看聊天主骨架-98"
      },
      {
        "depth": 3,
        "text": "第三步：把聊天拆成 5 个后端子系统",
        "id": "section-第三步把聊天拆成-5-个后端子系统-99"
      },
      {
        "depth": 3,
        "text": "第四步：看“知识库入库”",
        "id": "section-第四步看知识库入库-100"
      },
      {
        "depth": 3,
        "text": "第五步：看“Pipeline 引擎”",
        "id": "section-第五步看pipeline-引擎-101"
      },
      {
        "depth": 3,
        "text": "第六步：看“治理和运维能力”",
        "id": "section-第六步看治理和运维能力-102"
      },
      {
        "depth": 2,
        "text": "17. 一句话总结整套项目设计思想",
        "id": "section-17-一句话总结整套项目设计思想-103"
      }
    ]
  },
  {
    "slug": "Ragent全项目串联总览",
    "title": "Ragent 全项目串联总览",
    "fileName": "Ragent全项目串联总览.md",
    "category": "RAG 架构",
    "excerpt": "这是一份把项目从前端、主链路、知识库、MCP、AI 基础层到 Trace 全部串起来的总图。读完这份，基本就能回答“一个问题是怎么从界面走到模型、再走回页面”的完整故事。",
    "readTime": "15 min",
    "readingUnits": 9401,
    "sectionCount": 10,
    "headingCount": 42,
    "updatedAt": "2026-05-16T13:19:11.969Z",
    "priority": 92,
    "headings": [
      {
        "depth": 2,
        "text": "1. 模块边界先看清",
        "id": "section-1-模块边界先看清-1"
      },
      {
        "depth": 2,
        "text": "2. 整体总图",
        "id": "section-2-整体总图-2"
      },
      {
        "depth": 2,
        "text": "3. 一次问答怎么穿过整个项目",
        "id": "section-3-一次问答怎么穿过整个项目-3"
      },
      {
        "depth": 3,
        "text": "3.1 前端先发起请求",
        "id": "section-31-前端先发起请求-4"
      },
      {
        "depth": 3,
        "text": "3.2 Controller 只是入口，真正先接住的是 SSE 句柄",
        "id": "section-32-controller-只是入口真正先接住的是-sse-句柄-5"
      },
      {
        "depth": 3,
        "text": "3.3 业务服务先分配会话和任务 ID",
        "id": "section-33-业务服务先分配会话和任务-id-6"
      },
      {
        "depth": 3,
        "text": "3.4 请求先进入队列限流，不是直接进主链路",
        "id": "section-34-请求先进入队列限流不是直接进主链路-7"
      },
      {
        "depth": 3,
        "text": "3.5 Redis 先记排队凭证，再做公平抢占",
        "id": "section-35-redis-先记排队凭证再做公平抢占-8"
      },
      {
        "depth": 3,
        "text": "3.6 真正放行后，才进入 Trace 和业务执行",
        "id": "section-36-真正放行后才进入-trace-和业务执行-9"
      },
      {
        "depth": 3,
        "text": "3.7 StreamChatPipeline 的八个阶段开始跑",
        "id": "section-37-streamchatpipeline-的八个阶段开始跑-10"
      },
      {
        "depth": 3,
        "text": "3.8 上下文是怎么组装出来的",
        "id": "section-38-上下文是怎么组装出来的-11"
      },
      {
        "depth": 3,
        "text": "3.9 AI 基础层开始做首包探测和取消句柄",
        "id": "section-39-ai-基础层开始做首包探测和取消句柄-12"
      },
      {
        "depth": 3,
        "text": "3.10 这三家 provider 怎么被统一起来",
        "id": "section-310-这三家-provider-怎么被统一起来-13"
      },
      {
        "depth": 3,
        "text": "3.11 “三台熔断”其实是按 modelId 管的健康状态",
        "id": "section-311-三台熔断其实是按-modelid-管的健康状态-14"
      },
      {
        "depth": 3,
        "text": "3.12 流式输出真正到前端时，已经被探测和绑定好了",
        "id": "section-312-流式输出真正到前端时已经被探测和绑定好了-15"
      },
      {
        "depth": 3,
        "text": "3.13 SSE 事件怎么一步步推给前端",
        "id": "section-313-sse-事件怎么一步步推给前端-16"
      },
      {
        "depth": 3,
        "text": "3.14 最后释放的不是一个资源，而是两类资源",
        "id": "section-314-最后释放的不是一个资源而是两类资源-17"
      },
      {
        "depth": 3,
        "text": "3.15 这一轮请求的完整闭环",
        "id": "section-315-这一轮请求的完整闭环-18"
      },
      {
        "depth": 2,
        "text": "4. 知识库是怎么进入主链路的",
        "id": "section-4-知识库是怎么进入主链路的-19"
      },
      {
        "depth": 3,
        "text": "4.1 先创建知识库",
        "id": "section-41-先创建知识库-20"
      },
      {
        "depth": 3,
        "text": "4.2 再上传文档",
        "id": "section-42-再上传文档-21"
      },
      {
        "depth": 3,
        "text": "4.3 开始分块",
        "id": "section-43-开始分块-22"
      },
      {
        "depth": 3,
        "text": "4.4 Consumer 真正执行分块",
        "id": "section-44-consumer-真正执行分块-23"
      },
      {
        "depth": 3,
        "text": "4.5 定时刷新也走同一套链路",
        "id": "section-45-定时刷新也走同一套链路-24"
      },
      {
        "depth": 3,
        "text": "4.6 文档和 Chunk 还能被手工维护",
        "id": "section-46-文档和-chunk-还能被手工维护-25"
      },
      {
        "depth": 2,
        "text": "5. AI 基础层怎么把模型能力统一起来",
        "id": "section-5-ai-基础层怎么把模型能力统一起来-26"
      },
      {
        "depth": 3,
        "text": "5.1 Chat 路由的真实样子",
        "id": "section-51-chat-路由的真实样子-27"
      },
      {
        "depth": 3,
        "text": "5.2 这三家 provider 怎么统一进来",
        "id": "section-52-这三家-provider-怎么统一进来-28"
      },
      {
        "depth": 3,
        "text": "5.3 三台“熔断”其实是按 modelId 管健康",
        "id": "section-53-三台熔断其实是按-modelid-管健康-29"
      },
      {
        "depth": 3,
        "text": "5.4 首包探测和取消句柄是怎么接起来的",
        "id": "section-54-首包探测和取消句柄是怎么接起来的-30"
      },
      {
        "depth": 3,
        "text": "5.5 为什么这一层重要",
        "id": "section-55-为什么这一层重要-31"
      },
      {
        "depth": 2,
        "text": "6. MCP 是怎么接进来的",
        "id": "section-6-mcp-是怎么接进来的-32"
      },
      {
        "depth": 3,
        "text": "6.1 服务端",
        "id": "section-61-服务端-33"
      },
      {
        "depth": 3,
        "text": "6.2 客户端",
        "id": "section-62-客户端-34"
      },
      {
        "depth": 3,
        "text": "6.3 检索阶段怎么用 MCP",
        "id": "section-63-检索阶段怎么用-mcp-35"
      },
      {
        "depth": 2,
        "text": "7. 前端和后台怎么把这些能力摆出来",
        "id": "section-7-前端和后台怎么把这些能力摆出来-36"
      },
      {
        "depth": 2,
        "text": "8. 用三个例子把整个项目串起来",
        "id": "section-8-用三个例子把整个项目串起来-37"
      },
      {
        "depth": 3,
        "text": "8.1 例子一：问一个知识库问题",
        "id": "section-81-例子一问一个知识库问题-38"
      },
      {
        "depth": 3,
        "text": "8.2 例子二：上传文档并让它可检索",
        "id": "section-82-例子二上传文档并让它可检索-39"
      },
      {
        "depth": 3,
        "text": "8.3 例子三：问一个需要实时工具的数据",
        "id": "section-83-例子三问一个需要实时工具的数据-40"
      },
      {
        "depth": 2,
        "text": "9. 这一整套项目，最该记住的闭环",
        "id": "section-9-这一整套项目最该记住的闭环-41"
      },
      {
        "depth": 2,
        "text": "10. 一句话总括",
        "id": "section-10-一句话总括-42"
      }
    ]
  },
  {
    "slug": "StreamChatPipeline完整链路深度解析",
    "title": "StreamChatPipeline 完整链路深度解析",
    "fileName": "StreamChatPipeline完整链路深度解析.md",
    "category": "RAG 架构",
    "excerpt": "本文专门拆解 StreamChatPipeline.execute(StreamChatContext ctx) 这一条流式 RAG 问答主链路。",
    "readTime": "46 min",
    "readingUnits": 41211,
    "sectionCount": 19,
    "headingCount": 124,
    "updatedAt": "2026-05-16T02:12:31.339Z",
    "priority": 86,
    "headings": [
      {
        "depth": 2,
        "text": "一、整体入口链路",
        "id": "section-一整体入口链路-1"
      },
      {
        "depth": 3,
        "text": "1. Controller 入口",
        "id": "section-1-controller-入口-2"
      },
      {
        "depth": 3,
        "text": "2. Service 入口",
        "id": "section-2-service-入口-3"
      },
      {
        "depth": 2,
        "text": "二、主链路流程图",
        "id": "section-二主链路流程图-4"
      },
      {
        "depth": 2,
        "text": "三、阶段一： loadMemory(ctx)",
        "id": "section-三阶段一-loadmemoryctx-5"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-6"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-7"
      },
      {
        "depth": 3,
        "text": "3. 主逻辑",
        "id": "section-3-主逻辑-8"
      },
      {
        "depth": 3,
        "text": "4. DefaultConversationMemoryService.load(...)",
        "id": "section-4-defaultconversationmemoryserviceload-9"
      },
      {
        "depth": 3,
        "text": "5. loadSummaryWithFallback(...)",
        "id": "section-5-loadsummarywithfallback-10"
      },
      {
        "depth": 3,
        "text": "6. loadHistoryWithFallback(...)",
        "id": "section-6-loadhistorywithfallback-11"
      },
      {
        "depth": 3,
        "text": "7. append(...)",
        "id": "section-7-append-12"
      },
      {
        "depth": 3,
        "text": "8. attachSummary(summary, history)",
        "id": "section-8-attachsummarysummary-history-13"
      },
      {
        "depth": 2,
        "text": "四、阶段二： rewriteQuery(ctx)",
        "id": "section-四阶段二-rewritequeryctx-14"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-15"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-16"
      },
      {
        "depth": 3,
        "text": "3. 主逻辑",
        "id": "section-3-主逻辑-17"
      },
      {
        "depth": 3,
        "text": "4. 术语归一化",
        "id": "section-4-术语归一化-18"
      },
      {
        "depth": 3,
        "text": "5. buildRewriteRequest(...)",
        "id": "section-5-buildrewriterequest-19"
      },
      {
        "depth": 3,
        "text": "6. callLLMRewriteAndSplit(...)",
        "id": "section-6-callllmrewriteandsplit-20"
      },
      {
        "depth": 3,
        "text": "7. parseRewriteAndSplit(raw)",
        "id": "section-7-parserewriteandsplitraw-21"
      },
      {
        "depth": 3,
        "text": "8. ruleBasedSplit(question)",
        "id": "section-8-rulebasedsplitquestion-22"
      },
      {
        "depth": 2,
        "text": "五、阶段三： resolveIntents(ctx)",
        "id": "section-五阶段三-resolveintentsctx-23"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-24"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-25"
      },
      {
        "depth": 3,
        "text": "3. IntentResolver.resolve(...)",
        "id": "section-3-intentresolverresolve-26"
      },
      {
        "depth": 3,
        "text": "4. classifyIntents(question)",
        "id": "section-4-classifyintentsquestion-27"
      },
      {
        "depth": 3,
        "text": "5. DefaultIntentClassifier.classifyTargets(question)",
        "id": "section-5-defaultintentclassifierclassifytargetsquestion-28"
      },
      {
        "depth": 3,
        "text": "6. loadIntentTreeData()",
        "id": "section-6-loadintenttreedata-29"
      },
      {
        "depth": 3,
        "text": "7. buildPrompt(leafNodes)",
        "id": "section-7-buildpromptleafnodes-30"
      },
      {
        "depth": 3,
        "text": "8. capTotalIntents(subIntents)",
        "id": "section-8-captotalintentssubintents-31"
      },
      {
        "depth": 2,
        "text": "六、阶段四： handleGuidance(ctx)",
        "id": "section-六阶段四-handleguidancectx-32"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-33"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-34"
      },
      {
        "depth": 3,
        "text": "3. 主逻辑",
        "id": "section-3-主逻辑-35"
      },
      {
        "depth": 3,
        "text": "4. IntentGuidanceService.detectAmbiguity(...)",
        "id": "section-4-intentguidanceservicedetectambiguity-36"
      },
      {
        "depth": 3,
        "text": "5. findAmbiguityGroup(question, subIntents)",
        "id": "section-5-findambiguitygroupquestion-subintents-37"
      },
      {
        "depth": 3,
        "text": "6. filterCandidates(scores)",
        "id": "section-6-filtercandidatesscores-38"
      },
      {
        "depth": 3,
        "text": "7. resolveSystemNodeId(node)",
        "id": "section-7-resolvesystemnodeidnode-39"
      },
      {
        "depth": 3,
        "text": "8. shouldSkipGuidance(question, ranked)",
        "id": "section-8-shouldskipguidancequestion-ranked-40"
      },
      {
        "depth": 3,
        "text": "9. confirmAmbiguity(question, ranked)",
        "id": "section-9-confirmambiguityquestion-ranked-41"
      },
      {
        "depth": 3,
        "text": "10. buildPrompt(topicName, ranked)",
        "id": "section-10-buildprompttopicname-ranked-42"
      },
      {
        "depth": 2,
        "text": "七、阶段五： handleSystemOnly(ctx)",
        "id": "section-七阶段五-handlesystemonlyctx-43"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-44"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-45"
      },
      {
        "depth": 3,
        "text": "3. 主逻辑",
        "id": "section-3-主逻辑-46"
      },
      {
        "depth": 3,
        "text": "4. intentResolver.isSystemOnly(nodeScores)",
        "id": "section-4-intentresolverissystemonlynodescores-47"
      },
      {
        "depth": 3,
        "text": "5. streamSystemResponse(...)",
        "id": "section-5-streamsystemresponse-48"
      },
      {
        "depth": 2,
        "text": "八、阶段六： retrieve(ctx)",
        "id": "section-八阶段六-retrievectx-49"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-50"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-51"
      },
      {
        "depth": 3,
        "text": "3. RetrievalEngine.retrieve(subIntents, topK)",
        "id": "section-3-retrievalengineretrievesubintents-topk-52"
      },
      {
        "depth": 3,
        "text": "4. buildSubQuestionContext(intent, topK)",
        "id": "section-4-buildsubquestioncontextintent-topk-53"
      },
      {
        "depth": 3,
        "text": "5. resolveSubQuestionTopK(intent, fallbackTopK)",
        "id": "section-5-resolvesubquestiontopkintent-fallbacktopk-54"
      },
      {
        "depth": 3,
        "text": "6. KB 路径： retrieveAndRerank(intent, kbIntents, topK)",
        "id": "section-6-kb-路径-retrieveandrerankintent-kbintents-topk-55"
      },
      {
        "depth": 3,
        "text": "7. MultiChannelRetrievalEngine.retrieveKnowledgeChannels(...)",
        "id": "section-7-multichannelretrievalengineretrieveknowledgechannels-56"
      },
      {
        "depth": 3,
        "text": "8. buildSearchContext(subIntents, topK)",
        "id": "section-8-buildsearchcontextsubintents-topk-57"
      },
      {
        "depth": 3,
        "text": "9. executeSearchChannels(context)",
        "id": "section-9-executesearchchannelscontext-58"
      },
      {
        "depth": 3,
        "text": "10. executePostProcessors(results, context)",
        "id": "section-10-executepostprocessorsresults-context-59"
      },
      {
        "depth": 3,
        "text": "11. MCP 路径： executeMcpAndMerge(question, mcpIntents)",
        "id": "section-11-mcp-路径-executemcpandmergequestion-mcpintents-60"
      },
      {
        "depth": 3,
        "text": "12. executeMcpTools(question, mcpIntentScores)",
        "id": "section-12-executemcptoolsquestion-mcpintentscores-61"
      },
      {
        "depth": 3,
        "text": "13. buildMcpRequest(question, intentNode)",
        "id": "section-13-buildmcprequestquestion-intentnode-62"
      },
      {
        "depth": 3,
        "text": "14. executeSingleMcpTool(request)",
        "id": "section-14-executesinglemcptoolrequest-63"
      },
      {
        "depth": 3,
        "text": "15. appendSection(builder, question, context)",
        "id": "section-15-appendsectionbuilder-question-context-64"
      },
      {
        "depth": 2,
        "text": "九、阶段七： handleEmptyRetrieval(ctx, retrievalCtx)",
        "id": "section-九阶段七-handleemptyretrievalctx-retrievalctx-65"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-66"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-67"
      },
      {
        "depth": 3,
        "text": "3. 判断逻辑",
        "id": "section-3-判断逻辑-68"
      },
      {
        "depth": 3,
        "text": "4. 主逻辑",
        "id": "section-4-主逻辑-69"
      },
      {
        "depth": 2,
        "text": "十、阶段八： streamRagResponse(ctx, retrievalCtx)",
        "id": "section-十阶段八-streamragresponsectx-retrievalctx-70"
      },
      {
        "depth": 3,
        "text": "1. 方法输入",
        "id": "section-1-方法输入-71"
      },
      {
        "depth": 3,
        "text": "2. 方法输出",
        "id": "section-2-方法输出-72"
      },
      {
        "depth": 3,
        "text": "3. 主逻辑",
        "id": "section-3-主逻辑-73"
      },
      {
        "depth": 3,
        "text": "4. mergeIntentGroup(subIntents)",
        "id": "section-4-mergeintentgroupsubintents-74"
      },
      {
        "depth": 3,
        "text": "5. streamLLMResponse(...)",
        "id": "section-5-streamllmresponse-75"
      },
      {
        "depth": 3,
        "text": "6. PromptContext",
        "id": "section-6-promptcontext-76"
      },
      {
        "depth": 2,
        "text": "十一、Prompt 组装细节",
        "id": "section-十一prompt-组装细节-77"
      },
      {
        "depth": 3,
        "text": "1. buildStructuredMessages(...)",
        "id": "section-1-buildstructuredmessages-78"
      },
      {
        "depth": 3,
        "text": "2. buildSystemPrompt(context)",
        "id": "section-2-buildsystempromptcontext-79"
      },
      {
        "depth": 3,
        "text": "3. plan(context)",
        "id": "section-3-plancontext-80"
      },
      {
        "depth": 3,
        "text": "4. planKbOnly(context)",
        "id": "section-4-plankbonlycontext-81"
      },
      {
        "depth": 3,
        "text": "5. planPrompt(intents, intentChunks)",
        "id": "section-5-planpromptintents-intentchunks-82"
      },
      {
        "depth": 3,
        "text": "6. planMcpOnly(context)",
        "id": "section-6-planmcponlycontext-83"
      },
      {
        "depth": 3,
        "text": "7. planMixed(context)",
        "id": "section-7-planmixedcontext-84"
      },
      {
        "depth": 3,
        "text": "8. defaultTemplate(scene)",
        "id": "section-8-defaulttemplatescene-85"
      },
      {
        "depth": 2,
        "text": "十二、上下文格式化细节",
        "id": "section-十二上下文格式化细节-86"
      },
      {
        "depth": 3,
        "text": "1. formatKbContext(kbIntents, rerankedByIntent, topK)",
        "id": "section-1-formatkbcontextkbintents-rerankedbyintent-topk-87"
      },
      {
        "depth": 3,
        "text": "2. formatSingleIntentContext(...)",
        "id": "section-2-formatsingleintentcontext-88"
      },
      {
        "depth": 3,
        "text": "3. formatMultiIntentContext(...)",
        "id": "section-3-formatmultiintentcontext-89"
      },
      {
        "depth": 3,
        "text": "4. formatMcpContext(responses, mcpIntents)",
        "id": "section-4-formatmcpcontextresponses-mcpintents-90"
      },
      {
        "depth": 2,
        "text": "十三、SSE 流式输出与回写闭环",
        "id": "section-十三sse-流式输出与回写闭环-91"
      },
      {
        "depth": 3,
        "text": "1. 初始化",
        "id": "section-1-初始化-92"
      },
      {
        "depth": 3,
        "text": "2. onThinking(chunk)",
        "id": "section-2-onthinkingchunk-93"
      },
      {
        "depth": 3,
        "text": "3. onContent(chunk)",
        "id": "section-3-oncontentchunk-94"
      },
      {
        "depth": 3,
        "text": "4. sendChunked(type, content)",
        "id": "section-4-sendchunkedtype-content-95"
      },
      {
        "depth": 3,
        "text": "5. onComplete()",
        "id": "section-5-oncomplete-96"
      },
      {
        "depth": 3,
        "text": "6. onError(t)",
        "id": "section-6-onerrort-97"
      },
      {
        "depth": 3,
        "text": "7. 取消链路",
        "id": "section-7-取消链路-98"
      },
      {
        "depth": 2,
        "text": "十四、完整时序图",
        "id": "section-十四完整时序图-99"
      },
      {
        "depth": 2,
        "text": "十五、用一个例子串完整流程",
        "id": "section-十五用一个例子串完整流程-100"
      },
      {
        "depth": 3,
        "text": "1. Controller 阶段",
        "id": "section-1-controller-阶段-101"
      },
      {
        "depth": 3,
        "text": "2. Service 阶段",
        "id": "section-2-service-阶段-102"
      },
      {
        "depth": 3,
        "text": "3. loadMemory(ctx)",
        "id": "section-3-loadmemoryctx-103"
      },
      {
        "depth": 3,
        "text": "4. rewriteQuery(ctx)",
        "id": "section-4-rewritequeryctx-104"
      },
      {
        "depth": 3,
        "text": "5. resolveIntents(ctx)",
        "id": "section-5-resolveintentsctx-105"
      },
      {
        "depth": 3,
        "text": "6. handleGuidance(ctx)",
        "id": "section-6-handleguidancectx-106"
      },
      {
        "depth": 3,
        "text": "7. handleSystemOnly(ctx)",
        "id": "section-7-handlesystemonlyctx-107"
      },
      {
        "depth": 3,
        "text": "8. retrieve(ctx)",
        "id": "section-8-retrievectx-108"
      },
      {
        "depth": 3,
        "text": "9. handleEmptyRetrieval(ctx, retrievalCtx)",
        "id": "section-9-handleemptyretrievalctx-retrievalctx-109"
      },
      {
        "depth": 3,
        "text": "10. streamRagResponse(ctx, retrievalCtx)",
        "id": "section-10-streamragresponsectx-retrievalctx-110"
      },
      {
        "depth": 3,
        "text": "11. Prompt 组装",
        "id": "section-11-prompt-组装-111"
      },
      {
        "depth": 3,
        "text": "12. 流式输出",
        "id": "section-12-流式输出-112"
      },
      {
        "depth": 2,
        "text": "十六、三个短路分支的例子",
        "id": "section-十六三个短路分支的例子-113"
      },
      {
        "depth": 3,
        "text": "1. 歧义澄清短路",
        "id": "section-1-歧义澄清短路-114"
      },
      {
        "depth": 3,
        "text": "2. 系统直答短路",
        "id": "section-2-系统直答短路-115"
      },
      {
        "depth": 3,
        "text": "3. 空检索兜底短路",
        "id": "section-3-空检索兜底短路-116"
      },
      {
        "depth": 2,
        "text": "十七、数据在 ctx 里的变化",
        "id": "section-十七数据在-ctx-里的变化-117"
      },
      {
        "depth": 2,
        "text": "十八、这条链路的设计重点",
        "id": "section-十八这条链路的设计重点-118"
      },
      {
        "depth": 3,
        "text": "1. 每个阶段只做一类判断",
        "id": "section-1-每个阶段只做一类判断-119"
      },
      {
        "depth": 3,
        "text": "2. 失败降级贯穿全链路",
        "id": "section-2-失败降级贯穿全链路-120"
      },
      {
        "depth": 3,
        "text": "3. 三个地方避免模型胡答",
        "id": "section-3-三个地方避免模型胡答-121"
      },
      {
        "depth": 3,
        "text": "4. 记忆闭环很完整",
        "id": "section-4-记忆闭环很完整-122"
      },
      {
        "depth": 3,
        "text": "5. 检索和生成之间有明确边界",
        "id": "section-5-检索和生成之间有明确边界-123"
      },
      {
        "depth": 2,
        "text": "十九、一句话总括",
        "id": "section-十九一句话总括-124"
      }
    ]
  },
  {
    "slug": "知识库总结",
    "title": "知识库总结",
    "fileName": "知识库总结.md",
    "category": "知识库",
    "excerpt": "上传文档接口的核心职责是： 把文件安全放进系统，并生成文档主表记录，不做分块和向量化 。",
    "readTime": "87 min",
    "readingUnits": 34840,
    "sectionCount": 15,
    "headingCount": 144,
    "updatedAt": "2026-04-23T14:40:24.556Z",
    "priority": 80,
    "headings": [
      {
        "depth": 2,
        "text": "一、上传文档接口链路",
        "id": "section-一上传文档接口链路-1"
      },
      {
        "depth": 2,
        "text": "二、分块接口链路",
        "id": "section-二分块接口链路-2"
      },
      {
        "depth": 2,
        "text": "三、定时同步链路",
        "id": "section-三定时同步链路-3"
      },
      {
        "depth": 2,
        "text": "四、文档启用/禁用接口链路",
        "id": "section-四文档启用禁用接口链路-4"
      },
      {
        "depth": 2,
        "text": "五、文档与 Chunk 管理接口链路",
        "id": "section-五文档与-chunk-管理接口链路-5"
      },
      {
        "depth": 2,
        "text": "六、知识库文件上传大小限制原理",
        "id": "section-六知识库文件上传大小限制原理-6"
      },
      {
        "depth": 3,
        "text": "1. 这篇文章主要回答的是什么问题",
        "id": "section-1-这篇文章主要回答的是什么问题-7"
      },
      {
        "depth": 3,
        "text": "2. 为什么很多人会误以为“先读后检查”",
        "id": "section-2-为什么很多人会误以为先读后检查-8"
      },
      {
        "depth": 3,
        "text": "3. 真正的底层机制是什么",
        "id": "section-3-真正的底层机制是什么-9"
      },
      {
        "depth": 3,
        "text": "4. 为什么不会把超大文件整包读进内存",
        "id": "section-4-为什么不会把超大文件整包读进内存-10"
      },
      {
        "depth": 3,
        "text": "5. MultipartFile 到底是什么",
        "id": "section-5-multipartfile-到底是什么-11"
      },
      {
        "depth": 3,
        "text": "6. 这几个配置分别控制什么",
        "id": "section-6-这几个配置分别控制什么-12"
      },
      {
        "depth": 3,
        "text": "7. 超限时为什么你看到的是业务 JSON，而不是 413",
        "id": "section-7-超限时为什么你看到的是业务-json而不是-413-13"
      },
      {
        "depth": 3,
        "text": "8. 如果客户端不老实，会不会绕过限制",
        "id": "section-8-如果客户端不老实会不会绕过限制-14"
      },
      {
        "depth": 3,
        "text": "9. 这篇文章和“30MB 文件为什么占了 100MB 内存”有什么区别",
        "id": "section-9-这篇文章和30mb-文件为什么占了-100mb-内存有什么区别-15"
      },
      {
        "depth": 3,
        "text": "10. 这部分最值得记住的点",
        "id": "section-10-这部分最值得记住的点-16"
      },
      {
        "depth": 3,
        "text": "11. 一段适合回头快速看的总结",
        "id": "section-11-一段适合回头快速看的总结-17"
      },
      {
        "depth": 2,
        "text": "七、为什么上传30MB文件占了100MB内存？",
        "id": "section-七为什么上传30mb文件占了100mb内存-18"
      },
      {
        "depth": 3,
        "text": "1. 这个问题的本质是什么",
        "id": "section-1-这个问题的本质是什么-19"
      },
      {
        "depth": 3,
        "text": "2. 为什么会出现内存放大",
        "id": "section-2-为什么会出现内存放大-20"
      },
      {
        "depth": 3,
        "text": "3. “看起来流式”为什么不一定真流式",
        "id": "section-3-看起来流式为什么不一定真流式-21"
      },
      {
        "depth": 3,
        "text": "4. 这篇文章指出的关键根因",
        "id": "section-4-这篇文章指出的关键根因-22"
      },
      {
        "depth": 3,
        "text": "5. 为什么这类问题平时不容易被发现",
        "id": "section-5-为什么这类问题平时不容易被发现-23"
      },
      {
        "depth": 3,
        "text": "6. 这篇文章给出的优化方向",
        "id": "section-6-这篇文章给出的优化方向-24"
      },
      {
        "depth": 3,
        "text": "7. 为什么预签名 URL 值得记住",
        "id": "section-7-为什么预签名-url-值得记住-25"
      },
      {
        "depth": 3,
        "text": "8. 这个问题和前面上传接口总结怎么连起来",
        "id": "section-8-这个问题和前面上传接口总结怎么连起来-26"
      },
      {
        "depth": 3,
        "text": "9. 这部分最值得记住的点",
        "id": "section-9-这部分最值得记住的点-27"
      },
      {
        "depth": 3,
        "text": "10. 一段适合回头快速看的总结",
        "id": "section-10-一段适合回头快速看的总结-28"
      },
      {
        "depth": 2,
        "text": "八、文件上传分布式限流如何做？",
        "id": "section-八文件上传分布式限流如何做-29"
      },
      {
        "depth": 3,
        "text": "1. 为什么有了大小限制还不够",
        "id": "section-1-为什么有了大小限制还不够-30"
      },
      {
        "depth": 3,
        "text": "2. 为什么不用 QPS 限流",
        "id": "section-2-为什么不用-qps-限流-31"
      },
      {
        "depth": 3,
        "text": "3. 这个场景真正需要的是信号量",
        "id": "section-3-这个场景真正需要的是信号量-32"
      },
      {
        "depth": 3,
        "text": "4. 为什么需要分布式信号量",
        "id": "section-4-为什么需要分布式信号量-33"
      },
      {
        "depth": 3,
        "text": "5. 为什么最终选 Redisson 的可过期信号量",
        "id": "section-5-为什么最终选-redisson-的可过期信号量-34"
      },
      {
        "depth": 3,
        "text": "6. 这套限流方案怎么落到代码里",
        "id": "section-6-这套限流方案怎么落到代码里-35"
      },
      {
        "depth": 3,
        "text": "7. 为什么要在上传之前获取许可",
        "id": "section-7-为什么要在上传之前获取许可-36"
      },
      {
        "depth": 3,
        "text": "8. leaseSeconds 为什么要特别关注",
        "id": "section-8-leaseseconds-为什么要特别关注-37"
      },
      {
        "depth": 3,
        "text": "9. 这部分和上传主链路怎么串起来",
        "id": "section-9-这部分和上传主链路怎么串起来-38"
      },
      {
        "depth": 3,
        "text": "10. 这部分最值得记住的点",
        "id": "section-10-这部分最值得记住的点-39"
      },
      {
        "depth": 3,
        "text": "11. 一段适合回头快速看的总结",
        "id": "section-11-一段适合回头快速看的总结-40"
      },
      {
        "depth": 2,
        "text": "九、分布式限流选业务层还是网关层？",
        "id": "section-九分布式限流选业务层还是网关层-41"
      },
      {
        "depth": 3,
        "text": "1. 这个问题为什么很关键",
        "id": "section-1-这个问题为什么很关键-42"
      },
      {
        "depth": 3,
        "text": "2. 先记住上传请求的大致处理顺序",
        "id": "section-2-先记住上传请求的大致处理顺序-43"
      },
      {
        "depth": 3,
        "text": "3. 为什么 Service 层限流最晚",
        "id": "section-3-为什么-service-层限流最晚-44"
      },
      {
        "depth": 3,
        "text": "4. 为什么 Filter 层更适合单体应用",
        "id": "section-4-为什么-filter-层更适合单体应用-45"
      },
      {
        "depth": 3,
        "text": "5. Filter 层还解决不了什么",
        "id": "section-5-filter-层还解决不了什么-46"
      },
      {
        "depth": 3,
        "text": "6. 为什么 Gateway 层更适合微服务",
        "id": "section-6-为什么-gateway-层更适合微服务-47"
      },
      {
        "depth": 3,
        "text": "7. 三层方案可以怎么对比",
        "id": "section-7-三层方案可以怎么对比-48"
      },
      {
        "depth": 3,
        "text": "8. 为什么说 Filter 和 Gateway 不是互斥关系",
        "id": "section-8-为什么说-filter-和-gateway-不是互斥关系-49"
      },
      {
        "depth": 3,
        "text": "9. 单体和微服务怎么选",
        "id": "section-9-单体和微服务怎么选-50"
      },
      {
        "depth": 3,
        "text": "10. 这部分最值得记住的点",
        "id": "section-10-这部分最值得记住的点-51"
      },
      {
        "depth": 3,
        "text": "11. 一段适合回头快速看的总结",
        "id": "section-11-一段适合回头快速看的总结-52"
      },
      {
        "depth": 2,
        "text": "十、知识库文档上传接口",
        "id": "section-十知识库文档上传接口-53"
      },
      {
        "depth": 3,
        "text": "1. 接口定位",
        "id": "section-1-接口定位-54"
      },
      {
        "depth": 3,
        "text": "2. 接口定义",
        "id": "section-2-接口定义-55"
      },
      {
        "depth": 3,
        "text": "3. 关键参数",
        "id": "section-3-关键参数-56"
      },
      {
        "depth": 3,
        "text": "4. 来源类型的含义",
        "id": "section-4-来源类型的含义-57"
      },
      {
        "depth": 3,
        "text": "5. 参数校验逻辑",
        "id": "section-5-参数校验逻辑-58"
      },
      {
        "depth": 3,
        "text": "6. 文件处理逻辑",
        "id": "section-6-文件处理逻辑-59"
      },
      {
        "depth": 3,
        "text": "7. 为什么 URL 抓取要先落临时文件",
        "id": "section-7-为什么-url-抓取要先落临时文件-60"
      },
      {
        "depth": 3,
        "text": "8. 上传接口的完整执行流程",
        "id": "section-8-上传接口的完整执行流程-61"
      },
      {
        "depth": 3,
        "text": "9. 上传完成后的状态",
        "id": "section-9-上传完成后的状态-62"
      },
      {
        "depth": 3,
        "text": "10. 为什么 upload 接口不直接做分块",
        "id": "section-10-为什么-upload-接口不直接做分块-63"
      },
      {
        "depth": 3,
        "text": "11. 为什么 upload 接口不加大事务",
        "id": "section-11-为什么-upload-接口不加大事务-64"
      },
      {
        "depth": 3,
        "text": "12. 这个接口最值得记住的点",
        "id": "section-12-这个接口最值得记住的点-65"
      },
      {
        "depth": 3,
        "text": "13. 一段适合回头快速看的总结",
        "id": "section-13-一段适合回头快速看的总结-66"
      },
      {
        "depth": 2,
        "text": "十一、知识库文档开始分块接口",
        "id": "section-十一知识库文档开始分块接口-67"
      },
      {
        "depth": 3,
        "text": "1. 接口定位",
        "id": "section-1-接口定位-68"
      },
      {
        "depth": 3,
        "text": "2. 接口定义",
        "id": "section-2-接口定义-69"
      },
      {
        "depth": 3,
        "text": "3. 这个接口为什么独立存在",
        "id": "section-3-这个接口为什么独立存在-70"
      },
      {
        "depth": 3,
        "text": "4. 接口入口与调用方式",
        "id": "section-4-接口入口与调用方式-71"
      },
      {
        "depth": 3,
        "text": "5. 同步阶段做了什么",
        "id": "section-5-同步阶段做了什么-72"
      },
      {
        "depth": 3,
        "text": "6. 为什么要先做状态更新",
        "id": "section-6-为什么要先做状态更新-73"
      },
      {
        "depth": 3,
        "text": "7. 并发控制为什么用 CAS",
        "id": "section-7-并发控制为什么用-cas-74"
      },
      {
        "depth": 3,
        "text": "8. 为什么不用分布式锁",
        "id": "section-8-为什么不用分布式锁-75"
      },
      {
        "depth": 3,
        "text": "9. 为什么要用 RocketMQ 事务消息",
        "id": "section-9-为什么要用-rocketmq-事务消息-76"
      },
      {
        "depth": 3,
        "text": "10. 本地事务逻辑里除了改状态还做了什么",
        "id": "section-10-本地事务逻辑里除了改状态还做了什么-77"
      },
      {
        "depth": 3,
        "text": "11. 请求返回后真正发生了什么",
        "id": "section-11-请求返回后真正发生了什么-78"
      },
      {
        "depth": 3,
        "text": "12. 用一段话把整个分块流程串起来看",
        "id": "section-12-用一段话把整个分块流程串起来看-79"
      },
      {
        "depth": 3,
        "text": "13. 状态是怎么变化的",
        "id": "section-13-状态是怎么变化的-80"
      },
      {
        "depth": 3,
        "text": "14. 为什么真正的分块逻辑不包大事务",
        "id": "section-14-为什么真正的分块逻辑不包大事务-81"
      },
      {
        "depth": 3,
        "text": "15. 原子性真正保证在哪",
        "id": "section-15-原子性真正保证在哪-82"
      },
      {
        "depth": 3,
        "text": "16. 分块日志为什么很重要",
        "id": "section-16-分块日志为什么很重要-83"
      },
      {
        "depth": 3,
        "text": "17. 开始分块接口最值得记住的点",
        "id": "section-17-开始分块接口最值得记住的点-84"
      },
      {
        "depth": 3,
        "text": "18. 一段适合回头快速看的总结",
        "id": "section-18-一段适合回头快速看的总结-85"
      },
      {
        "depth": 2,
        "text": "十二、深度解析知识库定时同步的架构设计",
        "id": "section-十二深度解析知识库定时同步的架构设计-86"
      },
      {
        "depth": 3,
        "text": "1. 这个机制是干什么的",
        "id": "section-1-这个机制是干什么的-87"
      },
      {
        "depth": 3,
        "text": "2. 整体链路怎么理解",
        "id": "section-2-整体链路怎么理解-88"
      },
      {
        "depth": 3,
        "text": "3. 定时同步依赖的数据模型",
        "id": "section-3-定时同步依赖的数据模型-89"
      },
      {
        "depth": 3,
        "text": "4. 五个核心组件分别负责什么",
        "id": "section-4-五个核心组件分别负责什么-90"
      },
      {
        "depth": 3,
        "text": "5. 为什么要做分布式锁",
        "id": "section-5-为什么要做分布式锁-91"
      },
      {
        "depth": 3,
        "text": "6. 这里的分布式锁是怎么实现的",
        "id": "section-6-这里的分布式锁是怎么实现的-92"
      },
      {
        "depth": 3,
        "text": "7. 自动心跳续锁机制",
        "id": "section-7-自动心跳续锁机制-93"
      },
      {
        "depth": 3,
        "text": "8. 为什么业务流程里还要主动检测锁失效",
        "id": "section-8-为什么业务流程里还要主动检测锁失效-94"
      },
      {
        "depth": 3,
        "text": "9. 释放锁为什么也要校验 lockOwner",
        "id": "section-9-释放锁为什么也要校验-lockowner-95"
      },
      {
        "depth": 3,
        "text": "10. 为什么需要变更检测",
        "id": "section-10-为什么需要变更检测-96"
      },
      {
        "depth": 3,
        "text": "11. 两级变更检测策略",
        "id": "section-11-两级变更检测策略-97"
      },
      {
        "depth": 3,
        "text": "12. RemoteFetchResult 的设计价值",
        "id": "section-12-remotefetchresult-的设计价值-98"
      },
      {
        "depth": 3,
        "text": "13. 整个定时同步机制最值得记住的点",
        "id": "section-13-整个定时同步机制最值得记住的点-99"
      },
      {
        "depth": 3,
        "text": "14. 一段适合回头快速看的总结",
        "id": "section-14-一段适合回头快速看的总结-100"
      },
      {
        "depth": 2,
        "text": "十三、定时同步的调度引擎与故障恢复",
        "id": "section-十三定时同步的调度引擎与故障恢复-101"
      },
      {
        "depth": 3,
        "text": "1. 调度引擎到底负责什么",
        "id": "section-1-调度引擎到底负责什么-102"
      },
      {
        "depth": 3,
        "text": "2. 调度引擎的工作模式",
        "id": "section-2-调度引擎的工作模式-103"
      },
      {
        "depth": 3,
        "text": "3. 调度 SQL 在整个系统里的意义",
        "id": "section-3-调度-sql-在整个系统里的意义-104"
      },
      {
        "depth": 3,
        "text": "4. 执行流程为什么要拆成三阶段",
        "id": "section-4-执行流程为什么要拆成三阶段-105"
      },
      {
        "depth": 3,
        "text": "4.1 第一阶段：准备阶段",
        "id": "section-41-第一阶段准备阶段-106"
      },
      {
        "depth": 3,
        "text": "4.2 第二阶段：执行阶段",
        "id": "section-42-第二阶段执行阶段-107"
      },
      {
        "depth": 3,
        "text": "4.3 第三阶段：收尾阶段",
        "id": "section-43-第三阶段收尾阶段-108"
      },
      {
        "depth": 3,
        "text": "5. 为什么需要 Phase 阶段追踪",
        "id": "section-5-为什么需要-phase-阶段追踪-109"
      },
      {
        "depth": 3,
        "text": "6. 为什么线程池满了要释放锁",
        "id": "section-6-为什么线程池满了要释放锁-110"
      },
      {
        "depth": 3,
        "text": "7. 为什么需要 RUNNING 状态故障恢复",
        "id": "section-7-为什么需要-running-状态故障恢复-111"
      },
      {
        "depth": 3,
        "text": "8. 双重故障恢复是怎么配合的",
        "id": "section-8-双重故障恢复是怎么配合的-112"
      },
      {
        "depth": 3,
        "text": "9. 为什么手动分块和定时同步不会互相冲突",
        "id": "section-9-为什么手动分块和定时同步不会互相冲突-113"
      },
      {
        "depth": 3,
        "text": "10. 为什么锁失效时只更新 exec，不强行更新 schedule",
        "id": "section-10-为什么锁失效时只更新-exec不强行更新-schedule-114"
      },
      {
        "depth": 3,
        "text": "11. 为什么必须保留执行历史表",
        "id": "section-11-为什么必须保留执行历史表-115"
      },
      {
        "depth": 3,
        "text": "12. 为什么“分块成功但文件元数据切换失败”时要保留新文件",
        "id": "section-12-为什么分块成功但文件元数据切换失败时要保留新文件-116"
      },
      {
        "depth": 3,
        "text": "13. 生命周期管理补充",
        "id": "section-13-生命周期管理补充-117"
      },
      {
        "depth": 3,
        "text": "14. 配置调优要关注哪几项",
        "id": "section-14-配置调优要关注哪几项-118"
      },
      {
        "depth": 3,
        "text": "15. 这一部分最值得记住的点",
        "id": "section-15-这一部分最值得记住的点-119"
      },
      {
        "depth": 3,
        "text": "16. 一段适合回头快速看的总结",
        "id": "section-16-一段适合回头快速看的总结-120"
      },
      {
        "depth": 2,
        "text": "十四、知识库文档管理接口",
        "id": "section-十四知识库文档管理接口-121"
      },
      {
        "depth": 3,
        "text": "1. 这组接口主要解决什么问题",
        "id": "section-1-这组接口主要解决什么问题-122"
      },
      {
        "depth": 3,
        "text": "2. 三个接口整体概览",
        "id": "section-2-三个接口整体概览-123"
      },
      {
        "depth": 3,
        "text": "3. 三个接口的共同设计思想",
        "id": "section-3-三个接口的共同设计思想-124"
      },
      {
        "depth": 3,
        "text": "4. delete 接口完整总结",
        "id": "section-4-delete-接口完整总结-125"
      },
      {
        "depth": 3,
        "text": "5. update 接口完整总结",
        "id": "section-5-update-接口完整总结-126"
      },
      {
        "depth": 3,
        "text": "6. enable 接口完整总结",
        "id": "section-6-enable-接口完整总结-127"
      },
      {
        "depth": 3,
        "text": "7. 文档级接口里 deleted、enabled、status 怎么配合",
        "id": "section-7-文档级接口里-deletedenabledstatus-怎么配合-128"
      },
      {
        "depth": 3,
        "text": "8. 文档级接口和 Chunk 级接口的关系",
        "id": "section-8-文档级接口和-chunk-级接口的关系-129"
      },
      {
        "depth": 3,
        "text": "9. 这一部分最值得记住的点",
        "id": "section-9-这一部分最值得记住的点-130"
      },
      {
        "depth": 3,
        "text": "10. 一段适合回头快速看的总结",
        "id": "section-10-一段适合回头快速看的总结-131"
      },
      {
        "depth": 2,
        "text": "十五、知识库数据分块管理接口",
        "id": "section-十五知识库数据分块管理接口-132"
      },
      {
        "depth": 3,
        "text": "1. 这一组接口是干什么的",
        "id": "section-1-这一组接口是干什么的-133"
      },
      {
        "depth": 3,
        "text": "2. 六个接口整体概览",
        "id": "section-2-六个接口整体概览-134"
      },
      {
        "depth": 3,
        "text": "3. 这组接口里最关键的三个字段",
        "id": "section-3-这组接口里最关键的三个字段-135"
      },
      {
        "depth": 3,
        "text": "4. 分页查询接口在做什么",
        "id": "section-4-分页查询接口在做什么-136"
      },
      {
        "depth": 3,
        "text": "5. 新增 Chunk 接口的完整含义",
        "id": "section-5-新增-chunk-接口的完整含义-137"
      },
      {
        "depth": 3,
        "text": "6. 更新 Chunk 内容接口要怎么理解",
        "id": "section-6-更新-chunk-内容接口要怎么理解-138"
      },
      {
        "depth": 3,
        "text": "7. 删除 Chunk 接口的完整含义",
        "id": "section-7-删除-chunk-接口的完整含义-139"
      },
      {
        "depth": 3,
        "text": "8. 单条启用/禁用接口在做什么",
        "id": "section-8-单条启用禁用接口在做什么-140"
      },
      {
        "depth": 3,
        "text": "9. 批量启用/禁用为什么用编程式事务",
        "id": "section-9-批量启用禁用为什么用编程式事务-141"
      },
      {
        "depth": 3,
        "text": "10. Chunk 管理接口里哪些场景会碰到 deleted",
        "id": "section-10-chunk-管理接口里哪些场景会碰到-deleted-142"
      },
      {
        "depth": 3,
        "text": "11. 这一部分最值得记住的点",
        "id": "section-11-这一部分最值得记住的点-143"
      },
      {
        "depth": 3,
        "text": "12. 一段适合回头快速看的总结",
        "id": "section-12-一段适合回头快速看的总结-144"
      }
    ]
  },
  {
    "slug": "知识问答总结",
    "title": "知识问答总结",
    "fileName": "知识问答总结.md",
    "category": "知识库",
    "excerpt": "记忆服务的核心职责是： 把旧历史加载、当前消息落库、长对话压缩摘要这三件事收拢到同一条链路里，给后面的改写、意图识别和检索稳定提供上下文。",
    "readTime": "84 min",
    "readingUnits": 36924,
    "sectionCount": 20,
    "headingCount": 158,
    "updatedAt": "2026-05-16T13:01:07.504Z",
    "priority": 80,
    "headings": [
      {
        "depth": 2,
        "text": "一、记忆服务的完整链路",
        "id": "section-一记忆服务的完整链路-1"
      },
      {
        "depth": 2,
        "text": "二、意图识别的完整链路",
        "id": "section-二意图识别的完整链路-2"
      },
      {
        "depth": 2,
        "text": "三、歧义引导的完整链路",
        "id": "section-三歧义引导的完整链路-3"
      },
      {
        "depth": 3,
        "text": "3.1 歧义引导如果没触发，后面怎么继续",
        "id": "section-31-歧义引导如果没触发后面怎么继续-4"
      },
      {
        "depth": 3,
        "text": "3.2 歧义引导如果触发了，下一轮为什么还能顺回来",
        "id": "section-32-歧义引导如果触发了下一轮为什么还能顺回来-5"
      },
      {
        "depth": 3,
        "text": "3.3 歧义引导之后，后面四个阶段在代码里怎么跑",
        "id": "section-33-歧义引导之后后面四个阶段在代码里怎么跑-6"
      },
      {
        "depth": 2,
        "text": "四、歧义引导后，后面四个阶段怎么继续跑？",
        "id": "section-四歧义引导后后面四个阶段怎么继续跑-7"
      },
      {
        "depth": 3,
        "text": "1. 阶段 5：系统直答",
        "id": "section-1-阶段-5系统直答-8"
      },
      {
        "depth": 3,
        "text": "2. 阶段 6：多通道检索",
        "id": "section-2-阶段-6多通道检索-9"
      },
      {
        "depth": 3,
        "text": "3. 阶段 7：空结果兜底",
        "id": "section-3-阶段-7空结果兜底-10"
      },
      {
        "depth": 3,
        "text": "4. 阶段 8：Prompt 组装与流式生成",
        "id": "section-4-阶段-8prompt-组装与流式生成-11"
      },
      {
        "depth": 3,
        "text": "5. 这四段连起来的意义",
        "id": "section-5-这四段连起来的意义-12"
      },
      {
        "depth": 3,
        "text": "6. 一句话总结",
        "id": "section-6-一句话总结-13"
      },
      {
        "depth": 2,
        "text": "五、大模型没有记忆多轮对话怎么做到不失忆？",
        "id": "section-五大模型没有记忆多轮对话怎么做到不失忆-14"
      },
      {
        "depth": 3,
        "text": "1. 记忆系统到底在解决什么问题",
        "id": "section-1-记忆系统到底在解决什么问题-15"
      },
      {
        "depth": 3,
        "text": "2. 为什么拆成三层结构",
        "id": "section-2-为什么拆成三层结构-16"
      },
      {
        "depth": 3,
        "text": "3. load(...) 这段代码到底在做什么",
        "id": "section-3-load-这段代码到底在做什么-17"
      },
      {
        "depth": 3,
        "text": "4. 这里的降级策略到底是什么",
        "id": "section-4-这里的降级策略到底是什么-18"
      },
      {
        "depth": 3,
        "text": "5. 加载摘要和历史时，会不会再调一次 LLM",
        "id": "section-5-加载摘要和历史时会不会再调一次-llm-19"
      },
      {
        "depth": 3,
        "text": "6. 滑动窗口到底体现在哪",
        "id": "section-6-滑动窗口到底体现在哪-20"
      },
      {
        "depth": 3,
        "text": "7. listMessages(...) 这个接口除了查消息，还做了什么",
        "id": "section-7-listmessages-这个接口除了查消息还做了什么-21"
      },
      {
        "depth": 3,
        "text": "8. 摘要和历史是怎么合并的",
        "id": "section-8-摘要和历史是怎么合并的-22"
      },
      {
        "depth": 3,
        "text": "9. 记忆注入 Prompt 的完整顺序",
        "id": "section-9-记忆注入-prompt-的完整顺序-23"
      },
      {
        "depth": 3,
        "text": "10. 一句话总结",
        "id": "section-10-一句话总结-24"
      },
      {
        "depth": 2,
        "text": "六、聊满 50 轮，Token 爆了，记忆该压缩还是该删？",
        "id": "section-六聊满-50-轮token-爆了记忆该压缩还是该删-25"
      },
      {
        "depth": 3,
        "text": "1. 为什么不能一直保留全部原文",
        "id": "section-1-为什么不能一直保留全部原文-26"
      },
      {
        "depth": 3,
        "text": "2. 为什么又不能简单直接删掉",
        "id": "section-2-为什么又不能简单直接删掉-27"
      },
      {
        "depth": 3,
        "text": "3. 什么时候触发摘要压缩",
        "id": "section-3-什么时候触发摘要压缩-28"
      },
      {
        "depth": 3,
        "text": "4. 压缩范围是怎么界定的",
        "id": "section-4-压缩范围是怎么界定的-29"
      },
      {
        "depth": 3,
        "text": "5. 为什么要有分布式锁和阈值",
        "id": "section-5-为什么要有分布式锁和阈值-30"
      },
      {
        "depth": 3,
        "text": "6. 生成摘要时，到底给 LLM 传了什么",
        "id": "section-6-生成摘要时到底给-llm-传了什么-31"
      },
      {
        "depth": 3,
        "text": "7. 这些核心约束各自想控制什么",
        "id": "section-7-这些核心约束各自想控制什么-32"
      },
      {
        "depth": 3,
        "text": "8. 话题+状态 、 关键约束 、 关键词 该怎么区分",
        "id": "section-8-话题状态-关键约束-关键词-该怎么区分-33"
      },
      {
        "depth": 3,
        "text": "9. 状态标注规范到底放在哪里",
        "id": "section-9-状态标注规范到底放在哪里-34"
      },
      {
        "depth": 3,
        "text": "10. 一句话总结",
        "id": "section-10-一句话总结-35"
      },
      {
        "depth": 2,
        "text": "七、用户说的话 ≠ 该搜的词",
        "id": "section-七用户说的话-该搜的词-36"
      },
      {
        "depth": 3,
        "text": "1. 为什么用户原话不能直接拿去搜",
        "id": "section-1-为什么用户原话不能直接拿去搜-37"
      },
      {
        "depth": 3,
        "text": "2. 为什么不仅要改写，还要拆分子问题",
        "id": "section-2-为什么不仅要改写还要拆分子问题-38"
      },
      {
        "depth": 3,
        "text": "3. 术语归一化这层到底在做什么",
        "id": "section-3-术语归一化这层到底在做什么-39"
      },
      {
        "depth": 3,
        "text": "4. 映射规则现在放在哪里",
        "id": "section-4-映射规则现在放在哪里-40"
      },
      {
        "depth": 3,
        "text": "5. 如果要新增一条映射规则，最终该落什么数据",
        "id": "section-5-如果要新增一条映射规则最终该落什么数据-41"
      },
      {
        "depth": 3,
        "text": "6. rewriteWithSplit 的完整链路",
        "id": "section-6-rewritewithsplit-的完整链路-42"
      },
      {
        "depth": 3,
        "text": "7. 为什么接口要设计成三层回退",
        "id": "section-7-为什么接口要设计成三层回退-43"
      },
      {
        "depth": 3,
        "text": "8. 为什么改写只看最近一两轮历史",
        "id": "section-8-为什么改写只看最近一两轮历史-44"
      },
      {
        "depth": 3,
        "text": "9. 为什么改写失败不能拖垮主流程",
        "id": "section-9-为什么改写失败不能拖垮主流程-45"
      },
      {
        "depth": 3,
        "text": "10. 一句话总结",
        "id": "section-10-一句话总结-46"
      },
      {
        "depth": 2,
        "text": "八、四分类撑不住 20 个知识库为什么要设计意图树",
        "id": "section-八四分类撑不住-20-个知识库为什么要设计意图树-47"
      },
      {
        "depth": 3,
        "text": "1. 为什么平面四分类到后面一定不够用",
        "id": "section-1-为什么平面四分类到后面一定不够用-48"
      },
      {
        "depth": 3,
        "text": "2. 为什么不能简单粗暴地全库都搜",
        "id": "section-2-为什么不能简单粗暴地全库都搜-49"
      },
      {
        "depth": 3,
        "text": "3. 意图树的本质：从大类到细类逐步收窄",
        "id": "section-3-意图树的本质从大类到细类逐步收窄-50"
      },
      {
        "depth": 3,
        "text": "4. 为什么只让叶子节点参与最终匹配",
        "id": "section-4-为什么只让叶子节点参与最终匹配-51"
      },
      {
        "depth": 3,
        "text": "5. 为什么要把 KB / MCP / SYSTEM 统一挂在一棵树里",
        "id": "section-5-为什么要把-kb-mcp-system-统一挂在一棵树里-52"
      },
      {
        "depth": 3,
        "text": "6. 一个 IntentNode 上到底装了哪些信息",
        "id": "section-6-一个-intentnode-上到底装了哪些信息-53"
      },
      {
        "depth": 3,
        "text": "7. 数据库里为什么不是直接存树",
        "id": "section-7-数据库里为什么不是直接存树-54"
      },
      {
        "depth": 3,
        "text": "8. Redis 缓存起的是什么作用",
        "id": "section-8-redis-缓存起的是什么作用-55"
      },
      {
        "depth": 3,
        "text": "9. 为什么后台维护时要强制子树一致",
        "id": "section-9-为什么后台维护时要强制子树一致-56"
      },
      {
        "depth": 3,
        "text": "10. IntentTreeFactory 和数据库各扮演什么角色",
        "id": "section-10-intenttreefactory-和数据库各扮演什么角色-57"
      },
      {
        "depth": 3,
        "text": "11. 一句话总结",
        "id": "section-11-一句话总结-58"
      },
      {
        "depth": 2,
        "text": "九、怎么让大模型同时看 30 个意图节点打分？",
        "id": "section-九怎么让大模型同时看-30-个意图节点打分-59"
      },
      {
        "depth": 3,
        "text": "1. 先搞清楚这个问题在解决什么",
        "id": "section-1-先搞清楚这个问题在解决什么-60"
      },
      {
        "depth": 3,
        "text": "2. 整体链路先看一遍",
        "id": "section-2-整体链路先看一遍-61"
      },
      {
        "depth": 3,
        "text": "3. buildPrompt() 到底在做什么",
        "id": "section-3-buildprompt-到底在做什么-62"
      },
      {
        "depth": 3,
        "text": "4. 为什么这里不用 JSON，而要用 key=value",
        "id": "section-4-为什么这里不用-json而要用-keyvalue-63"
      },
      {
        "depth": 3,
        "text": "5. 模型真正看到的输入，不止节点列表",
        "id": "section-5-模型真正看到的输入不止节点列表-64"
      },
      {
        "depth": 3,
        "text": "6. Prompt 模板是怎么加载与渲染的",
        "id": "section-6-prompt-模板是怎么加载与渲染的-65"
      },
      {
        "depth": 3,
        "text": "7. Prompt 是怎么教模型打分的",
        "id": "section-7-prompt-是怎么教模型打分的-66"
      },
      {
        "depth": 3,
        "text": "8. 为什么默认只保留一个主意图",
        "id": "section-8-为什么默认只保留一个主意图-67"
      },
      {
        "depth": 3,
        "text": "9. 为什么模型调用参数要故意调保守",
        "id": "section-9-为什么模型调用参数要故意调保守-68"
      },
      {
        "depth": 3,
        "text": "10. 模型返回后，后端为什么还要再清洗一遍",
        "id": "section-10-模型返回后后端为什么还要再清洗一遍-69"
      },
      {
        "depth": 3,
        "text": "11. 打分结果回来后，为什么还要再过滤",
        "id": "section-11-打分结果回来后为什么还要再过滤-70"
      },
      {
        "depth": 3,
        "text": "12. 打分出来以后，怎么继续决定查哪个库、查多少条",
        "id": "section-12-打分出来以后怎么继续决定查哪个库查多少条-71"
      },
      {
        "depth": 3,
        "text": "13. 一句话总结",
        "id": "section-13-一句话总结-72"
      },
      {
        "depth": 2,
        "text": "十、三个子问题命中了八个意图，该保留哪几个",
        "id": "section-十三个子问题命中了八个意图该保留哪几个-73"
      },
      {
        "depth": 3,
        "text": "1. 这个问题为什么会出现",
        "id": "section-1-这个问题为什么会出现-74"
      },
      {
        "depth": 3,
        "text": "2. 第一层控制只管“单题”，还不管“全局”",
        "id": "section-2-第一层控制只管单题还不管全局-75"
      },
      {
        "depth": 3,
        "text": "3. 真正做全局裁剪的是 capTotalIntents(...)",
        "id": "section-3-真正做全局裁剪的是-captotalintents-76"
      },
      {
        "depth": 3,
        "text": "4. 为什么不能简单按全局分数截前 3",
        "id": "section-4-为什么不能简单按全局分数截前-3-77"
      },
      {
        "depth": 3,
        "text": "5. 这套封顶算法的思路是什么",
        "id": "section-5-这套封顶算法的思路是什么-78"
      },
      {
        "depth": 3,
        "text": "6. 中间为什么要引入 IntentCandidate",
        "id": "section-6-中间为什么要引入-intentcandidate-79"
      },
      {
        "depth": 3,
        "text": "7. 五步算法具体是怎么跑的",
        "id": "section-7-五步算法具体是怎么跑的-80"
      },
      {
        "depth": 3,
        "text": "8. 用“3 个子问题、8 个意图”走一遍就明白了",
        "id": "section-8-用3-个子问题8-个意图走一遍就明白了-81"
      },
      {
        "depth": 3,
        "text": "9. 为什么总量上限默认也是 3",
        "id": "section-9-为什么总量上限默认也是-3-82"
      },
      {
        "depth": 3,
        "text": "10. 这一步和下游链路怎么衔接",
        "id": "section-10-这一步和下游链路怎么衔接-83"
      },
      {
        "depth": 3,
        "text": "11. 参数没有放之四海而皆准",
        "id": "section-11-参数没有放之四海而皆准-84"
      },
      {
        "depth": 3,
        "text": "12. 一句话总结",
        "id": "section-12-一句话总结-85"
      },
      {
        "depth": 2,
        "text": "十一、用户问退货政策，3C、家电和服装都举手了",
        "id": "section-十一用户问退货政策3c家电和服装都举手了-86"
      },
      {
        "depth": 3,
        "text": "1. 为什么做完意图识别和封顶，还会剩下一个问题",
        "id": "section-1-为什么做完意图识别和封顶还会剩下一个问题-87"
      },
      {
        "depth": 3,
        "text": "2. 歧义引导不是所有场景都会触发",
        "id": "section-2-歧义引导不是所有场景都会触发-88"
      },
      {
        "depth": 3,
        "text": "3. 为什么这个问题在电商、多系统场景特别明显",
        "id": "section-3-为什么这个问题在电商多系统场景特别明显-89"
      },
      {
        "depth": 3,
        "text": "4. 触发引导前，系统先按品类做归并",
        "id": "section-4-触发引导前系统先按品类做归并-90"
      },
      {
        "depth": 3,
        "text": "5. 为什么要停在 CATEGORY ，而不是继续往上或往下",
        "id": "section-5-为什么要停在-category-而不是继续往上或往下-91"
      },
      {
        "depth": 3,
        "text": "6. 第一层快速判断： shouldSkipGuidance",
        "id": "section-6-第一层快速判断-shouldskipguidance-92"
      },
      {
        "depth": 3,
        "text": "7. 真正的歧义判定，靠的是分数比值而不是绝对分",
        "id": "section-7-真正的歧义判定靠的是分数比值而不是绝对分-93"
      },
      {
        "depth": 3,
        "text": "8. 三区间判定：明确歧义、灰色地带、明确不歧义",
        "id": "section-8-三区间判定明确歧义灰色地带明确不歧义-94"
      },
      {
        "depth": 3,
        "text": "9. 为什么还要专门设一个灰色地带",
        "id": "section-9-为什么还要专门设一个灰色地带-95"
      },
      {
        "depth": 3,
        "text": "10. 灰色地带里的二次确认： AmbiguityLLMChecker",
        "id": "section-10-灰色地带里的二次确认-ambiguityllmchecker-96"
      },
      {
        "depth": 3,
        "text": "11. 如果 LLM 二次确认失败，系统怎么选",
        "id": "section-11-如果-llm-二次确认失败系统怎么选-97"
      },
      {
        "depth": 3,
        "text": "12. 引导结果不是布尔值，而是一个小决策对象",
        "id": "section-12-引导结果不是布尔值而是一个小决策对象-98"
      },
      {
        "depth": 3,
        "text": "13. 引导文案怎么生成",
        "id": "section-13-引导文案怎么生成-99"
      },
      {
        "depth": 3,
        "text": "14. 为什么这一步能直接短路 Pipeline",
        "id": "section-14-为什么这一步能直接短路-pipeline-100"
      },
      {
        "depth": 3,
        "text": "15. 用户选完之后，为什么下一轮通常就不会再引导",
        "id": "section-15-用户选完之后为什么下一轮通常就不会再引导-101"
      },
      {
        "depth": 3,
        "text": "16. 一句话总结",
        "id": "section-16-一句话总结-102"
      },
      {
        "depth": 2,
        "text": "十二、把前面三章和后面四段串起来看",
        "id": "section-十二把前面三章和后面四段串起来看-103"
      },
      {
        "depth": 2,
        "text": "十三、阶段五：系统直答完整链路",
        "id": "section-十三阶段五系统直答完整链路-104"
      },
      {
        "depth": 3,
        "text": "1. 先判断是不是纯系统问题",
        "id": "section-1-先判断是不是纯系统问题-105"
      },
      {
        "depth": 3,
        "text": "2. 系统模板怎么选",
        "id": "section-2-系统模板怎么选-106"
      },
      {
        "depth": 3,
        "text": "3. streamSystemResponse(...) 怎么组消息",
        "id": "section-3-streamsystemresponse-怎么组消息-107"
      },
      {
        "depth": 3,
        "text": "4. 为什么它必须短路",
        "id": "section-4-为什么它必须短路-108"
      },
      {
        "depth": 3,
        "text": "5. 一句话总结",
        "id": "section-5-一句话总结-109"
      },
      {
        "depth": 2,
        "text": "十四、阶段六：多通道检索完整链路",
        "id": "section-十四阶段六多通道检索完整链路-110"
      },
      {
        "depth": 3,
        "text": "1. 检索入口为什么只有一个",
        "id": "section-1-检索入口为什么只有一个-111"
      },
      {
        "depth": 3,
        "text": "2. RetrievalEngine 怎么拆开 KB 和 MCP",
        "id": "section-2-retrievalengine-怎么拆开-kb-和-mcp-112"
      },
      {
        "depth": 3,
        "text": "3. KB 检索为什么要分定向和全局",
        "id": "section-3-kb-检索为什么要分定向和全局-113"
      },
      {
        "depth": 3,
        "text": "4. 通道内部为什么还要再并行",
        "id": "section-4-通道内部为什么还要再并行-114"
      },
      {
        "depth": 3,
        "text": "5. 为什么 30 条结果最后只给模型 5 条",
        "id": "section-5-为什么-30-条结果最后只给模型-5-条-115"
      },
      {
        "depth": 3,
        "text": "6. MCP 检索为什么要先抽参数",
        "id": "section-6-mcp-检索为什么要先抽参数-116"
      },
      {
        "depth": 3,
        "text": "7. 知识库答不了的问题，为什么要交给 MCP",
        "id": "section-7-知识库答不了的问题为什么要交给-mcp-117"
      },
      {
        "depth": 3,
        "text": "8. 为什么最后要统一成 RetrievalContext",
        "id": "section-8-为什么最后要统一成-retrievalcontext-118"
      },
      {
        "depth": 3,
        "text": "9. 一句话总结",
        "id": "section-9-一句话总结-119"
      },
      {
        "depth": 2,
        "text": "十五、阶段七：空结果兜底完整链路",
        "id": "section-十五阶段七空结果兜底完整链路-120"
      },
      {
        "depth": 3,
        "text": "1. 什么时候会触发兜底",
        "id": "section-1-什么时候会触发兜底-121"
      },
      {
        "depth": 3,
        "text": "2. 兜底时具体做了什么",
        "id": "section-2-兜底时具体做了什么-122"
      },
      {
        "depth": 3,
        "text": "3. 为什么这里不能让模型自由发挥",
        "id": "section-3-为什么这里不能让模型自由发挥-123"
      },
      {
        "depth": 3,
        "text": "4. 一句话总结",
        "id": "section-4-一句话总结-124"
      },
      {
        "depth": 2,
        "text": "十六、阶段八：Prompt 组装与流式生成完整链路",
        "id": "section-十六阶段八prompt-组装与流式生成完整链路-125"
      },
      {
        "depth": 3,
        "text": "1. 先把意图和证据收拢成统一上下文",
        "id": "section-1-先把意图和证据收拢成统一上下文-126"
      },
      {
        "depth": 3,
        "text": "2. RAGPromptService 怎么选模板",
        "id": "section-2-ragpromptservice-怎么选模板-127"
      },
      {
        "depth": 3,
        "text": "3. buildStructuredMessages(...) 的消息顺序为什么这么定",
        "id": "section-3-buildstructuredmessages-的消息顺序为什么这么定-128"
      },
      {
        "depth": 3,
        "text": "4. 流式输出和记忆回写怎么配合",
        "id": "section-4-流式输出和记忆回写怎么配合-129"
      },
      {
        "depth": 3,
        "text": "5. promptTemplate 和 promptSnippet 不是一回事",
        "id": "section-5-prompttemplate-和-promptsnippet-不是一回事-130"
      },
      {
        "depth": 3,
        "text": "6. KB 上下文为什么放 user 而不放 system",
        "id": "section-6-kb-上下文为什么放-user-而不放-system-131"
      },
      {
        "depth": 3,
        "text": "7. Temperature 为什么分档",
        "id": "section-7-temperature-为什么分档-132"
      },
      {
        "depth": 3,
        "text": "8. 一个 MIXED 场景的拼装样例",
        "id": "section-8-一个-mixed-场景的拼装样例-133"
      },
      {
        "depth": 3,
        "text": "9. 一句话总结",
        "id": "section-9-一句话总结-134"
      },
      {
        "depth": 2,
        "text": "十七、答案是怎么一个字一个字蹦出来的：流式生成完整链路",
        "id": "section-十七答案是怎么一个字一个字蹦出来的流式生成完整链路-135"
      },
      {
        "depth": 3,
        "text": "1. 五层各自负责什么",
        "id": "section-1-五层各自负责什么-136"
      },
      {
        "depth": 3,
        "text": "2. StreamCallback 为什么只保留四个核心回调",
        "id": "section-2-streamcallback-为什么只保留四个核心回调-137"
      },
      {
        "depth": 3,
        "text": "3. 为什么要分块推送",
        "id": "section-3-为什么要分块推送-138"
      },
      {
        "depth": 3,
        "text": "4. 取消句柄为什么要后绑",
        "id": "section-4-取消句柄为什么要后绑-139"
      },
      {
        "depth": 3,
        "text": "5. 一句话总结",
        "id": "section-5-一句话总结-140"
      },
      {
        "depth": 2,
        "text": "十八、用户点了停止生成后，集群里发生了什么",
        "id": "section-十八用户点了停止生成后集群里发生了什么-141"
      },
      {
        "depth": 3,
        "text": "1. 前端只做两件事",
        "id": "section-1-前端只做两件事-142"
      },
      {
        "depth": 3,
        "text": "2. StreamTaskManager 为什么要同时用 Guava Cache 和 Redis",
        "id": "section-2-streamtaskmanager-为什么要同时用-guava-cache-和-redis-143"
      },
      {
        "depth": 3,
        "text": "3. StreamTaskInfo 的生命周期",
        "id": "section-3-streamtaskinfo-的生命周期-144"
      },
      {
        "depth": 3,
        "text": "4. 怎么真正停掉正在跑的 LLM 流",
        "id": "section-4-怎么真正停掉正在跑的-llm-流-145"
      },
      {
        "depth": 3,
        "text": "5. 一句话总结",
        "id": "section-5-一句话总结-146"
      },
      {
        "depth": 2,
        "text": "十九、10 个人同时提问，为什么只有 3 个坑位",
        "id": "section-十九10-个人同时提问为什么只有-3-个坑位-147"
      },
      {
        "depth": 3,
        "text": "1. 为什么不能简单加一个 QPS 限流",
        "id": "section-1-为什么不能简单加一个-qps-限流-148"
      },
      {
        "depth": 3,
        "text": "2. 为什么是分布式公平排队",
        "id": "section-2-为什么是分布式公平排队-149"
      },
      {
        "depth": 3,
        "text": "3. enqueue() 怎么同时入队和立即抢占",
        "id": "section-3-enqueue-怎么同时入队和立即抢占-150"
      },
      {
        "depth": 3,
        "text": "4. 为什么不能用朴素的 List + Semaphore",
        "id": "section-4-为什么不能用朴素的-list-semaphore-151"
      },
      {
        "depth": 3,
        "text": "5. 一句话总结",
        "id": "section-5-一句话总结-152"
      },
      {
        "depth": 2,
        "text": "二十、抢不到许可时，系统是等还是拒",
        "id": "section-二十抢不到许可时系统是等还是拒-153"
      },
      {
        "depth": 3,
        "text": "1. 为什么要有等待路径",
        "id": "section-1-为什么要有等待路径-154"
      },
      {
        "depth": 3,
        "text": "2. scheduleQueuePoll() 做了什么",
        "id": "section-2-schedulequeuepoll-做了什么-155"
      },
      {
        "depth": 3,
        "text": "3. 为什么需要 Pub/Sub 和轮询并存",
        "id": "section-3-为什么需要-pubsub-和轮询并存-156"
      },
      {
        "depth": 3,
        "text": "4. 成功、等待、拒绝三条路径",
        "id": "section-4-成功等待拒绝三条路径-157"
      },
      {
        "depth": 3,
        "text": "5. 一句话总结",
        "id": "section-5-一句话总结-158"
      }
    ]
  },
  {
    "slug": "全链路追踪",
    "title": "全链路追踪",
    "fileName": "全链路追踪.md",
    "category": "RAG 架构",
    "excerpt": "这部分属于增强式能力，不影响核心问答链路本身，但它决定了这条链路能不能被看见、被定位、被复盘。",
    "readTime": "4 min",
    "readingUnits": 2701,
    "sectionCount": 9,
    "headingCount": 9,
    "updatedAt": "2026-05-16T02:12:17.542Z",
    "priority": 60,
    "headings": [
      {
        "depth": 2,
        "text": "1. 它到底在追什么",
        "id": "section-1-它到底在追什么-1"
      },
      {
        "depth": 2,
        "text": "2. 这条链路里最关键的 9 个线程池",
        "id": "section-2-这条链路里最关键的-9-个线程池-2"
      },
      {
        "depth": 2,
        "text": "3. Trace 上下文怎么跨线程透传",
        "id": "section-3-trace-上下文怎么跨线程透传-3"
      },
      {
        "depth": 2,
        "text": "4. 谁创建 trace run",
        "id": "section-4-谁创建-trace-run-4"
      },
      {
        "depth": 2,
        "text": "5. @RagTraceNode 做了什么",
        "id": "section-5-ragtracenode-做了什么-5"
      },
      {
        "depth": 2,
        "text": "6. Trace 记录的生命周期",
        "id": "section-6-trace-记录的生命周期-6"
      },
      {
        "depth": 2,
        "text": "7. 后台怎么把它查出来",
        "id": "section-7-后台怎么把它查出来-7"
      },
      {
        "depth": 2,
        "text": "8. 一次请求里的 Trace 长什么样",
        "id": "section-8-一次请求里的-trace-长什么样-8"
      },
      {
        "depth": 2,
        "text": "9. 这一层最值得记住的点",
        "id": "section-9-这一层最值得记住的点-9"
      }
    ]
  },
  {
    "slug": "MySQL",
    "title": "SQL基础",
    "fileName": "MySQL.md",
    "category": "数据库",
    "excerpt": "NoSQL指非关系型数据库，主要代表是MongoDB,Redis。NoSQL数据库逻辑上提供了不同于二维表的存储方式，存储方式可以是JSON文档，哈希表或者其他方式",
    "readTime": "32 min",
    "readingUnits": 17110,
    "sectionCount": 49,
    "headingCount": 59,
    "updatedAt": "2026-05-25T13:47:20.661Z",
    "priority": 60,
    "headings": [
      {
        "depth": 2,
        "text": "NoSQL和SQL的区别",
        "id": "section-nosql和sql的区别-1"
      },
      {
        "depth": 2,
        "text": "数据库的三大范式",
        "id": "section-数据库的三大范式-2"
      },
      {
        "depth": 2,
        "text": "MySQL怎么避免重复插入数据？",
        "id": "section-mysql怎么避免重复插入数据-3"
      },
      {
        "depth": 2,
        "text": "char和varchar的区别",
        "id": "section-char和varchar的区别-4"
      },
      {
        "depth": 2,
        "text": "int（1），int（10）在mysql中有什么不同？",
        "id": "section-int1int10在mysql中有什么不同-5"
      },
      {
        "depth": 2,
        "text": "IP地址如何在数据库中存储？",
        "id": "section-ip地址如何在数据库中存储-6"
      },
      {
        "depth": 3,
        "text": "为什么不用int类型而用int unsigned类型，只是因为不会有负数吗？",
        "id": "section-为什么不用int类型而用int-unsigned类型只是因为不会有负数吗-7"
      },
      {
        "depth": 2,
        "text": "MySQL中关键字in和exists区别",
        "id": "section-mysql中关键字in和exists区别-8"
      },
      {
        "depth": 2,
        "text": "SQL查询语句的执行顺序",
        "id": "section-sql查询语句的执行顺序-9"
      },
      {
        "depth": 2,
        "text": "执行一条SQL请求的过程是什么？",
        "id": "section-执行一条sql请求的过程是什么-10"
      },
      {
        "depth": 2,
        "text": "对MySQL的引擎有什么了解？",
        "id": "section-对mysql的引擎有什么了解-11"
      },
      {
        "depth": 2,
        "text": "innoDB和MyISAM的区别",
        "id": "section-innodb和myisam的区别-12"
      },
      {
        "depth": 2,
        "text": "如果聚簇索引的数据更新，他的存储要不要变化？",
        "id": "section-如果聚簇索引的数据更新他的存储要不要变化-13"
      },
      {
        "depth": 2,
        "text": "性别字段能加索引吗？为啥？",
        "id": "section-性别字段能加索引吗为啥-14"
      },
      {
        "depth": 2,
        "text": "主键用自增ID还是UUID？为什么？",
        "id": "section-主键用自增id还是uuid为什么-15"
      },
      {
        "depth": 3,
        "text": "在B+树里面存储时有序的吗？",
        "id": "section-在b树里面存储时有序的吗-16"
      },
      {
        "depth": 2,
        "text": "MySQL中索引是怎么实现的？",
        "id": "section-mysql中索引是怎么实现的-17"
      },
      {
        "depth": 2,
        "text": "查询数据的时候，到了B+树叶子节点，之后的查询是怎么做的？",
        "id": "section-查询数据的时候到了b树叶子节点之后的查询是怎么做的-18"
      },
      {
        "depth": 2,
        "text": "B+树的特性？",
        "id": "section-b树的特性-19"
      },
      {
        "depth": 3,
        "text": "和B树的区别？",
        "id": "section-和b树的区别-20"
      },
      {
        "depth": 3,
        "text": "那MySQL为什么不用跳表？",
        "id": "section-那mysql为什么不用跳表-21"
      },
      {
        "depth": 3,
        "text": "<font style=\"background color: FBDE28;\" InnoDB的B+树特别的点</font",
        "id": "section-font-stylebackground-color-fbde28-innodb的b树特别的点font-22"
      },
      {
        "depth": 2,
        "text": "联合索引实现原理",
        "id": "section-联合索引实现原理-23"
      },
      {
        "depth": 3,
        "text": "索引下推（缩写是ICP）是什么？？？",
        "id": "section-索引下推缩写是icp是什么-24"
      },
      {
        "depth": 2,
        "text": "索引失效的六种情况",
        "id": "section-索引失效的六种情况-25"
      },
      {
        "depth": 2,
        "text": "什么是覆盖索引？",
        "id": "section-什么是覆盖索引-26"
      },
      {
        "depth": 2,
        "text": "如果一个列既有单列索引又有联合索引，走哪个？",
        "id": "section-如果一个列既有单列索引又有联合索引走哪个-27"
      },
      {
        "depth": 2,
        "text": "索引的优缺点",
        "id": "section-索引的优缺点-28"
      },
      {
        "depth": 2,
        "text": "怎么决定建哪些索引？",
        "id": "section-怎么决定建哪些索引-29"
      },
      {
        "depth": 2,
        "text": "索引的优化",
        "id": "section-索引的优化-30"
      },
      {
        "depth": 2,
        "text": "事务的特性（ACID）",
        "id": "section-事务的特性acid-31"
      },
      {
        "depth": 2,
        "text": "MySQL可能出现的和并发相关问题",
        "id": "section-mysql可能出现的和并发相关问题-32"
      },
      {
        "depth": 3,
        "text": "怎么解决？？",
        "id": "section-怎么解决-33"
      },
      {
        "depth": 3,
        "text": "可重复读下的幻读例子",
        "id": "section-可重复读下的幻读例子-34"
      },
      {
        "depth": 3,
        "text": "既然可重复读的级别下依旧会产生幻读，那又怎么解决？？",
        "id": "section-既然可重复读的级别下依旧会产生幻读那又怎么解决-35"
      },
      {
        "depth": 3,
        "text": "串行化隔离级别是通过什么实现的？",
        "id": "section-串行化隔离级别是通过什么实现的-36"
      },
      {
        "depth": 2,
        "text": "MVCC实现原理",
        "id": "section-mvcc实现原理-37"
      },
      {
        "depth": 2,
        "text": "一条update语句是不是原子性的？",
        "id": "section-一条update语句是不是原子性的-38"
      },
      {
        "depth": 2,
        "text": "一个事务中特别多sql的弊端？",
        "id": "section-一个事务中特别多sql的弊端-39"
      },
      {
        "depth": 2,
        "text": "MySQL里都有哪些锁",
        "id": "section-mysql里都有哪些锁-40"
      },
      {
        "depth": 2,
        "text": "表锁和行锁作用",
        "id": "section-表锁和行锁作用-41"
      },
      {
        "depth": 2,
        "text": "两条update语句处理一张表的不同的主键范围的记录，一个<10，一个 15，会不会遇到阻塞？ 底层是为什么？",
        "id": "section-两条update语句处理一张表的不同的主键范围的记录一个10一个-15会不会遇到阻塞-底层是为什么-42"
      },
      {
        "depth": 2,
        "text": "如果两个范围不是主键或索引，还会阻塞吗？",
        "id": "section-如果两个范围不是主键或索引还会阻塞吗-43"
      },
      {
        "depth": 2,
        "text": "加锁算法",
        "id": "section-加锁算法-44"
      },
      {
        "depth": 2,
        "text": "日志文件有哪些？",
        "id": "section-日志文件有哪些-45"
      },
      {
        "depth": 2,
        "text": "讲一下bin log？",
        "id": "section-讲一下bin-log-46"
      },
      {
        "depth": 2,
        "text": "undo log日志的作用？",
        "id": "section-undo-log日志的作用-47"
      },
      {
        "depth": 2,
        "text": "有了undolog为什么还要redolog？",
        "id": "section-有了undolog为什么还要redolog-48"
      },
      {
        "depth": 2,
        "text": "那能不能只用binlog不用redolog？",
        "id": "section-那能不能只用binlog不用redolog-49"
      },
      {
        "depth": 2,
        "text": "binlog两阶段提交过程",
        "id": "section-binlog两阶段提交过程-50"
      },
      {
        "depth": 2,
        "text": "update语句的具体执行过程",
        "id": "section-update语句的具体执行过程-51"
      },
      {
        "depth": 2,
        "text": "redolog是在内存里的吗？",
        "id": "section-redolog是在内存里的吗-52"
      },
      {
        "depth": 2,
        "text": "Mysql的两次写（double write buffer）了解吗？",
        "id": "section-mysql的两次写double-write-buffer了解吗-53"
      },
      {
        "depth": 2,
        "text": "mysql的explain有什么用？",
        "id": "section-mysql的explain有什么用-54"
      },
      {
        "depth": 2,
        "text": "给你一张表，如果查询速度很慢，有什么优化方案？",
        "id": "section-给你一张表如果查询速度很慢有什么优化方案-55"
      },
      {
        "depth": 2,
        "text": "如果explain用到的索引不正确，有什么办法可以干预吗？",
        "id": "section-如果explain用到的索引不正确有什么办法可以干预吗-56"
      },
      {
        "depth": 2,
        "text": "MySQL主从复制了解吗？",
        "id": "section-mysql主从复制了解吗-57"
      },
      {
        "depth": 2,
        "text": "主从延迟有什么处理方法？",
        "id": "section-主从延迟有什么处理方法-58"
      },
      {
        "depth": 2,
        "text": "分库和分表是什么，有什么区别?",
        "id": "section-分库和分表是什么有什么区别-59"
      }
    ]
  },
  {
    "slug": "README",
    "title": "Notes",
    "fileName": "README.md",
    "category": "指南",
    "excerpt": "",
    "readTime": "3 min",
    "readingUnits": 14,
    "sectionCount": 0,
    "headingCount": 0,
    "updatedAt": "2026-05-20T13:19:51.159Z",
    "priority": 20,
    "headings": []
  }
];

export default articleManifest;
