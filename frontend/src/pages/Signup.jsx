import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const membershipStatus = useField("text");

  const { signup, isLoading, error } = useSignup("/api/users/signup");
  const [formError, setFormError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const normalizedEmail = email.value.toLowerCase().trim();

    const payload = {
      name: name.value.trim(),
      email: normalizedEmail,
      password: password.value,
      phone_number: phoneNumber.value.trim(),
      gender: gender.value.trim(),
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value.trim(),
    };

    const success = await signup(payload);

    if (success) {
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate("/");
    } else {
      setFormError(error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="create" style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleFormSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label>Name:</label>
        <input {...name} required />

        <label>Email address:</label>
        <input {...email} required />

        <label>Password:</label>
        <input {...password} required />

        <label>Phone Number:</label>
        <input {...phoneNumber} required />

        <label>Gender:</label>
        <input {...gender} required />

        <label>Date of Birth:</label>
        <input {...dateOfBirth} required />

        <label>Membership Status:</label>
        <input {...membershipStatus} required />

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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {(formError || error) && (
          <p style={{ color: "red" }}>{formError || error}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;
