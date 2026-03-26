const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");
  const skipAuth = options.skipAuth || false;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && !skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status}`;
    let errorData = null;

    try {
      errorData = await response.json();
      errorMessage =
        errorData.detail ||
        errorData.message ||
        errorData.error ||
        JSON.stringify(errorData) ||
        errorMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        // niente
      }
    }

    // Include response status and data for detailed error handling in components
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}