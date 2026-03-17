import axios from "axios";

// Axios instance configured for FastAPI backend
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) => api.post("/api/auth/login", { email, password }),
  register: (data: any) => api.post("/api/auth/register", data),
  getProfile: () => api.get("/api/auth/profile"),
};

// Complaint endpoints
export const complaintAPI = {
  submit: (data: FormData) => api.post("/api/complaints", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll: (params?: any) => api.get("/api/complaints", { params }),
  getMine: () => api.get("/api/complaints/mine"),
  getById: (id: string) => api.get(`/api/complaints/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/api/admin/complaints/${id}/status`, { status }),
};

// Analytics endpoints
export const analyticsAPI = {
  getStats: () => api.get("/api/admin/dashboard"),
  getByCategory: () => api.get("/api/analytics/by-category"),
  getMonthly: () => api.get("/api/analytics/monthly"),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get("/api/admin/users"),
};

// Chatbot endpoints
export const chatAPI = {
  sendMessage: (data: { messages: { role: string; content: string }[] }) => 
    api.post("/api/chat/message", data),
};

export default api;
