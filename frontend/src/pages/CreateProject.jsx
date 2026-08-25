import React, { useState } from "react";
import "../CSS/CreateProject.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardNav from "./DashboardNav";

const CreateProject = () => {
    const navigate = useNavigate();

    const [project, setProject] = useState({
        title: "",
        description: "",
        techStack: "",
        category: "",
        teamSize: "",
        difficulty: "",
        github: "",
        visibility: "Public",
        status: "Planning",
        priority: "Medium",
        progress: 0,
        deadline: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setProject({
            ...project,
            [e.target.name]: e.target.value,
        });
    };

    const createProject = async () => {
        if (!project.title.trim()) {
            return alert("Project title is required.");
        }

        try {
            setLoading(true);

            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                alert("Please login first.");
                navigate("/login");
                return;
            }

            const projectData = {
                ...project,
                owner: user._id,
                techStack: project.techStack
                    ? project.techStack.split(",").map((tech) => tech.trim())
                    : [],
                teamSize: Number(project.teamSize) || 1,
                progress: Number(project.progress) || 0,
            };

            const res = await axios.post(
                "http://localhost:5000/api/projects",
                projectData
            );

            if (res.data.success) {
                alert("Project Created Successfully!");

                setProject({
                    title: "",
                    description: "",
                    techStack: "",
                    category: "",
                    teamSize: "",
                    difficulty: "",
                    github: "",
                    visibility: "Public",
                    status: "",
                    priority: "",
                    progress: "",
                    deadline: ""
                });

                navigate("/project");
            }
        } catch (error) {
            console.error(error.response?.data || error);
            alert(error.response?.data?.message || "Unable to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <DashboardNav />
            <div className="create-project-page">
                <div className="project-form-card">

                <h1>Create New Project</h1>

                <p>Start collaborating with developers around the world.</p>

                <div className="project-form">

                    <div className="form-group">
                        <label>Project Name</label>

                        <input
                            type="text"
                            name="title"
                            placeholder="DevCollab Website"
                            value={project.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            rows="5"
                            name="description"
                            placeholder="Describe your project..."
                            value={project.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Tech Stack</label>

                            <input
                                type="text"
                                name="techStack"
                                placeholder="React, Node.js, MongoDB"
                                value={project.techStack}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>

                            <select
                                name="category"
                                value={project.category}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option>Web Development</option>
                                <option>Mobile App</option>
                                <option>AI / ML</option>
                                <option>Cyber Security</option>
                                <option>Blockchain</option>
                                <option>Game Development</option>
                            </select>
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Team Size</label>

                            <input
                                type="number"
                                name="teamSize"
                                placeholder="5"
                                value={project.teamSize}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Difficulty</label>

                            <select
                                name="difficulty"
                                value={project.difficulty}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                    </div>

                    <div className="form-group">
                        <label>GitHub Repository</label>

                        <input
                            type="text"
                            name="github"
                            placeholder="https://github.com/username/project"
                            value={project.github}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Visibility</label>

                        <select
                            name="visibility"
                            value={project.visibility}
                            onChange={handleChange}
                        >
                            <option>Public</option>
                            <option>Private</option>
                        </select>
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={project.status}
                                onChange={handleChange}
                            >
                                <option>Planning</option>
                                <option>Active</option>
                                <option>Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={project.priority}
                                onChange={handleChange}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Progress (%)</label>

                            <input
                                type="number"
                                name="progress"
                                min="0"
                                max="100"
                                placeholder="0"
                                value={project.progress}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Deadline</label>

                            <input
                                type="date"
                                name="deadline"
                                value={project.deadline}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="create-project-btn"
                        onClick={createProject}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Project"}
                    </button>

                </div>
            </div>
        </div>
    </div>
    );
};

export default CreateProject;