import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(""); // "username" or "password"
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let body = {};

      if (editType === "username") {
        endpoint = "/api/users/update-username";
        body = { username: newUsername };
      } else if (editType === "password") {
        endpoint = "/api/users/update-password";
        body = { oldPassword, newPassword };
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowEditModal(false);
        setEditType("");
        setNewUsername("");
        setOldPassword("");
        setNewPassword("");
        alert("Update successful!");
      } else {
        const error = await response.json();
        alert(error.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Navbar */}
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 px-8 py-4 flex justify-between items-center w-[95%] max-w-[1400px] z-50 shadow-lg rounded-full"
        style={{
          background: "rgba(19, 34, 68, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="flex items-center space-x-2">
          <img
            src={homeIcon}
            alt="Home"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <h1 className="font-serif text-2xl text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text tracking-wide drop-shadow-md">
  YourVerse
</h1>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={logoutIcon}
            alt="Logout"
            className="w-6 h-6 cursor-pointer"
            title="Logout"
            onClick={handleLogout}
          />
          <img
            src={menuIcon}
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            title="Menu"
            onClick={() => alert("Menu clicked!")}
          />
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <img
          src={profileIcon}
          alt="Profile Icon"
          className="w-24 h-24 mb-6 bg-blue-800 p-4 rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
        <p className="text-xl text-gray-300 mb-6">{user.email}</p>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 shadow-lg mb-4"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            {!editType ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => setEditType("username")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit Username
                  </button>
                  <button
                    onClick={() => setEditType("password")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit Password
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : editType === "username" ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Username</h2>
                <input
                  type="text"
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setEditType("")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Password</h2>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setEditType("")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
