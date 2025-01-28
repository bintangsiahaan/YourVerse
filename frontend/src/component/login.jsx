import React, { useState } from "react"; // Tambahkan useState
import axios from "axios";
import loginGif from "../assets/login.gif"; // Import GIF file
import galaxyGif from "../assets/galaxy.gif"; // Import Galaxy GIF

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // Untuk pesan respon
  const [error, setError] = useState(""); // Untuk pesan error

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Fungsi untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = response.data;

      // Simpan token dan data user di localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect ke dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setError(error.response?.data?.error || "Login failed"); // Tampilkan pesan error
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${galaxyGif})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl w-full bg-[#1A1A2E]/80 shadow-lg rounded-xl flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex-1 p-8 bg-[#16213E]/80 rounded-xl">
          <h2 className="text-white text-xl font-bold text-center mb-6">Nice to see you!</h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            Enter your email and password to sign in
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email..."
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password..."
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-gray-400 text-sm">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              SIGN IN
            </button>
          </form>

          {/* Success Message */}
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <p className="text-center text-gray-400 text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center">
          <img src={loginGif} alt="Login GIF" className="w-full h-auto rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Login;
