import { useEffect } from "react";

export default function useAuthGuard({ location, navigate }) {
  useEffect(() => {
    const token = localStorage.getItem("socratia_token");
    if (!token) return;

    const protectedPaths = ["/workspace", "/session", "/compare"];
    const isProtected = protectedPaths.some((p) =>
      location.pathname.startsWith(p)
    );
    if (!isProtected) return;

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          localStorage.removeItem("socratia_token");
          localStorage.removeItem("socratia_user");
          navigate("/signin", { replace: true });
          return;
        }

        localStorage.setItem(
          "socratia_user",
          JSON.stringify({
            email: data?.user?.email,
            role: data?.user?.role,
            sub: data?.user?.sub,
          })
        );
      } catch {
        // backend down → ignore
      }
    })();
  }, [location.pathname, navigate]);
}
