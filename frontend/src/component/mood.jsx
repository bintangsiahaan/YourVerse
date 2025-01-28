import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import addIcon from "../assets/add.svg";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Mood = () => {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState({ mood: "", description: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [moodToDelete, setMoodToDelete] = useState(null);
  const [moodToEdit, setMoodToEdit] = useState(null);
  const navigate = useNavigate();

  // Fetch moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/moods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMoods(data);
      } catch (error) {
        console.error("Error fetching moods:", error);
      }
    };

    fetchMoods();
  }, []);

  const handleAddMood = async () => {
    if (!newMood.mood || !newMood.description) {
      toast.error("Mood and description cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/moods", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMood),
      });

      if (response.ok) {
        const savedMood = await response.json();
        setMoods([savedMood, ...moods]);
        setNewMood({ mood: "", description: "" });
        setShowAddModal(false);
        toast.success("Mood added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast.error("Failed to add mood. Please try again.");
      }
    } catch (error) {
      console.error("Error adding mood:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEditMood = async () => {
    if (!moodToEdit.mood || !moodToEdit.description) {
      toast.error("Mood and description cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/moods/${moodToEdit._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moodToEdit),
      });

      if (response.ok) {
        const updatedMood = await response.json();
        setMoods(moods.map((mood) => (mood._id === updatedMood._id ? updatedMood : mood)));
        setShowEditModal(false);
        setMoodToEdit(null);
        toast.success("Mood updated successfully!");
      } else {
        toast.error("Failed to update mood. Please try again.");
      }
    } catch (error) {
      console.error("Error updating mood:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeleteMood = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/moods/${moodToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMoods(moods.filter((mood) => mood._id !== moodToDelete._id));
        setShowDeleteModal(false);
        setMoodToDelete(null);
        toast.success("Mood deleted successfully!");
      } else {
        toast.error("Failed to delete mood. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting mood:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
  src={profileIcon}
  alt="Profile"
  className="w-6 h-6 cursor-pointer"
  title="View Profile"
  onClick={() => navigate("/userProfile")} // Navigasi ke halaman userProfile
/>

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

      {/* Header */}
      <div className="pt-28 pb-10 text-center">
        <h1 className="text-4xl font-bold">Your Mood Tracker</h1>
        <p className="text-lg text-gray-300">Log and track your daily moods</p>
      </div>

      {/* Add Mood Button */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setShowAddModal(true)}
      >
        <img src={addIcon} alt="Add Mood" className="w-8 h-8" />
      </button>

      {/* Add Mood Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Mood</h2>
            <input
              type="text"
              placeholder="Mood"
              value={newMood.mood}
              onChange={(e) => setNewMood({ ...newMood, mood: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={newMood.description}
              onChange={(e) => setNewMood({ ...newMood, description: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMood}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood List */}
      <div className="mt-10 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Mood History</h2>
        {moods.length > 0 ? (
          moods.map((mood) => (
            <div
              key={mood._id}
              className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{mood.mood}</h3>
                <p className="text-gray-300">{mood.description}</p>
                <p className="text-gray-500 text-sm">{new Date(mood.date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4">
                <img
                  src={editIcon}
                  alt="Edit Mood"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setMoodToEdit(mood);
                    setShowEditModal(true);
                  }}
                />
                <img
                  src={deleteIcon}
                  alt="Delete Mood"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setMoodToDelete(mood);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No moods logged yet.</p>
        )}
      </div>

      {/* Edit Mood Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Mood</h2>
            <input
              type="text"
              placeholder="Mood"
              value={moodToEdit.mood}
              onChange={(e) => setMoodToEdit({ ...moodToEdit, mood: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={moodToEdit.description}
              onChange={(e) => setMoodToEdit({ ...moodToEdit, description: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMood}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Mood Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-white mb-6">Are you sure you want to delete this mood?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMood}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mood;
