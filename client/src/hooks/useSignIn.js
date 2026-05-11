import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function useSignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { identifier: email, password },
      });

      // persist auth
      localStorage.setItem("socratia_token", data.token);
      localStorage.setItem("socratia_user", JSON.stringify(data.user));

      navigate("/workspace");
    } catch (err) {
      setError(err?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    submit,
    error,
    loading,
  };
}
