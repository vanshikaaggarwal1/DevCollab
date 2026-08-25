import React, { useState, useEffect } from "react";
import "../CSS/Profile.css";
import DashboardNav from "./DashboardNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const EditProfile = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const user = JSON.parse(localStorage.getItem("user"));
    const [profile, setProfile] = useState({

        Name: "",
        Role: "",
        Location: "",
        Bio: "",
        Skills: "",
        Github: "",
        Linkedin: "",
        Portfolio: "",
        Experience: "",
        Education: "",
        Company: ""
    });
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    useEffect(() => {
        getProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({

            ...profile,
            [e.target.name]: e.target.value
        });
    };
    const getProfile = async () => {
        try {
            const userObj = JSON.parse(localStorage.getItem("user"));
            if (!userObj?._id) return;
            const response = await fetch(
                `http://localhost:5000/api/user/${userObj._id}`
            );

            const data = await response.json();

            if (data.statuscode === 1) {
                setProfile({
                    Name: data.user.Name || "",
                    Role: data.user.Role || "",
                    Location: data.user.Location || "",
                    Bio: data.user.Bio || "",
                    Skills: data.user.Skills?.join(", ") || "",
                    Github: data.user.Github || "",
                    Linkedin: data.user.Linkedin || "",
                    Portfolio: data.user.Portfolio || "",
                    Experience: data.user.Experience || "",
                    Education: data.user.Education || "",
                    Company: data.user.Company || ""
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const saveProfile = async () => {
        const formData = new FormData();
        formData.append("Name", profile.Name);
        formData.append("Role", profile.Role);
        formData.append("Location", profile.Location);
        formData.append("Bio", profile.Bio);
        formData.append("Experience", profile.Experience);
        formData.append("Education", profile.Education);
        formData.append("Company", profile.Company);
        formData.append("Github", profile.Github);
        formData.append("Linkedin", profile.Linkedin);
        formData.append("Portfolio", profile.Portfolio);
        formData.append(
            "Skills",
            JSON.stringify(
                profile.Skills
                    ? profile.Skills.split(",").map(skill => skill.trim())
                    : []
            )
        );

        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        if (coverImage) {
            formData.append("coverImage", coverImage);
        }

        const userObj = JSON.parse(localStorage.getItem("user"));
        if (!userObj?._id) return alert("Please log in first.");

        const response = await fetch(
            `http://localhost:5000/api/user/update/${userObj._id}`,
            {
                method: "PUT",
                body: formData
            }
        );

        const data = await response.json();

        if (data.statuscode === 1) {
            if (data.user) {
                updateUser(data.user);
            }
            navigate("/personalprofile");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="dashboard-layout">

            <DashboardNav />

            <div className="profile-page">

                <div className="profile-form">

                    <h1>Complete Your Profile</h1>

                    <p>
                        Tell other developers about yourself.
                    </p>

                    <div className="profile-grid">

                        <div className="form-group">

                            <label>Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"

                                onChange={(e) => setProfileImage(e.target.files[0])}
                            />

                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="Name"
                                value={profile.Name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                name="Role"
                                value={profile.Role}
                                placeholder="Frontend Developer"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="Location"
                                value={profile.Location}
                                onChange={handleChange}
                                placeholder="Ludhiana, Punjab"
                            />
                        </div>

                        <div className="form-group full">
                            <label>Bio</label>
                            <textarea
                                rows="4"
                                name="Bio"
                                value={profile.Bio}
                                onChange={handleChange}
                                placeholder="Write a short bio..."
                            />
                        </div>

                        <div className="form-group full">
                            <label>Skills</label>
                            <input
                                type="text"
                                name="Skills"
                                value={profile.Skills}
                                placeholder="React, Node.js, MongoDB"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience</label>
                            <input
                                type="text"
                                name="Experience"
                                value={profile.Experience}
                                placeholder="2 Years"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Education</label>
                            <input
                                type="text"
                                name="Education"
                                value={profile.Education}
                                onChange={handleChange}
                                placeholder="e.g., BTech in Computer Science"
                            />
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                name="Company"
                                value={profile.Company}
                                onChange={handleChange}
                                placeholder="e.g., Google"
                            />
                        </div>

                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="text"
                                name="Github"
                                value={profile.Github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="text"
                                name="Linkedin"
                                value={profile.Linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>Portfolio</label>
                            <input
                                type="text"
                                name="Portfolio"
                                value={profile.Portfolio}
                                onChange={handleChange}
                                placeholder="https://yourname.vercel.app"
                            />
                        </div>
                    </div>

                    <button
                        className="save-profile-btn"
                        onClick={saveProfile}>
                        Save Profile
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;