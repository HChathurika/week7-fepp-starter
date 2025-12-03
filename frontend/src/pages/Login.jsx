import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");
  const { login, isLoading, error } = useLogin("/api/users/login");
  const [formError, setFormError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const normalizedEmail = email.value.toLowerCase().trim();

    const success = await login({
      email: normalizedEmail,
      password: password.value,
    });

    if (success) {
      // Token and user info already stored by the hook
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate("/"); // Redirect home after successful login
    } else {
      setFormError(error || "Login failed. Try again.");
    }
  };

  return (
    <div className="login" style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Log In</h2>
      <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>Email address:</label>
        <input {...email} required />

        <label>Password:</label>
        <input {...password} required />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ff4081",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        {(formError || error) && <p style={{ color: "red" }}>{formError || error}</p>}
      </form>
    </div>
  );
};

export default Login;
