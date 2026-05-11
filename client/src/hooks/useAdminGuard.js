import { useMemo } from "react";

export default function useAdminGuard() {
  return useMemo(() => {
    try {
      const token = localStorage.getItem("socratia_token");
      if (!token) return false;

      const raw = localStorage.getItem("socratia_user");
      const user = raw ? JSON.parse(raw) : null;

      return user?.role === "admin";
    } catch {
      return false;
    }
  }, []);
}
