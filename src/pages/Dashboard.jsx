import React, { useState, useEffect } from "react";
import "../CSS/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const Dashboard = () => {

    const [stats, setStats] = useState({
        projects: 0,
        connections: 0,
        messages: 0,
        notifications: 0
    });
    const [projects, setProjects] = useState([]);
    const [connections, setConnections] = useState([]);
    const [developers, setDevelopers] = useState([]);

    const [showDevelopersPanel, setShowDevelopersPanel] = useState(false);
    const [developerSearch, setDeveloperSearch] = useState("");

    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            fetchProjects();
            fetchConnections();
            fetchSuggestedDevelopers();
            fetchNotifications();
        }
    }, [user]);


    const showToast = (msg, type = 'info') => {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : type === 'error' ? 'circle-xmark' : 'circle-info'}"></i><span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    const fetchProjects = async () => {
        const res = await axios.get(
            `http://localhost:5000/api/projects/${user._id}`
        );

        setProjects(res.data.projects);

        setStats(prev => ({
            ...prev,
            projects: res.data.projects.length
        }));
    };

    const fetchConnections = async () => {
        const res = await axios.get(
            `http://localhost:5000/api/connection/connections/${user._id}`
        );

        setConnections(res.data.connections);

        setStats(prev => ({
            ...prev,
            connections: res.data.connections.length
        }));
    };

    const fetchSuggestedDevelopers = async () => {
        const res = await axios.get(
            "http://localhost:5000/api/user/all"
        );

        setDevelopers(res.data.users);
    };
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/notification/${user._id}`
            );

            setStats(prev => ({
                ...prev,
                notifications: res.data.notifications.length
            }));
        } catch (err) {
            console.log(err);
        }
    };
    const isConnected = (dev) =>
        user?.Connections?.some(id => id.toString() === dev._id.toString());

    const requestSent = (dev) =>
        user?.SentRequests?.some(id => id.toString() === dev._id.toString());

    const requestReceived = (dev) =>
        user?.ReceivedRequests?.some(id => id.toString() === dev._id.toString());

    const filteredDevelopers = developers.filter(dev =>
        dev._id !== user._id &&
        !user.Connections?.some(
            id => id.toString() === dev._id.toString()
        ) &&
        dev.Name.toLowerCase().includes(
            developerSearch.toLowerCase()
        )
    );

    const sendRequest = async (developerId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/connection/request/${developerId}`,
                {
                    senderId: user._id
                }
            );

            const response = await axios.get(
                `http://localhost:5000/api/user/${user._id}`
            );

            setUser(response.data.user);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            showToast("Connection request sent!", "success");

        } catch (err) {
            console.log(err);
            showToast("Something went wrong!", "error");
        }
    };
    const totalDevelopers = developers.filter(
        dev =>
            dev._id !== user._id &&
            !user.Connections?.includes(dev._id)
    ).length;

    return (
        <>
            <div className="dashboard-layout">
                <DashboardNav />
                <div className="dashboard-main">
                    {/* Header */}
                    <header className="dashboard-header">
                        <div className="header-welcome">
                            <div className="header-badge">
                                <span className="glow-dot"></span>
                                Dashboard
                            </div>
                            <h1>Hello, {user?.Name?.split(' ')[0] || 'Developer'} !</h1>
                            <p>Here's what's happening in your network today.</p>
                        </div>
                        <div className="header-right">
                            <div className="header-search-wrapper">
                                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Search projects, developers..."
                                    className="dashboard-search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="header-new-project-btn" onClick={() => navigate('/create-project')}>
                                <i className="fa-solid fa-plus"></i> New Project
                            </button>
                        </div>
                    </header>

                    {/* Stats */}
                    <section className="stats-section">
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <h3>Projects</h3>
                                <div className="stat-icon proj"><i className="fa-solid fa-briefcase"></i></div>
                            </div>
                            <h2>{stats.projects}</h2>
                            <span className="stat-desc">4 active this week</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <h3>Connections</h3>
                                <div className="stat-icon conn"><i className="fa-solid fa-user-group"></i></div>
                            </div>
                            <h2>{stats.connections}</h2>
                            <span className="stat-desc">+8 new connections</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <h3>Messages</h3>
                                <div className="stat-icon msg"><i className="fa-regular fa-comment-dots"></i></div>
                            </div>
                            <h2>{stats.messages}</h2>
                            <span className="stat-desc">2 unread conversations</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <h3>Notifications</h3>
                                <div className="stat-icon notif"><i className="fa-regular fa-bell"></i></div>
                            </div>
                            <h2>{stats.notifications}</h2>
                            <span className="stat-desc">3 mentions to review</span>
                        </div>
                    </section>

                    {/* Splits */}
                    <div className="dashboard-splits">
                        {/* Recent Projects */}
                        <section className="recent-projects-card">
                            <div className="section-header">
                                <h2>Recent Projects</h2>
                                <button className="btn-text" onClick={() => navigate('/project')}>
                                    View all <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>

                            {
                                projects
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 2)
                                    .map((project) => (
                                        <div
                                            className="project-row"
                                            key={project._id}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="project-info">
                                                <h3>{project.title}</h3>

                                                <span className="project-category">
                                                    {project.techStack?.join(", ")}
                                                </span>
                                            </div>
                                            <button className="work-space-btn" onClick={() => navigate(`/workspace/${project._id}`)}>Open Workspace</button>
                                        </div>
                                    ))
                            }
                        </section>

                        {/* Suggested Developers */}
                        <section className="suggested-devs-card">
                            <div className="section-header">
                                <h2>Explore Developers</h2>
                                <button
                                    className="btn-text"
                                    onClick={() => setShowDevelopersPanel(true)}
                                >
                                    View All <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>

                            {developers
                                .filter(dev => dev._id !== user._id)
                                .slice(0, 2)
                                .map((dev) => (
                                    <div className="developer-row" key={dev._id}>
                                        <div className="developer-profile">
                                            <div className="dev-avatar-small">
                                                {dev.Name?.charAt(0)}
                                            </div>

                                            <div className="dev-details">
                                                <h3>{dev.Name}</h3>
                                                <p>{dev.Role || "Developer"}</p>
                                            </div>
                                        </div>

                                        {isConnected(dev) ? (
                                            <button className="btn-connect-sm" disabled>
                                                Connected ✓
                                            </button>
                                        ) : requestSent(dev) ? (
                                            <button className="btn-connect-sm" disabled>
                                                Request Sent
                                            </button>
                                        ) : requestReceived(dev) ? (
                                            <button
                                                className="btn-connect-sm"
                                                onClick={() => navigate("/notification")}
                                            >
                                                Accept Request
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-connect-sm"
                                                onClick={() => sendRequest(dev._id)}
                                            >
                                                <i className="fa-solid fa-user-plus"></i> Connect
                                            </button>
                                        )}
                                    </div>
                                ))}
                        </section>
                    </div>
                </div>

            </div>
            {showDevelopersPanel && (
                <>
                    <div
                        className="drawer-backdrop"
                        onClick={() => setShowDevelopersPanel(false)}
                    />

                    <div className="developers-drawer">

                        <div className="drawer-header">
                            <div className="developer-search-title">
                                <h2>All Developers</h2>
                                <p> ({totalDevelopers})</p>
                            </div>
                            <button
                                onClick={() => setShowDevelopersPanel(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="drawer-search">
                            <i className="fa-solid fa-magnifying-glass"></i>

                            <input
                                type="text"
                                placeholder="Search developers..."
                                value={developerSearch}
                                onChange={(e) => setDeveloperSearch(e.target.value)}
                            />
                        </div>

                        <div className="drawer-list">

                            {filteredDevelopers.map(dev => (

                                <div className="drawer-developer" key={dev._id}>

                                    <div className="developer-profile">
                                        <div className="dev-avatar-small">
                                            {dev.Name?.charAt(0)}
                                        </div>

                                        <div className="dev-details">
                                            <h3>{dev.Name}</h3>
                                            <p>{dev.Role || "Developer"}</p>
                                        </div>
                                    </div>

                                    {isConnected(dev) ? (
                                        <button className="btn-connect-sm" disabled>
                                            Connected ✓
                                        </button>
                                    ) : requestSent(dev) ? (
                                        <button className="btn-connect-sm" disabled>
                                            Request Sent
                                        </button>
                                    ) : requestReceived(dev) ? (
                                        <button
                                            className="btn-connect-sm"
                                            onClick={() => navigate("/notification")}
                                        >
                                            Accept Request
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-connect-sm"
                                            onClick={() => sendRequest(dev._id)}
                                        >
                                            <i className="fa-solid fa-user-plus"></i> Connect
                                        </button>
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>
                </>
            )}
        </>
    );
};

export default Dashboard;