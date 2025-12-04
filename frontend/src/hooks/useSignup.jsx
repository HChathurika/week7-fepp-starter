import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      window.dispatchEvent(new Event("userUpdated"));

      setIsLoading(false);
      return true;
    } catch (err) {
      setError("Network error");
      setIsLoading(false);
      return false;
    }
  };

  return { signup, isLoading, error };
}
