import React, { useState } from "react";
import "../CSS/Dashboard.css";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const DashboardNav = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { user: currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')

  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  return (
    <>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-brand">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fa-solid ${collapsed ? "fa-bars" : "fa-xmark"}`}></i>
          </button>
          <NavLink to="/" className="sidebar-logo">
            <i className="fa-solid fa-code"></i>
            {!collapsed &&
              <span>DevCollab</span>
            }
          </NavLink>
        </div>

        <ul className="sidebar-menu">
          <li ><NavLink to="/dashboard" style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "inherit",
            width: "100%"
          }}>
            <i className="fa-solid fa-house"></i>
            <span> {!collapsed && <span>Dashboard</span>}</span></NavLink>
          </li>

          <li ><NavLink to="/personalprofile" style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "inherit",
            width: "100%"
          }}  >
            <i className="fa-regular fa-user"></i>
            <span> {!collapsed && <span>Profile</span>}</span></NavLink>
          </li>

          <li>
            <NavLink to="/project" style={{
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "inherit",
              width: "100%"
            }}>
              <i className="fa-solid fa-briefcase"></i>
              <span> {!collapsed && <span>Projects</span>}</span></NavLink>
          </li>
          <li><NavLink to="/connection" style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "inherit",
            width: "100%"
          }}>
            <i className="fa-solid fa-user-group"></i>
            <span> {!collapsed && <span>Connections</span>}</span></NavLink>
          </li>
          <li><NavLink to="/collaboration" style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "inherit",
            width: "100%"
          }}>
            <i className="fa-solid fa-handshake"></i>
            <span> {!collapsed && <span>Collaboration</span>}</span></NavLink>
          </li>
          {/* <li>
            <i className="fa-regular fa-comment-dots"></i>
            <span>Messages</span>
          </li> */}
          <li><NavLink to="/notification" style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "inherit",
            width: "100%"
          }}>
            <i className="fa-regular fa-bell"></i>
            <span> {!collapsed && <span>Notifications</span>}</span></NavLink>
          </li>

          <li className="menu-logout">
            <NavLink
              to="/"
              onClick={handleLogout}
              style={{
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "inherit",
                width: "100%"
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default DashboardNav;