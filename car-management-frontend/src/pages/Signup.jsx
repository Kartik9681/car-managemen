// src/pages/Signup.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({}); // Add state for validation errors

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({}); // Clear previous errors

    try {
      const response = await axios.post("https://car-management-ltbh.onrender.com/api/auth/signup", formData);
      localStorage.setItem("authToken", response.data.token); // Save JWT token
      localStorage.setItem("userID", response.data.user.id)

      navigate("/dashboard"); // Redirect to dashboard after successful signup
    } catch (err) {
        console.log(err.response.data.errors)
      if (err.response) {
        if (err.response.data.errors) {
          // If backend validation errors are present
          const errors = err.response.data.errors
          alert(errors)
          setValidationErrors(errors);
        } else {
          setError(err.response.data.msg); // General error message (like User already exists)
        }
      } else {
        setError("Something went wrong"); // In case of network errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
          {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
          {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
          {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account? <a href="/login" className="text-blue-500">Log In</a>
      </p>
    </div>
  );
}

export default Signup;
