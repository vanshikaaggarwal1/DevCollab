import React, { useEffect, useState } from "react";
import "../CSS/PersonalProfile.css";
import axios from "axios";
import DashboardNav from "./DashboardNav";
import { Link } from "react-router-dom";

const PersonalProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(
                `http://localhost:5000/api/user/${user._id}`
            );
            // console.log(res.data.user);

            setProfile(res.data.user);

        } catch (error) {
            console.log(error);
        }
    };

    if (!profile) {
        return (
            <div className="dashboard-layout">
                <DashboardNav />
                <div className="loading">
                    No profile found.
                </div>
            </div>
        );
    }

    return (


        <div className="personal-profile-page">

            <div className="profile-card">

                <div className="profile-top">

                    <div
                        className="cover-image"
                        style={{
                            backgroundImage: profile.CoverImage
                                ? `url(http://localhost:5000${profile.CoverImage})`
                                : "none"
                        }}
                    ></div> </div>
                <div className="profile-header">
                    <img
                        src={
                            profile.Image
                                ? `http://localhost:5000${profile.Image}` 
                                : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"
                        }
                        alt="profile"
                    />

                    <div className="profile-details">
                        <h1>{profile.Name}</h1>

                        <p>{profile.Role}</p>
                    </div>
                    <Link to="/editprofile">
                        <button>Edit Profile</button>
                    </Link>
                </div>


                <div className="profile-info">

                    <div className="info-box">
                        <h4>Email</h4>
                        <p>{profile.Email}</p>
                    </div>

                    <div className="info-box">
                        <h4>Bio</h4>
                        <p>{profile.Bio || "No bio added."}</p>
                    </div>

                    <div className="info-box">
                        <h4>Education</h4>
                        <p>{profile.Education || "-"}</p>
                    </div>

                    <div className="info-box">
                        <h4>Location</h4>
                        <p>{profile.Location || "-"}</p>
                    </div>

                    <div className="info-box">
                        <h4>Skills</h4>

                        <div className="skills">

                            {profile.Skills?.length > 0 ? (
                                profile.Skills.map((skill, index) => (
                                    <span key={index}>{skill}</span>
                                ))
                            ) : (
                                <p>No skills added.</p>
                            )}

                        </div>

                    </div>

                    <div className="info-box">
                        <h4>GitHub</h4>

                        {profile.Github ? (
                            <a
                                href={profile.Github}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {profile.Github}
                            </a>
                        ) : (
                            <p>Not Added</p>
                        )}
                    </div>

                    <div className="info-box">
                        <h4>LinkedIn</h4>

                        {profile.Linkedin ? (
                            <a
                                href={profile.Linkedin}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {profile.Linkedin}
                            </a>
                        ) : (
                            <p>Not Added</p>
                        )}
                    </div>

                    <div className="info-box">
                        <h4>Portfolio</h4>

                        {profile.Portfolio ? (
                            <a
                                href={profile.Portfolio}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {profile.Portfolio}
                            </a>
                        ) : (
                            <p>Not Added</p>
                        )}
                    </div>

                </div>

            </div>

        </div>

    );
};

export default PersonalProfile;