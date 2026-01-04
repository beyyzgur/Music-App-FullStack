import { createContext, useContext, useState } from "react";
import { bindToast } from "../lib/api";

type Toast = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

type ToastContextType = {
  showToast: (type: Toast["type"], message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(type: Toast["type"], message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  bindToast(showToast);
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 text-sm shadow ${
              t.type === "success"
                ? "border-green-700 bg-green-900/80 text-green-200"
                : t.type === "error"
                ? "border-red-700 bg-red-900/80 text-red-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-200"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
