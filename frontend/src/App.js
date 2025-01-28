import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import Photos from "./component/photos";
import Music from "./component/music";
import Calendar from "./component/calendar";
import Quote from "./component/quote";
import Mood from "./component/mood";
import UserProfile from "./component/userProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/music" element={<Music />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/userProfile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
