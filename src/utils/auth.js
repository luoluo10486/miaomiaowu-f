export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";
const AUTH_PROFILE_ENDPOINTS = [
  "/luoluo/member/profile/me",
  "/api/ragent/user/me"
];

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocalStorage(key) {
  if (!isBrowser()) {
    return "";
  }

  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeLocalStorage(key, value) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function removeLocalStorage(key) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

async function parseResponsePayload(response) {
  const raw = await response.text();
  const normalized = raw.trim();

  if (!normalized) {
    return {};
  }

  if (normalized.startsWith("{") || normalized.startsWith("[")) {
    try {
      return JSON.parse(normalized);
    } catch {
      return { message: raw };
    }
  }

  return { message: raw };
}

export function normalizeAuthToken(token, tokenType = "Bearer") {
  const rawToken = typeof token === "string" ? token.trim() : "";
  if (!rawToken) {
    return "";
  }

  if (/^[A-Za-z]+\s+.+$/.test(rawToken)) {
    return rawToken;
  }

  const normalizedType = typeof tokenType === "string" ? tokenType.trim() : "";
  if (!normalizedType) {
    return rawToken;
  }

  return `${normalizedType} ${rawToken}`;
}

export function getStoredAuthToken() {
  const current = readLocalStorage(AUTH_TOKEN_KEY);
  if (!current) {
    return "";
  }

  const normalized = normalizeAuthToken(current);
  if (normalized && normalized !== current) {
    writeLocalStorage(AUTH_TOKEN_KEY, normalized);
  }

  return normalized;
}

export function getStoredAuthUser() {
  const raw = readLocalStorage(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeAuthUser(parsed);
    if (normalized) {
      writeLocalStorage(AUTH_USER_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return null;
  }
}

export function normalizeAuthUser(source) {
  const userSource = source?.user && typeof source.user === "object" ? source.user : source;
  if (!userSource || typeof userSource !== "object") {
    return null;
  }

  const userKeys = ["userId", "id", "memberId", "username", "displayName", "email", "phone", "role", "userType", "avatar"];
  const hasUserField = userKeys.some((key) => userSource[key] !== undefined && userSource[key] !== null && userSource[key] !== "");
  if (!hasUserField) {
    return null;
  }

  return {
    ...userSource,
    role: userSource.role ?? userSource.userType ?? ""
  };
}

export function saveStoredAuthUser(user) {
  const normalized = normalizeAuthUser(user);
  if (!normalized) {
    return null;
  }

  writeLocalStorage(AUTH_USER_KEY, JSON.stringify(normalized));
  return normalized;
}

function mergeAuthUsers(currentUser, nextUser) {
  return normalizeAuthUser({
    ...(currentUser || {}),
    ...(nextUser || {}),
    role:
      nextUser?.role ??
      currentUser?.role ??
      nextUser?.userType ??
      currentUser?.userType ??
      ""
  });
}

export function isAdminUser(user) {
  return String(user?.role || user?.userType || "").trim().toLowerCase() === "admin";
}

export async function refreshStoredAuthUser() {
  const token = getStoredAuthToken();
  if (!token || !isBrowser()) {
    return getStoredAuthUser();
  }

  const currentUser = getStoredAuthUser();

  for (const endpoint of AUTH_PROFILE_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token
        },
        credentials: "include"
      });

      if (!response.ok) {
        continue;
      }

      const payload = await parseResponsePayload(response);
      const source =
        payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
      const mergedUser = mergeAuthUsers(currentUser, source);

      if (mergedUser) {
        saveStoredAuthUser(mergedUser);
        return mergedUser;
      }
    } catch {
      continue;
    }
  }

  return currentUser;
}

export function saveAuthSession(payload) {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const token = normalizeAuthToken(source?.token, source?.tokenType || "Bearer");
  const user = normalizeAuthUser(source);

  if (token) {
    writeLocalStorage(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    saveStoredAuthUser(user);
  }

  return token;
}

export function clearStoredAuth() {
  removeLocalStorage(AUTH_TOKEN_KEY);
  removeLocalStorage(AUTH_USER_KEY);
}
