import React, { useEffect, useState } from "react";
import "../CSS/UserProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNav from "./DashboardNav";
import { useAuth } from "../Context/AuthContext";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [user, setUser] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [connectSent, setConnectSent] = useState(false);

    useEffect(() => {
        getUser();
    }, [id]);

    const getUser = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/${id}`
            );

            if (response.data.statuscode === 1) {
                setUser(response.data.user);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleConnect = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        setConnecting(true);
        try {
            await axios.post(`http://localhost:5000/api/connection/request/${id}`, {
                senderId: currentUser._id,
            });
            setConnectSent(true);
        } catch (err) {
            console.log(err);
        } finally {
            setConnecting(false);
        }
    };

    if (!user) {
        return (
            <div className="dashboard-layout">
                <DashboardNav />
                <div className="loading" style={{ padding: "40px", textAlign: "center" }}>
                    <i className="fa-solid fa-spinner fa-spin" /> Loading user profile...
                </div>
            </div>
        );
    }

    const isSelf = currentUser?._id === user._id;
    const isAlreadyConnected = currentUser?.Connections?.some(
        (cId) => (cId._id || cId).toString() === user._id.toString()
    );

    return (
        <div className="dashboard-layout">
            <DashboardNav />
            <div className="userprofile-page">
                {/* Cover */}
                <div
                    className="userprofile-cover"
                    style={{
                        backgroundImage: user.CoverImage
                            ? `url(${user.CoverImage.startsWith("http") ? user.CoverImage : `http://localhost:5000${user.CoverImage}`})`
                            : "none"
                    }}
                ></div>

                {/* Profile Header */}
                <div className="userprofile-header">
                    <img
                        src={user.Image
                            ? (user.Image.startsWith("http") ? user.Image : `http://localhost:5000${user.Image}`)
                            : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"}
                        alt={user.Name}
                        className="userprofile-picture"
                    />

                    <div className="userprofile-details">
                        <h1>{user.Name}</h1>
                        <h3>{user.Headline || user.Role || "Software Developer"}</h3>
                        <p>
                            <i className="fa-solid fa-location-dot"></i>{" "}
                            {user.Location || "Not specified"}
                        </p>
                    </div>

                    <div className="userprofile-buttons">
                        {!isSelf && (
                            <>
                                <button
                                    className="userconnect-btn"
                                    onClick={handleConnect}
                                    disabled={isAlreadyConnected || connectSent || connecting}
                                >
                                    <i className="fa-solid fa-user-plus" />{" "}
                                    {isAlreadyConnected ? "Connected" : connectSent ? "Request Sent" : connecting ? "..." : "Connect"}
                                </button>
                                <button
                                    className="usermessage-btn"
                                    onClick={() => navigate(`/connection`)}
                                >
                                    <i className="fa-solid fa-comment" /> Message
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* About */}
                <section className="userprofile-section">
                    <h2>About</h2>
                    <p>{user.Bio || "No bio added yet."}</p>
                </section>

                {/* Skills */}
                <section className="userprofile-section">
                    <h2>Skills</h2>
                    <div className="userskills-wrapper">
                        {user.Skills && user.Skills.length > 0 ? (
                            user.Skills.map((skill, index) => (
                                <span key={index}>{skill}</span>
                            ))
                        ) : (
                            <p>No skills specified.</p>
                        )}
                    </div>
                </section>

                {/* Contact & Links */}
                <section className="userprofile-section">
                    <h2>Contact & Links</h2>
                    <div className="userprofile-links">
                        {user.Github && (
                            <a href={user.Github.startsWith("http") ? user.Github : `https://${user.Github}`} target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-github"></i> GitHub
                            </a>
                        )}
                        {user.Linkedin && (
                            <a href={user.Linkedin.startsWith("http") ? user.Linkedin : `https://${user.Linkedin}`} target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-linkedin"></i> LinkedIn
                            </a>
                        )}
                        {user.Portfolio && (
                            <a href={user.Portfolio.startsWith("http") ? user.Portfolio : `https://${user.Portfolio}`} target="_blank" rel="noreferrer">
                                <i className="fa-solid fa-globe"></i> Portfolio
                            </a>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfile;