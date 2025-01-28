import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addIcon from "../assets/add.svg"; // Ikon Add
import deleteIcon from "../assets/delete.svg";
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Quote = () => {
  const [quotes, setQuotes] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: "", author: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch quotes and daily quote
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const quotesResponse = await fetch("http://localhost:5000/api/quotes");
        const quotesData = await quotesResponse.json();
        setQuotes(quotesData);

        const dailyResponse = await fetch(
          "http://localhost:5000/api/quotes/daily"
        );
        const dailyData = await dailyResponse.json();
        setDailyQuote(dailyData);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  // Handle Add Quote
  const handleAddQuote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      });

      if (response.ok) {
        const savedQuote = await response.json();
        setQuotes([...quotes, savedQuote]);
        setShowAddModal(false);
        setNewQuote({ text: "", author: "" });
        toast.success("Quote added successfully!");
      } else {
        toast.error("Failed to add quote.");
      }
    } catch (error) {
      console.error("Error adding quote:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle Delete Quote
  const handleDeleteQuote = async (quoteId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quotes/${quoteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setQuotes(quotes.filter((quote) => quote._id !== quoteId));
        toast.success("Quote deleted successfully!");
      } else {
        toast.error("Failed to delete quote.");
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
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
        <h1 className="text-4xl font-bold">Quotes</h1>
        <p className="text-lg text-gray-300">Get inspired with daily quotes</p>
      </div>

      {/* Daily Quote */}
      {dailyQuote && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Quote of the Day</h2>
          <p className="text-xl italic">"{dailyQuote.text}"</p>
          <p className="text-gray-400 mt-2">- {dailyQuote.author}</p>
        </div>
      )}

      {/* Quote List */}
      <div className="max-w-6xl mx-auto px-6 space-y-4">
        {quotes.map((quote) => (
          <div
            key={quote._id}
            className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg flex justify-between items-center"
          >
            <div>
              <p className="text-xl italic">"{quote.text}"</p>
              <p className="text-gray-400">- {quote.author}</p>
            </div>
            <img
              src={deleteIcon}
              alt="Delete"
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                setQuoteToDelete(quote._id);
                setShowConfirm(true);
              }}
            />
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this quote?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteQuote(quoteToDelete);
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

      {/* Add Quote Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-2xl font-bold mb-4">Add Quote</h2>
            <input
              type="text"
              placeholder="Quote Text"
              value={newQuote.text}
              onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="text"
              placeholder="Author"
              value={newQuote.author}
              onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuote}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Quote Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
      >
        <img src={addIcon} alt="Add Quote" className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Quote;
