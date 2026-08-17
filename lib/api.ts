export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    return `http://${hostname}:8000`;
  }
  return "http://localhost:8000";
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
