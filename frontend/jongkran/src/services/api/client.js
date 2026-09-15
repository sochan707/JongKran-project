import {
  clearSession,
  getSession,
  updateSessionTokens,
} from "../session";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

let refreshRequest = null;

const refreshAccessToken = async (session) => {
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }).then(async (response) => ({
      ok: response.ok,
      payload: await response.json().catch(() => ({})),
    }));
  }

  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const { retryAfterRefresh = true, ...fetchOptions } = options;
  const session = getSession();
  const headers = new Headers(fetchOptions.headers || {});

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (
    response.status === 401 &&
    retryAfterRefresh &&
    path !== "/auth/refresh" &&
    session?.refreshToken
  ) {
    const refreshResult = await refreshAccessToken(session);
    const refreshPayload = refreshResult.payload;

    if (refreshResult.ok && refreshPayload.data?.accessToken) {
      updateSessionTokens(session, refreshPayload.data);
      return apiRequest(path, { ...fetchOptions, retryAfterRefresh: false });
    }

    clearSession();
  }

  if (!response.ok) {
    throw new Error(payload.message || "The server could not complete the request.");
  }

  return payload;
};
