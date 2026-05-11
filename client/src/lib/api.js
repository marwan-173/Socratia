const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("socratia_token");

  console.log("TOKEN SENT:", token);
  console.log("AUTH HEADER:", token ? `Bearer ${token}` : "NO TOKEN");

  const res = await fetch(API_BASE + path, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}
