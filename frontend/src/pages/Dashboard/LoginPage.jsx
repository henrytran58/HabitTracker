import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate(); // ✅ React Router v6 hook

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); //. Show success message

  const toggleForm = () => {
    setError("");
    setSuccess("");
    setIsSignup(!isSignup);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "http://127.0.0.1:5000/api/register"
      : "http://127.0.0.1:5000/api/login";

    const payload = isSignup
      ? {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          name: formData.name,
        }
      : {
          username: formData.username,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const user = data.user;

      if (isSignup) {
        // ✅ After successful registration
        setSuccess("Account created! Please log in.");
        setIsSignup(false); // switch to login form
        setError("");
        return;
      }

      // ✅ After successful login
      localStorage.setItem("userID", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);

      if (onLoginSuccess) {
        onLoginSuccess(user.id);
      }

      navigate("/habits"); // ✅ Go to HabitPage
    } catch (err) {
      setSuccess("");
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">StreakFlow</h1>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border p-2 rounded-md"
              />
            </>
          )}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-purple-600 underline ml-1"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}