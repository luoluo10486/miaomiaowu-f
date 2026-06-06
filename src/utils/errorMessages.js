const EXACT_MESSAGES = new Map(
  Object.entries({
    "account or password is invalid": "账号或密码错误",
    "bad request": "请求参数有误",
    "emailcode is invalid or expired": "邮箱验证码无效或已过期",
    "failed to fetch": "网络请求失败，请检查后端服务是否已启动",
    forbidden: "没有权限访问该资源",
    "internal server error": "服务器内部错误",
    "login success": "登录成功",
    "networkerror when attempting to fetch resource": "网络请求失败，请检查网络或后端服务",
    "not found": "资源不存在",
    "register success": "注册成功",
    "request aborted": "请求已取消",
    "request timeout": "请求超时",
    "service unavailable": "服务暂不可用",
    "send code success": "验证码发送成功",
    "smscode is invalid or expired": "短信验证码无效或已过期",
    unauthorized: "未登录或登录已过期",
    "knowledge base still has documents": "该知识库下仍有文档，请先删除文档后再删除知识库",
    "logout success": "退出登录成功",
    "fetch failed": "网络请求失败，请检查后端服务是否可访问"
  })
);

const FIELD_LABELS = new Map(
  Object.entries({
    account: "账号",
    captcha: "验证码",
    code: "验证码",
    conversation: "会话",
    email: "邮箱",
    emailcode: "邮箱验证码",
    file: "文件",
    message: "消息",
    password: "密码",
    request: "请求",
    response: "响应",
    session: "会话",
    smscode: "短信验证码",
    task: "任务",
    token: "令牌",
    trace: "追踪",
    user: "用户",
    verifycode: "验证码"
  })
);

function toText(message) {
  if (typeof message === "string") {
    return message.trim();
  }

  if (message && typeof message === "object" && typeof message.message === "string") {
    return message.message.trim();
  }

  return "";
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function translateField(field) {
  const normalized = String(field || "").trim().toLowerCase();
  return FIELD_LABELS.get(normalized) || String(field || "").trim();
}

function translatePhrase(text) {
  const normalized = String(text || "").trim();
  if (!normalized) {
    return "";
  }

  const lower = normalized.toLowerCase();
  const direct = {
    create: "创建",
    delete: "删除",
    failed: "失败",
    load: "加载",
    login: "登录",
    register: "注册",
    request: "请求",
    save: "保存",
    search: "搜索",
    send: "发送",
    stop: "停止",
    update: "更新"
  };

  return direct[lower] || normalized;
}

export function translateUserMessage(message, fallback = "请求失败，请稍后重试") {
  const raw = toText(message);
  if (!raw) {
    return fallback;
  }

  if (hasChinese(raw)) {
    return raw;
  }

  const lower = raw.toLowerCase();
  if (EXACT_MESSAGES.has(lower)) {
    return EXACT_MESSAGES.get(lower);
  }

  if (/^typeerror:\s*fetch failed$/i.test(raw) || /failed to fetch/i.test(raw)) {
    return "网络请求失败，请检查后端服务是否启动";
  }

  if (/^aborterror$/i.test(raw) || /aborted/i.test(lower)) {
    return "请求已取消";
  }

  const invalidOrExpired = raw.match(/^([a-z][a-z0-9_]*) is invalid or expired$/i);
  if (invalidOrExpired) {
    return `${translateField(invalidOrExpired[1])}无效或已过期`;
  }

  const invalid = raw.match(/^([a-z][a-z0-9_]*) is invalid$/i);
  if (invalid) {
    return `${translateField(invalid[1])}无效`;
  }

  const missing = raw.match(/^([a-z][a-z0-9_]*) is missing$/i);
  if (missing) {
    return `${translateField(missing[1])}缺失`;
  }

  const succeeded = raw.match(/^([a-z][a-z0-9_ ]*?) success$/i);
  if (succeeded) {
    return `${translatePhrase(succeeded[1])}成功`;
  }

  const failed = raw.match(/^([a-z][a-z0-9_ ]*?) failed(?:[:：]\s*(.+))?$/i);
  if (failed) {
    const detail = failed[2] ? `：${translateUserMessage(failed[2], failed[2])}` : "";
    return `${translatePhrase(failed[1])}失败${detail}`;
  }

  if (/^unauthorized$/i.test(raw)) {
    return "未登录或登录已过期";
  }

  if (/^forbidden$/i.test(raw)) {
    return "没有权限访问该资源";
  }

  if (/^bad request$/i.test(raw)) {
    return "请求参数有误";
  }

  if (/^not found$/i.test(raw)) {
    return "资源不存在";
  }

  if (/^internal server error$/i.test(raw)) {
    return "服务器内部错误";
  }

  if (/^service unavailable$/i.test(raw)) {
    return "服务暂不可用";
  }

  if (/^gateway timeout$/i.test(raw)) {
    return "网关超时";
  }

  if (/^request timeout$/i.test(raw)) {
    return "请求超时";
  }

  if (/^[a-z0-9\s,._:-]+$/i.test(raw)) {
    return fallback;
  }

  return raw;
}
