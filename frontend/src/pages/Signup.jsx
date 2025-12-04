import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const phone_number = useField("text");
  const gender = useField("text");

  const street = useField("text");
  const city = useField("text");
  const zipCode = useField("text");

  const { signup, isLoading, error } = useSignup("/api/users/signup");
  const [formError, setFormError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const payload = {
      name: name.value.trim(),
      email: email.value.toLowerCase().trim(),
      password: password.value,
      phone_number: phone_number.value.trim(),
      gender: gender.value.trim(),
      address: {
        street: street.value.trim(),
        city: city.value.trim(),
        zipCode: zipCode.value.trim(),
      },
    };

    const success = await signup(payload);

    if (success) {
      setIsAuthenticated(true);
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

        <label>Email:</label>
        <input {...email} required />

        <label>Password:</label>
        <input {...password} required />

        <label>Phone Number:</label>
        <input {...phone_number} required />

        <label>Gender:</label>
        <input {...gender} required />

        <label>Street:</label>
        <input {...street} required />

        <label>City:</label>
        <input {...city} required />

        <label>ZIP Code:</label>
        <input {...zipCode} required />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ff4081",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
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
