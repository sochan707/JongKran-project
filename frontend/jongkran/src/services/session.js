const SESSION_KEY = "authSession";

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getSession()?.accessToken);

export const updateSessionTokens = (session, tokens) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || session.refreshToken,
    }),
  );
};

export const saveSession = (data) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }),
  );
  localStorage.setItem("isLoggedIn", "true");
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change"));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change"));
};
