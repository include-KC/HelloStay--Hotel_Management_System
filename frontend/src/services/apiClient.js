const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = "ApiError";
    this.status = options.status || null;
    this.data = options.data || null;
    this.isNetworkError = options.isNetworkError || false;
    this.cause = options.cause || null;
  }
}

function buildUrl(endpoint) {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${normalizedBaseUrl}${normalizedEndpoint}`;
}

function getAuthToken() {
  // Future milestone:
  // Later, when real authentication is implemented,
  // this function can read the saved access token.
  //
  // For Milestone 5, we intentionally return null.
  return null;
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
}

function getErrorMessage(response, data) {
  if (data?.detail) {
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((error) => error.msg || "Validation error")
        .join(", ");
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }
  }

  if (data?.message) {
    return data.message;
  }

  return `Request failed with status ${response.status}`;
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    ...customOptions
  } = options;

  const token = getAuthToken();

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
    ...customOptions,
  };

  if (body !== undefined) {
    fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(buildUrl(endpoint), fetchOptions);
  } catch (error) {
    throw new ApiError(
      "Cannot connect to HelloStay backend. Please make sure the backend server is running.",
      {
        isNetworkError: true,
        cause: error,
      }
    );
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response, data), {
      status: response.status,
      data,
    });
  }

  return data;
}

export const apiClient = {
  get(endpoint, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  delete(endpoint, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};