import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Signup failed");
        setIsLoading(false);
        return false; // indicate failure
      }

      // Save entire response to localStorage, not just data.user
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      return true; // indicate success
    } catch (err) {
      setError("Network error");
      setIsLoading(false);
      return false;
    }
  };

  return { signup, isLoading, error };
}
