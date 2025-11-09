import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_CLIENT, // np. http://localhost:5000
  headers: {
    "Content-Type": "application/json",
  },
});

// // 🔒 Przykładowo — interceptor autoryzacji (na przyszłość)
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;