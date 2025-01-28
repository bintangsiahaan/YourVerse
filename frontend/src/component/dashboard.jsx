import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import astronautGif from "../assets/astronaut.gif";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ambil data user dari localStorage saat komponen pertama kali di-render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = "/login"; // Redirect ke login jika tidak ada data user
    }
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    localStorage.removeItem("user"); // Hapus data user
    window.location.href = "/login"; // Redirect ke halaman login
  };

  if (!user) return null; // Tampilkan kosong jika data user belum ada

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white">
  {/* Navbar */}
  <nav
className="fixed top-4 left-1/2 transform -translate-x-1/2 px-8 py-4 flex justify-between items-center w-[95%] max-w-[1400px] z-50 shadow-lg rounded-full"  style={{
    background: "rgba(19, 34, 68, 0.6)", // Transparansi warna biru gelap
    backdropFilter: "blur(10px)", // Blur elemen di belakang
    border: "1px solid rgba(255, 255, 255, 0.2)", // Batas luar transparan
  }}
>
  {/* Logo Section */}
  <div className="flex items-center space-x-2">
    <img src={homeIcon} alt="Home" className="w-6 h-6" />
    <h1 className="font-serif text-2xl text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text tracking-wide drop-shadow-md">
  YourVerse
</h1>

  </div>

  {/* Navigation Icons */}
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

  {/* Welcome Section */}
<div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] px-6 pt-20 md:pt-32">
  {/* Left Section: Welcome Text */}
  {/* Left Section: Welcome Text */}
  <div className="md:w-1/2 text-center md:text-left px-6 md:pl-12 pt-6">
  <h2 className="text-6xl font-semibold mb-2">Welcome back,</h2>
  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent drop-shadow-lg mb-4 leading-relaxed">
    {user?.username || "User"}
  </h1>
  <p className="text-xl mb-4">Glad to see you again!</p>
  <p className="text-lg mb-6">
    Let’s explore the amazing features we have prepared for you.
  </p>
  <a
    href="#cards"
    className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white py-2 px-6 rounded-md text-sm font-semibold"
    style={{ minWidth: "150px" }}
  >
    <span>Tap to explore</span>
    <span className="ml-2 text-xl">&rarr;</span>
  </a>
</div>


  {/* Right Section: GIF */}
  <div className="md:w-1/2 flex justify-center">
    <img src={astronautGif} alt="Astronaut" className="w-3/4 h-auto bg-transparent" />
  </div>
</div>


 {/* Cards Section */}
 <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mt-12 p-6">
        {/* Card 1 */}
        <div
          className="bg-gradient-to-r from-blue-800 to-blue-600 p-10 rounded-xl shadow-xl cursor-pointer"
          onClick={() => navigate("/photos")} // Navigasi ke halaman Photos
        >
          <h3 className="text-2xl font-bold text-white mb-4">Photos</h3>
          <p className="text-gray-200 text-lg">Manage and organize your photos effortlessly.</p>
        </div>

        {/* Card 2 */}
<div
  className="bg-gradient-to-r from-green-800 to-green-600 p-10 rounded-xl shadow-xl cursor-pointer"
  onClick={() => navigate("/music")} // Navigasi ke halaman Music
>
  <h3 className="text-2xl font-bold text-white mb-4">Music</h3>
  <p className="text-gray-200 text-lg">Discover and enjoy your favorite tunes.</p>
</div>


       {/* Card 3 */}
<div
  className="bg-gradient-to-r from-purple-800 to-purple-600 p-10 rounded-xl shadow-xl cursor-pointer"
  onClick={() => navigate("/calendar")} // Navigasi ke halaman Calendar
>
  <h3 className="text-2xl font-bold text-white mb-4">Calendar</h3>
  <p className="text-gray-200 text-lg">Stay on top of your schedule and tasks.</p>
</div>


<div
  className="bg-gradient-to-r from-yellow-800 to-yellow-600 p-10 rounded-xl shadow-xl cursor-pointer"
  onClick={() => navigate("/quote")} // Navigasi ke halaman Quote
>
  <h3 className="text-2xl font-bold text-white mb-4">Quote</h3>
  <p className="text-gray-200 text-lg">Get inspired with daily quotes.</p>
</div>

{/* Card Mood */}
<div
  className="bg-gradient-to-r from-pink-800 to-pink-600 p-10 rounded-xl shadow-xl cursor-pointer"
  onClick={() => navigate("/mood")} // Navigasi ke halaman Mood
>
  <h3 className="text-2xl font-bold text-white mb-4">Mood</h3>
  <p className="text-gray-200 text-lg">Track and log your daily moods easily.</p>
</div>
      </div>

</div>


  );
};

export default Dashboard;
