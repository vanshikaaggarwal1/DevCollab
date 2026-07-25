import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "../CSS/Notification.css";
import DashboardNav from "./DashboardNav";
import { useNavigate } from "react-router-dom";

const Notification = () => {

    const { user, setUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?._id) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {

            const response = await axios.get(
                `http://localhost:5000/api/notification/${user._id}`
            );

            if (response.data.statuscode === 1) {
                setNotifications(response.data.notifications);
            }

        } catch (err) {
            console.log(err);
        }
    };
    const markAllRead = async () => {

        try {

            await axios.put(
                `http://localhost:5000/api/notification/read-all/${user._id}`
            );

            fetchNotifications();

        } catch (err) {
            console.log(err);
        }

    };

    const openNotification = async (item) => {
        try {

            if (!item.isRead) {
                await axios.put(
                    `http://localhost:5000/api/notification/read/${item._id}`
                );
            }

            if (item.link) {
                navigate(item.link);
            }

        } catch (err) {
            console.log(err);
        }
    };
    const acceptRequest = async (notification) => {
        try {

            await axios.put(
                `http://localhost:5000/api/connection/accept/${notification.sender._id}`,
                {
                    receiverId: user._id
                }
            );

            const response = await axios.get(
                `http://localhost:5000/api/user/${user._id}`
            );

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            await axios.delete(
                `http://localhost:5000/api/notification/${notification._id}`
            );

            fetchNotifications();

        } catch (err) {
            console.log(err);
        }
    };
    const rejectRequest = async (notification) => {
        try {

            await axios.put(
                `http://localhost:5000/api/connection/reject/${notification.sender._id}`,
                {
                    receiverId: user._id
                }
            );

            const response = await axios.get(
                `http://localhost:5000/api/user/${user._id}`
            );

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            await axios.delete(
                `http://localhost:5000/api/notification/${notification._id}`
            );

            fetchNotifications();

        } catch (err) {
            console.log(err);
        }
    };

    const acceptProjectApplication = async (notification) => {
        try {

            await axios.put(
                `http://localhost:5000/api/notification/application/accept/${notification._id}`
            );

            fetchNotifications();

        } catch (err) {
            console.log(err);
        }
    };

    const rejectProjectApplication = async (notification) => {
        try {

            await axios.put(
                `http://localhost:5000/api/notification/application/reject/${notification._id}`
            );

            fetchNotifications();

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="dashboard-layout">
            <DashboardNav />
            <div className="notification-page">

                <div className="notification-header">

                    <div>
                        <h1>Notifications</h1>
                        <p>Stay updated with your latest project activities.</p>
                    </div>

                    <button
                        className="mark-read-btn"
                        onClick={markAllRead}
                    >
                        Mark all as read
                    </button>

                </div>

                <div className="notification-list">

                    {notifications.map((item) => (

                        <div
                            key={item._id}
                            className={`notification-card ${!item.isRead ? "unread" : ""}`}
                            onClick={() => openNotification(item)}
                        >

                            <div className="notification-icon">

                                {item.type === "connection_request" && <i class="fa-solid fa-handshake"></i>}

                                {item.type === "connection_accepted" && <i class="fa-solid fa-check"></i>}

                                {item.type === "project_application" && <i class="fa-solid fa-folder"></i>}

                                {item.type === "application_accepted" && <i class="fa-solid fa-award"></i>}

                                {item.type === "application_rejected" && <i class="fa-solid fa-xmark"></i>}

                                {item.type === "message" && <i class="fa-solid fa-comment"></i>}

                            </div>

                            <div className="notification-content">

                                <div className="notification-top">

                                    <h3>{item.title}</h3>

                                    <span>
                                        {new Date(item.createdAt).toLocaleString()}
                                    </span>

                                </div>

                                <p>{item.message}</p>
                                {item.type === "connection_request" && (
                                    <div className="notification-actions">
                                        <button
                                            className="accept-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                acceptRequest(item);
                                            }}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                rejectRequest(item);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {item.type === "project_application" && (
                                    <div className="notification-actions">
                                        <button
                                            className="accept-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                acceptProjectApplication(item);
                                            }}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                rejectProjectApplication(item);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}


                            </div>

                            {!item.isRead && (
                                <div className="notification-dot"></div>
                            )}

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
};

export default Notification;