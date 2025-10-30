const DEFAULT_BASE_URL = "https://agri-link-project-10.onrender.com";

const buildUrl = (pathOrUrl) => {
  if (!pathOrUrl) {
    throw new Error("fetchJson requires a path or URL");
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_BASE_URL;
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

const prepareOptions = (options = {}) => {
  const init = { credentials: "include", ...options };

  const headers = {
    Accept: "application/json",
    ...(init.headers || {}),
  };

  if (init.body && !(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    if (headers["Content-Type"].includes("application/json")) {
      init.body = JSON.stringify(init.body);
    }
  }

  if (init.body instanceof FormData && headers["Content-Type"]) {
    delete headers["Content-Type"];
  }

  init.headers = headers;
  return init;
};

export async function fetchJson(pathOrUrl, options) {
  const response = await fetch(buildUrl(pathOrUrl), prepareOptions(options));

  const contentType = response.headers.get("content-type") || "";
  const parseBody = async () => {
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    return text ? { message: text } : null;
  };

  const payload = await parseBody();

  if (!response.ok) {
    const errorMessage = payload?.error || payload?.message || payload?.details || response.statusText;
    const error = new Error(errorMessage || "Request failed");
    error.status = response.status;
    error.body = payload;
    throw error;
  }

  return payload;
}

export const api = {
  fetchJson,
};

