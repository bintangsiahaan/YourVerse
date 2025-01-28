import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addIcon from "../assets/add.svg"; // Ikon Add
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import deleteIcon from "../assets/delete.svg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: "", description: "", image: null });
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
const [photoToDelete, setPhotoToDelete] = useState(null);

  // Fetch photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/photos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchPhotos();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle Add Photo button click
  const handleAddPhoto = () => {
    setShowAddModal(true);
  };

  // Handle Add Photo save
  const handleSavePhoto = async () => {
    const formData = new FormData();
    formData.append("title", newPhoto.title);
    formData.append("description", newPhoto.description);
    formData.append("image", newPhoto.image);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/photos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const savedPhoto = await response.json();
        setPhotos([...photos, savedPhoto]);
        setShowAddModal(false);
        setNewPhoto({ title: "", description: "", image: null });
      } else {
        console.error("Error saving photo:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setPhotos(photos.filter((photo) => photo._id !== photoId)); // Update daftar foto
        toast.success('Photo deleted successfully!', {
          position: "top-right", // Ganti dengan string langsung
        });
      } else {
        toast.error(`Failed to delete photo: ${response.statusText}`, {
          position: "top-right", // Ganti dengan string langsung
        });
      }
    } catch (error) {
      toast.error('Error deleting photo. Please try again!', {
        position: "top-right", // Ganti dengan string langsung
      });
      console.error('Error deleting photo:', error);
    }
  };
  
  
  
  

  // Fungsi logout
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
        <h1 className="text-4xl font-bold">Your Photos</h1>
        <p className="text-lg text-gray-300">Manage and view your photo gallery</p>
      </div>
      {showConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96 text-white">
      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
      <p className="text-gray-300 mb-4">
        Are you sure you want to delete this photo?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowConfirm(false)} // Tutup modal
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleDeletePhoto(photoToDelete); // Hapus foto
            setShowConfirm(false); // Tutup modal setelah konfirmasi
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      {/* Photo Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div
              key={photo._id}
              className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg relative"
            >
              <img
                src={`http://localhost:5000/uploads/images/${photo.filePath}`}
                alt={photo.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-white font-bold">{photo.title}</h3>
              <p className="text-gray-400 text-sm">{photo.description}</p>
          
              {/* Menu icon */}
              <div className="absolute top-2 right-2">
                <img
                  src={deleteIcon}
                  alt="Menu"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setPhotoToDelete(photo._id); // Set photo ID yang akan dihapus
                    setShowConfirm(true); // Tampilkan modal konfirmasi
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300 col-span-full">
            No photos uploaded yet.
          </p>
        )}
      </div>

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-2xl font-bold mb-4">Add Photo</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPhoto.title}
              onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={newPhoto.description}
              onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            ></textarea>
            <input
              type="file"
              onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })}
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
                onClick={handleSavePhoto}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Button */}
      <button
        onClick={handleAddPhoto}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
      >
        <img src={addIcon} alt="Add Photo" className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Photos;
