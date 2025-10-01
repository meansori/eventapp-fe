import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaUserCheck,
  FaFileImport,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <Link to="/dashboard" className="mb-4 text-center text-white text-decoration-none">
        <h2>Eventify</h2>
      </Link>

      {currentUser && (
        <div className="d-flex align-items-center mb-4 p-3 bg-white bg-opacity-10 rounded">
          <FaUser className="me-2" />
          <span>{currentUser.username}</span>
        </div>
      )}

      <div className="nav flex-column">
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
          <FaHome className="me-2" /> Dashboard
        </Link>
        <Link to="/events" className={`nav-link ${isActive("/events") ? "active" : ""}`}>
          <FaCalendarAlt className="me-2" /> Master Event
        </Link>
        <Link to="/participants" className={`nav-link ${isActive("/participants") ? "active" : ""}`}>
          <FaUsers className="me-2" /> Master Peserta
        </Link>
        <Link to="/attendance" className={`nav-link ${isActive("/attendance") ? "active" : ""}`}>
          <FaUserCheck className="me-2" /> Absensi
        </Link>
      </div>

      <button className="nav-link mt-auto" onClick={logout}>
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
}
