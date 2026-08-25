import React from "react";
import "../CSS/Modal.css";

const JoinProjectModal = ({
    isOpen,
    onClose,
    onConfirm,
    project
}) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">

            <div className="join-modal">

                <i className="fa-solid fa-users join-icon"></i>

                <h2>Join Project</h2>

                <p>
                    Do you want to send a request to join
                    <strong> {project?.title}</strong>?
                </p>

                <small>
                    Once the owner approves your request,
                    you'll become a member and gain access
                    to the GitHub repository.
                </small>

                <div className="join-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="join-btn"
                        onClick={onConfirm}
                    >
                        Send Request
                    </button>

                </div>

            </div>

        </div>
    );
};

export default JoinProjectModal;