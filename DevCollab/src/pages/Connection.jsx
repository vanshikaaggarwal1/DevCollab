import React, { useState, useEffect } from "react";
import "../CSS/Connections.css";
import DashboardNav from "./DashboardNav";
import axios from "axios";
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";
import ProfilePreview from "../components/ProfilePreview";

const Connections = () => {
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    const [connections, setconnections] = useState([]);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(
                `http://localhost:5000/api/connection/connections/${currentUser._id}`
            );

            if (res.data.statuscode === 1) {
                setconnections(res.data.connections);
            }

        } catch (err) {
            console.log(err);
        }
    };
    const handleViewProfile = async (userId) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/user/${userId}`
            );

            setSelectedUser(res.data.user);
        } catch (err) {
            console.log(err);
        }
    };
    const filtered = connections.filter(user =>
        user.Name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            <DashboardNav />
            <div className="connections-page">

                <div className="connections-header">

                    <div>
                        <h1>Connections</h1>
                        <p>Connect and collaborate with developers.</p>
                    </div>

                    <button className="add-connection-btn" onClick={() => navigate("/dashboard")}>
                        + Add Connection
                    </button>

                </div>

                <div className="connection-search">

                    <input
                        type="text"
                        placeholder="Search connections..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>
                <div className="connections-layout">
                    <div className="connections-grid">

                        {filtered.map(user => (

                            <div className="connection-card" key={user._id}>

                                <div className="connection-top">

                                    <div className="avatar">
                                        {user.Name.charAt(0)}
                                    </div>
                                    {/* <span className={user.online ? "online" : "offline"}>
                                    {user.online ? "Online" : "Offline"}
                                </span> */}

                                    <div className="connection-info">
                                        <h3>{user.Name}</h3>

                                        <h5>{user.Role}</h5>
                                    </div>
                                </div>
                                {/* <p>{user.Company}</p>

                            <div className="skills">
                                {user.Skills?.join(", ")}
                            </div> */}

                                <div className="connection-buttons">

                                    {/* <button className="message-btn">
                                    Collaborate
                                </button> */}

                                    <button
                                        className="profile-btn"
                                        onClick={() => handleViewProfile(user._id)}
                                    >
                                        View Profile
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                    {selectedUser && (
                        <div className="profile-sidebar">
                            <ProfilePreview
                                user={selectedUser}
                                onClose={() => setSelectedUser(null)}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Connections;