import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUsers, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  return (
    <div className="bottom-nav">
      <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
        <FaHome size={20} />
        <div className="small">Dashboard</div>
      </Link>
      <Link to="/events" className={`nav-link ${isActive("/events") ? "active" : ""}`}>
        <FaCalendarAlt size={20} />
        <div className="small">Event</div>
      </Link>
      <Link to="/participants" className={`nav-link ${isActive("/participants") ? "active" : ""}`}>
        <FaUsers size={20} />
        <div className="small">Peserta</div>
      </Link>
      <Link to="/attendance" className={`nav-link ${isActive("/attendance") ? "active" : ""}`}>
        <FaUserCheck size={20} />
        <div className="small">Absensi</div>
      </Link>
      <button className="nav-link" onClick={handleLogout}>
        <FaSignOutAlt size={20} />
        <div className="small">Logout</div>
      </button>
    </div>
  );
}
