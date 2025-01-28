import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addIcon from "../assets/add.svg"; // Ikon Add
import deleteIcon from "../assets/delete.svg";
import { toast } from 'react-toastify';
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import 'react-toastify/dist/ReactToastify.css';

const Music = () => {
  const [musicList, setMusicList] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMusic, setNewMusic] = useState({ title: "", artist: "", album: "", audio: null });
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [musicToDelete, setMusicToDelete] = useState(null);
// Tambahkan state untuk menyimpan musik yang sedang diputar
const [currentPlaying, setCurrentPlaying] = useState(null); // Musik yang sedang diputar
  // Fetch music list
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/music", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMusicList(data);
      } catch (error) {
        console.error("Error fetching music:", error);
      }
    };


    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchMusic();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle Add Music button click
  const handleAddMusic = () => {
    setShowAddModal(true);
  };

  // Fungsi untuk memutar musik ketika card di klik
const handlePlayMusic = (music) => {
    setCurrentPlaying(music);
  };

  // Handle Add Music save
  const handleSaveMusic = async () => {
    const formData = new FormData();
    formData.append("title", newMusic.title);
    formData.append("artist", newMusic.artist);
    formData.append("album", newMusic.album);
    formData.append("audio", newMusic.audio);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/music", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const savedMusic = await response.json();
        setMusicList([...musicList, savedMusic]);
        setShowAddModal(false);
        setNewMusic({ title: "", artist: "", album: "", audio: null });
        toast.success("Music added successfully!");
      } else {
        console.error("Error saving music:", response.statusText);
        toast.error("Failed to add music. Please try again.");
      }
    } catch (error) {
      console.error("Error saving music:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle Delete Music
  const handleDeleteMusic = async (musicId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/music/${musicId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMusicList(musicList.filter((music) => music._id !== musicId));
        toast.success("Music deleted successfully!");
      } else {
        toast.error("Failed to delete music. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting music:", error);
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
        <h1 className="text-4xl font-bold">Your Music</h1>
        <p className="text-lg text-gray-300">Manage and enjoy your music library</p>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this music?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteMusic(musicToDelete);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music List */}
      <div className="flex flex-col px-6 max-w-6xl mx-auto space-y-4">
      {musicList.length > 0 ? (
  musicList.map((music) => (
    <div
      key={music._id}
      className={`flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg cursor-pointer ${
        currentPlaying && currentPlaying._id === music._id ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <div onClick={() => handlePlayMusic(music)}>
        <h3 className="text-white font-bold">{music.title}</h3>
        <p className="text-gray-400 text-sm">{music.artist} - {music.album}</p>
      </div>
      <div className="flex items-center space-x-4">
        {currentPlaying && currentPlaying._id === music._id && (
          <audio controls autoPlay className="ml-4">
            <source
              src={`http://localhost:5000/uploads/music/${music.filePath}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        )}
       <button
  onClick={() => {
    setMusicToDelete(music._id);
    setShowConfirm(true);
  }}
>
  <img src={deleteIcon} alt="Delete" className="w-6 h-6 cursor-pointer" />
</button>

      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-300">No music uploaded yet.</p>
)}
</div>


      {/* Add Music Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-2xl font-bold mb-4">Add Music</h2>
            <input
              type="text"
              placeholder="Title"
              value={newMusic.title}
              onChange={(e) => setNewMusic({ ...newMusic, title: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="text"
              placeholder="Artist"
              value={newMusic.artist}
              onChange={(e) => setNewMusic({ ...newMusic, artist: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="text"
              placeholder="Album"
              value={newMusic.album}
              onChange={(e) => setNewMusic({ ...newMusic, album: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="file"
              onChange={(e) => setNewMusic({ ...newMusic, audio: e.target.files[0] })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMusic}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Music Button */}
      <button
        onClick={handleAddMusic}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
      >
        <img src={addIcon} alt="Add Music" className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Music;
