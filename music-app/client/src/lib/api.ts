import axios from "axios";

type ToastFn = (type: "success" | "error" | "info", message: string) => void;

let toastFn: ToastFn | null = null;

// ToastProvider'dan bağlamak için
export function bindToast(fn: ToastFn) {
  toastFn = fn;
}

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Request: token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Unexpected error occurred";

    if (toastFn) {
      toastFn("error", Array.isArray(message) ? message.join(", ") : message);
    }

    return Promise.reject(err);
  }
);
