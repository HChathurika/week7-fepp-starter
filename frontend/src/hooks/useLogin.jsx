import { useState } from "react";

export default function useLogin(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("userUpdated"));
      setIsLoading(false);
      return data; // return the data object with token and email
    } catch (err) {
      setError("Network error");
      setIsLoading(false);
      return false;
    }
  };

  return { login, isLoading, error };
}
