import React, { useContext, useEffect, useState } from "react";
import "../CSS/Project.css";
import DashboardNav from "./DashboardNav";
import { Link } from "react-router-dom";
import axios from "axios";
import { Logincontext } from "./context";

const Projects = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [userid, setuserid] = useContext(Logincontext)

  useEffect(() => {

    let id = JSON.parse(localStorage.getItem("user"))
    if (id) {
      setuserid(id._id)
      getProjects();
    }


  }, [userid]);

  const getProjects = async () => {
    console.log(userid)

    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${userid}`);
      setProjects(res.data.projects);
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
            <h1>Projects</h1>
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
              {
                projects.filter((p) => p.status === "Active").length
              }
            </h2>
            <span>Active</span>
          </div>

          <div className="stat-card">
            <h2>
              {
                projects.filter((p) => p.status === "Completed").length
              }
            </h2>
            <span>Completed</span>
          </div>

          <div className="stat-card">
            <h2>
              {projects.reduce(
                (total, p) => total + (p.teamsize?.length || 0),
                0
              )}
            </h2>
            <span>Team Size</span>
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

                <span className={`status ${project.status.replace(" ", "-")}`}>
                  {project.status}
                </span>
              </div>

              <p>{project.description}</p>

              <div className="project-footer">
                <div>
                  <small>👥 {project.members?.length || 0} Team size</small>
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

              <button className="view-btn">
                View Project
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Projects;