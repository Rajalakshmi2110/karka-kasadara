import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import "../styles/App.css";
import "../styles/Sidebar.css";

export default function Sidebar({ user, guest }) {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = async () => {
    if (guest) {
      navigate("/login"); 
    } else {
      await auth.signOut();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            ☰
          </Link>
        </li>
        <li>
          <Link to="/chatpage" className={isActive("/chatpage") ? "active" : ""}>
            ✉
          </Link>
        </li>
        <li>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            👤
          </Link>
        </li>
        {!guest && (
          <li>
            <Link to="/files" className={isActive("/files") ? "active" : ""}>
              🗁
            </Link>
          </li>
        )}
        {!guest && (
          <li>
            <Link to="/schedule" className={isActive("/schedule") ? "active" : ""}>
              🗓
            </Link>
          </li>
        )}
        <li>
          <Link to="/clock" className={isActive("/clock") ? "active" : ""}>
            ⏲
          </Link>
        </li>
        <li>
          <Link to="/streakpage" className={isActive("/streakpage") ? "active" : ""}>
            🐦‍🔥
          </Link>
        </li>
        <li>
          <Link to="/Goal" className={isActive("/Goal") ? "active" : ""}>
            🎯
          </Link>
        </li>
        <li>
          <Link to="/settings" className={isActive("/settings") ? "active" : ""}>
            ⚙︎
          </Link>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        {guest ? "Exit Guest Mode" : "Logout"}
      </button>
    </nav>
  );
}
