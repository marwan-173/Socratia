import { useState } from "react";
import { apiFetch } from "../lib/api";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function register(form) {
    setError(null);

    if (Object.values(form).some((v) => !v)) {
      throw new Error("Please fill in all fields.");
    }

    if (form.password !== form.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    try {
      setLoading(true);
      await apiFetch("/auth/register", {
        method: "POST",
        body: form,
      });
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error };
}
