import React, { useEffect, useState } from "react";
import "../CSS/Project.css";
import DashboardNav from "./DashboardNav";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const Projects = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      getProjects(user._id);
    }
  }, [user?._id]);

  const getProjects = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${userId}`);
      if (res.data.projects) {
        setProjects(res.data.projects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <div className="projects-page">
        <div className="projects-header">
          <div>
            <h1>My Projects</h1>
            <p>Manage and track all your collaborative projects.</p>
          </div>

          <Link to="/create-project">
            <button className="new-project-btn">
              + New Project
            </button>
          </Link>
        </div>

        <div className="project-stats">
          <div className="stat-card">
            <h2>{projects.length}</h2>
            <span>Total Projects</span>
          </div>

          <div className="stat-card">
            <h2>
              {projects.filter((p) => p.status === "Active").length}
            </h2>
            <span>Active</span>
          </div>

          <div className="stat-card">
            <h2>
              {projects.filter((p) => p.status === "Completed").length}
            </h2>
            <span>Completed</span>
          </div>

          <div className="stat-card">
            <h2>
              {projects.reduce(
                (total, p) => total + (p.members?.length || 1),
                0
              )}
            </h2>
            <span>Total Collaborators</span>
          </div>
        </div>

        <div className="project-toolbar">
          <input
            type="text"
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div className="project-card" key={project._id}>
              <div className="project-top">
                <h3>{project.title}</h3>

                <span className={`status ${(project.status || "Planning").toLowerCase().replace(" ", "-")}`}>
                  {project.status || "Planning"}
                </span>
              </div>

              <p>{project.description}</p>

              <div className="project-footer">
                <div>
                  <small>👥 {project.members?.length || 1} Members</small>
                </div>

                <div>
                  <small>
                    📅{" "}
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "No Deadline"}
                  </small>
                </div>
              </div>

              <button className="view-btn" onClick={() => navigate(`/workspace/${project._id}`)}>
                Open Workspace
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;