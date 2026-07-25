import React from "react";
import "../CSS/ProfilePreview.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext';
import axios from "axios";

const ProfilePreview = ({ user, onClose }) => {
    const { user: currentUser, setUser } = useAuth();
    const navigate = useNavigate();

    const isConnected =
        currentUser?.Connections?.some(
            id => id.toString() === user._id.toString()
        ) ?? false;

    const requestSent = currentUser?.SentRequests?.some(
        id => id.toString() === user._id.toString()
    ) ?? false;

    const requestReceived = currentUser?.ReceivedRequests?.some(
        id => id.toString() === user._id.toString()
    ) ?? false;

    const requestRejected = currentUser?.RejectedRequests?.some(
        id => id.toString() === user._id.toString()
    ) ?? false;

    const isOwnProfile = currentUser?._id.toString() === user._id.toString();

    const sendRequest = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/connection/request/${user._id}`,
                {
                    senderId: currentUser._id
                }
            );
            const response = await axios.get(
                `http://localhost:5000/api/user/${currentUser._id}`
            );

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            alert("Connection request sent!");

        } catch (err) {
            console.log(err);
        }
    };

    const acceptRequest = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/connection/accept/${user._id}`,
                {
                    receiverId: currentUser._id
                }
            );

            alert("Connection accepted!");

            const response = await axios.get(
                `http://localhost:5000/api/user/${currentUser._id}`
            );

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

        } catch (err) {
            console.log(err);
        }
        onClose();
    };

    const rejectRequest = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/connection/reject/${user._id}`,
                {
                    receiverId: currentUser._id
                }
            );

            alert("Connection rejected!");

            // update auth user state (VERY IMPORTANT)
            const response = await axios.get(
                `http://localhost:5000/api/user/${currentUser._id}`
            );

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

        } catch (err) {
            console.log(err);
        }
        onClose();
    };
    console.log("isConnected:", isConnected);
    console.log("requestReceived:", requestReceived);
    console.log("Connections:", currentUser?.Connections);
    console.log("ReceivedRequests:", currentUser?.ReceivedRequests);
    return (
        <div className="preview-overlay">

            <div className="preview-container">

                <button
                    className="preview-close"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="preview-image">
                    <img
                        src={user.Image
                            ? `http://localhost:5000${user.Image}`
                            : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"}
                        alt={user.Name}
                    />
                </div>

                <div className="preview-content">

                    <h2>{user.Name}</h2>

                    <p className="preview-role">
                        {user.Role}
                    </p>

                    <p className="preview-location">
                        <i className="fa-solid fa-location-dot"></i>
                        {user.Location}
                    </p>

                    <p className="preview-bio">
                        {user.Bio}
                    </p>

                    <div className="preview-skills">

                        {user.Skills.map((skill, index) => (
                            <span key={index}>{skill}</span>
                        ))}

                    </div>

                    <div className="preview-actions">

                        {!currentUser && (
                            <button
                                className="connect-btn"
                                onClick={() => navigate("/login")}
                            >
                                Connect
                            </button>
                        )}

                        {currentUser && isConnected && (
                            <button className="connect-btn">
                                Connected ✓
                            </button>
                        )}

                        {currentUser && requestSent && (
                            <button className="connect-btn">
                                Request Sent
                            </button>
                        )}

                        {currentUser && requestReceived && (
                            <>
                                <button className="connect-btn" onClick={acceptRequest}>
                                    Accept
                                </button>

                                <button className="connect-btn" onClick={rejectRequest}>
                                    Reject
                                </button>
                            </>
                        )}

                        {currentUser &&
                            !isOwnProfile &&
                            !isConnected &&
                            !requestSent &&
                            !requestReceived &&
                            (
                                <button
                                    className="connect-btn"
                                    onClick={sendRequest}
                                >
                                    Connect
                                </button>
                            )}

                    </div>

                    {/* <button
                        className="show-more-btn"
                        onClick={() => navigate(currentUser ? `/profile/${user._id}` : '/login')}
                    >
                        Show Full Profile
                        <i className="fa-solid fa-arrow-right"></i>
                    </button> */}
                </div>

            </div>

        </div>
    );
};

export default ProfilePreview;