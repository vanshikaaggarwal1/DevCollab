import React from "react";
import "../CSS/ProjectCard.css";
 
const ProjectCard = ({
    project,
    currentUser,
    onJoin,
    onOpenWorkspace
}) => {

    const ownerId = typeof project.owner === 'object' ? project.owner?._id : project.owner;
    const isOwner = ownerId === currentUser?._id;
    const isMember = project.members?.includes(currentUser?._id);
    const requestSent = project.pendingRequests?.includes(currentUser?._id);

    return (
        <div className="project-card">
            <div className="project-icon">
                <i className="fa-solid fa-code"></i>
            </div>

            <h2>{project.title}</h2>

            <p>{project.description}</p>

            <div className="tech-stack">
                {project.techStack?.map((tech, index) => (
                    <span key={index}>
                        {tech}
                    </span>
                ))}
            </div>

            <div className="project-details">
                <p>
                    <strong>Category:</strong> {project.category || "General"}
                </p>

                <p>
                    <strong>Difficulty:</strong> {project.difficulty || "Medium"}
                </p>

                <p>
                    <strong>Members:</strong> {project.members?.length || 0} / {project.teamSize || 1}
                </p>
            </div>

            <div className="project-footer">

                {isOwner || isMember ? (

                    <button
                        className="workspace-btn"
                        onClick={() => onOpenWorkspace(project)}
                    >
                        Open Workspace
                    </button>

                ) : requestSent ? (

                    <button
                        className="pending-btn"
                        disabled
                    >
                        Request Sent
                    </button>

                ) : (

                    <button
                        className="join-btn"
                        onClick={() => onJoin(project)}
                    >
                        Join Project
                    </button>

                )}

            </div>

        </div>
    );
};

export default ProjectCard;