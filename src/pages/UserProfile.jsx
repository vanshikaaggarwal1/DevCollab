import React, { useEffect, useState } from "react";
import "../CSS/UserProfile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
    const { id } = useParams();

    const [user, setUser] = useState(null);

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

    if (!user) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="userprofile-page">

            {/* Cover */}

            <div
                className="userprofile-cover"
                style={{
                    backgroundImage: user.CoverImage
                        ? `url(http://localhost:5000/uploads/${user.CoverImage})`
                        : "none"
                }}
            ></div>

            {/* Profile Header */}

            <div className="userprofile-header">

                <img
                    src={user.Image
                        ? `http://localhost:5000${user.Image}`
                        : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"}
                    alt={user.Name}
                    className="userprofile-picture"
                />

                <div className="userprofile-details">

                    <h1>{user.Name}</h1>

                    <h3>{user.Headline || "Software Developer"}</h3>

                    <p>
                        <i className="fa-solid fa-location-dot"></i>{" "}
                        {user.Location || "Not specified"}
                    </p>

                </div>

                <div className="userprofile-buttons">

                    <button className="userconnect-btn">
                        Connect
                    </button>

                    <button className="usermessage-btn">
                        Message
                    </button>

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
                        <p>No skills added.</p>
                    )}

                </div>

            </section>

            {/* Stats */}

            <section className="userprofile-section">

                <h2>Developer Stats</h2>

                <div className="userstats-grid">

                    <div className="userstat-box">
                        <h1>{user.Projects?.length || 0}</h1>
                        <p>Projects</p>
                    </div>

                    <div className="userstat-box">
                        <h1>{user.Connections?.length || 0}</h1>
                        <p>Connections</p>
                    </div>

                    <div className="userstat-box">
                        <h1>{user.Contributions || 0}</h1>
                        <p>Contributions</p>
                    </div>

                </div>

            </section>

        </div>
    );
};

export default UserProfile;