import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import "./calendar.css";
import addIcon from "../assets/add.svg";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import profileIcon from "../assets/profile.svg";
import logoutIcon from "../assets/logout.svg";
import menuIcon from "../assets/menu.svg";
import homeIcon from "../assets/home.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    isImportant: false,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchEvents();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const savedEvent = await response.json();
        setEvents([...events, savedEvent]);
        setShowAddModal(false);
        setNewEvent({ title: "", description: "", date: "", time: "", isImportant: false });
        toast.success("Event added successfully!");
      } else {
        toast.error("Failed to add event. Please try again.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEditEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/events/${currentEvent._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEvent),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map((event) => (event._id === updatedEvent._id ? updatedEvent : event)));
        setShowEditModal(false);
        toast.success("Event updated successfully!");
      } else {
        toast.error("Failed to update event. Please try again.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/events/${eventToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventToDelete._id));
        toast.success("Event deleted successfully!");
      } else {
        toast.error("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
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
        <h1 className="text-4xl font-bold">Your Events</h1>
        <p className="text-lg text-gray-300">Manage your events and schedules</p>
      </div>

      {/* Calendar Component */}
      <div className="pb-10 flex justify-center">
      <CalendarComponent
  onChange={(date) => {
    setSelectedDate(date);
    setNewEvent({ 
      ...newEvent, 
      date: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0] 
    });
  }}
  value={selectedDate}
  tileClassName={({ date }) => {
    const isEventDate = events.some(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
    return isEventDate ? "bg-blue-800 text-white" : "";
  }}
  className="rounded-lg shadow-lg"
/>

      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
      <p className="text-white mb-4">Are you sure you want to delete this event?</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteEvent}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* Event List */}
      <div className="grid grid-cols-1 gap-6 px-6 max-w-4xl mx-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-white font-bold">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.description}</p>
                <p className="text-gray-400 text-sm">
                  {event.date} - {event.time}
                </p>
              </div>
              <div className="flex space-x-4">
                <img
                  src={editIcon}
                  alt="Edit"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setCurrentEvent(event);
                    setShowEditModal(true);
                  }}
                />
               <img
  src={deleteIcon}
  alt="Delete"
  className="w-6 h-6 cursor-pointer"
  onClick={() => {
    setShowDeleteModal(true);
    setEventToDelete(event);
  }}
/>


              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300">No events found.</p>
        )}
      </div>

      {/* Add Event Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
      >
        <img src={addIcon} alt="Add Event" className="w-8 h-8" />
      </button>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Event</h2>
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            ></textarea>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
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
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            <input
              type="text"
              placeholder="Title"
              value={currentEvent.title}
              onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            ></textarea>
            <input
              type="date"
              value={currentEvent.date}
              onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <input
              type="time"
              value={currentEvent.time}
              onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
              className="w-full p-2 border border-gray-500 bg-blue-800 text-white rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
