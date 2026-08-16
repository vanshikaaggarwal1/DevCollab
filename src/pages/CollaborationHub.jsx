import React, { useState, useEffect } from "react";
import "../CSS/CollaborationHub.css";
import DashboardNav from "./DashboardNav";
import ProjectCard from "./ProjectCard";
import JoinProjectModal from "./JoinProjectModal";
import "../CSS/Modal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const CollaborationHub = () => {
 
    const [activeTab, setActiveTab] = useState("explore");
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {

            const response = await axios.get(
                "http://localhost:5000/api/projects"
            );

            if (response.data.statuscode === 1) {
                setProjects(response.data.projects);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const handleJoinProject = async () => {
        try {

            await axios.put(
                `http://localhost:5000/api/projects/join/${selectedProject._id}`,
                {
                    userId: currentUser._id
                }
            );

            setShowJoinModal(false);

            fetchProjects();

        } catch (err) {
            console.log(err);
        }
    };
    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase())
    );
    const displayedProjects =
        activeTab === "explore"
            ? filteredProjects.filter(
                (project) => project.owner?._id !== currentUser?._id
            )
            : filteredProjects.filter(
                (project) =>
                    project.owner?._id === currentUser?._id ||
                    project.members?.includes(currentUser?._id)
            );

    return (
        <div className="dashboard-layout">

            <DashboardNav />
            <div className="collaboration-container">

                <div className="collaboration-header">

                    <div className="collab">

                        <h1>Collaboration Hub</h1>

                        <p>
                            Discover and collaborate on amazing developer projects.
                        </p>

                    </div>

                    <button className="createproject-btn" onClick={() => navigate("/create-project")}>
                        <i className="fa-solid fa-plus"></i>
                        Create Project
                    </button>

                </div>

                {/* Tabs */}

                <div className="collaboration-tabs">

                    <button
                        className={activeTab === "explore" ? "active-tab" : ""}
                        onClick={() => setActiveTab("explore")}
                    >
                        Explore Projects
                    </button>

                    <button
                        className={activeTab === "my" ? "active-tab" : ""}
                        onClick={() => setActiveTab("my")}
                    >
                        My Collaborations
                    </button>

                </div>

                {/* Search */}

                <div className="collaboration-search">

                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select>

                        <option>All Tech Stack</option>
                        <option>React</option>
                        <option>Node.js</option>
                        <option>MongoDB</option>
                        <option>Next.js</option>

                    </select>

                </div>

                {/* Cards */}

                <div className="project-grid">

                    {displayedProjects.length === 0 ? (

                        <div className="no-projects">

                            <i className="fa-solid fa-folder-open"></i>

                            <h2>No Projects Found</h2>

                            <p>
                                Try another search or create a new project.
                            </p>

                        </div>

                    ) : (

                        displayedProjects.map((project) => (

                            <ProjectCard
                                key={project._id}
                                project={project}
                                currentUser={currentUser}
                                onJoin={(project) => {
                                    setSelectedProject(project);
                                    setShowJoinModal(true);
                                }}
                                onOpenWorkspace={(project) => {
                                    navigate(`/workspace/${project._id}`);
                                }}
                            />

                        ))

                    )}

                </div>



                <JoinProjectModal
                    isOpen={showJoinModal}
                    project={selectedProject}
                    onClose={() => setShowJoinModal(false)}
                    onConfirm={handleJoinProject}
                />
            </div>
        </div>

    );
};

export default CollaborationHub;