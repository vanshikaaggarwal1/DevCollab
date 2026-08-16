import React, { useState, useEffect, useRef } from "react";
import "../CSS/Workspace.css";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

/* ------------------------------------------------------------------ */
/* Helper components & styles                                          */
/* ------------------------------------------------------------------ */

const priorityStyles = {
  High: { bg: "#FEF2F2", color: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706" },
  Low: { bg: "#F0FDF4", color: "#16A34A" },
};

const statusStyles = {
  Planning: { bg: "#EFF6FF", color: "#2563EB" },
  Active: { bg: "#F0FDF4", color: "#16A34A" },
  Completed: { bg: "#F5F3FF", color: "#7C3AED" },
};

function Avatar({ name, image, role, size = 40, online }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const colors = ["#2563EB", "#7C3AED", "#0EA5E9", "#F59E0B", "#16A34A", "#DB2777"];
  const colorIndex = (name ? name.charCodeAt(0) : 0) % colors.length;
  const bg = colors[colorIndex];

  return (
    <span
      className="dc-avatar"
      style={{
        width: size,
        height: size,
        background: image ? "transparent" : bg,
        fontSize: size * 0.38,
        overflow: "hidden",
      }}
    >
      {image ? (
        <img
          src={image.startsWith("http") ? image : `http://localhost:5000${image}`}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        initials
      )}
      {online !== undefined && <span className={`dc-status-dot ${online ? "online" : "offline"}`} />}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* WorkspaceHeader                                                    */
/* ------------------------------------------------------------------ */

function WorkspaceHeader({ project, userProjects, onSelectProject, isOwner, role, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const navigate = useNavigate();

  const status = statusStyles[project?.status] || statusStyles.Active;

  return (
    <header className="dc-header">
      <div className="dc-header-left">
        <div className="dc-header-titles">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1>{project?.title || "Workspace"}</h1>
            {userProjects && userProjects.length > 1 && (
              <div className="dc-dropdown-wrap">
                <button
                  className="dc-btn dc-btn-secondary small"
                  onClick={() => setSelectorOpen((o) => !o)}
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                >
                  Switch Workspace <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px" }} />
                </button>
                {selectorOpen && (
                  <div className="dc-dropdown" onMouseLeave={() => setSelectorOpen(false)}>
                    {userProjects.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          onSelectProject(p._id);
                          setSelectorOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-folder" /> {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dc-header-meta">
            <span className="dc-project-name">{project?.category || "Web Development"}</span>
            <span className="dc-badge" style={{ background: status.bg, color: status.color }}>
              <span className="dc-dot" style={{ background: status.color }} />
              {project?.status || "Active"}
            </span>
            <span className="dc-badge" style={{ background: isOwner ? "#FEF3C7" : "#E0F2FE", color: isOwner ? "#92400E" : "#0369A1" }}>
              {isOwner ? "Owner" : "Member"}
            </span>
            <span className="dc-meta-item">
              <i className="fa-solid fa-users" /> {project?.members?.length || 1} / {project?.teamSize || 1} members
            </span>
          </div>
        </div>
      </div>

      <div className="dc-header-actions">
        {/* Only Owner can Edit Workspace */}
        {isOwner && (
          <button className="dc-btn dc-btn-secondary" onClick={onEdit}>
            <i className="fa-regular fa-pen-to-square" /> Edit Workspace
          </button>
        )}
        <button className="dc-btn dc-btn-secondary" onClick={() => navigate("/collaboration")}>
          <i className="fa-solid fa-handshake" /> Collaboration Hub
        </button>
        <button className="dc-btn dc-btn-primary" onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-gauge-high" /> Dashboard
        </button>

        <div className="dc-menu-wrap">
          <button className="dc-icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="More options">
            <i className="fa-solid fa-ellipsis-vertical" />
          </button>
          {menuOpen && (
            <div className="dc-dropdown" onMouseLeave={() => setMenuOpen(false)}>
              {isOwner && (
                <button onClick={onEdit}>
                  <i className="fa-regular fa-pen-to-square" /> Edit Project
                </button>
              )}
              {project?.github && (
                <button onClick={() => window.open(project.github, "_blank")}>
                  <i className="fa-brands fa-github" /> View Repository
                </button>
              )}
              <button onClick={() => navigate("/project")}>
                <i className="fa-solid fa-briefcase" /> All Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* WorkspaceTabs                                                      */
/* ------------------------------------------------------------------ */

const TABS = ["Overview", "Tasks", "Files", "Discussion", "Activity", "Team"];

function WorkspaceTabs({ activeTab, setActiveTab }) {
  return (
    <nav className="dc-tabs">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`dc-tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
          {activeTab === tab && <span className="dc-tab-underline" />}
        </button>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* OverviewSection                                                    */
/* ------------------------------------------------------------------ */

function OverviewCard({ icon, title, children, wide }) {
  return (
    <div className={`dc-card dc-overview-card ${wide ? "wide" : ""}`}>
      <div className="dc-card-header">
        <span className="dc-card-icon">
          <i className={`fa-solid ${icon}`} />
        </span>
        <h3>{title}</h3>
      </div>
      <div className="dc-card-body">{children}</div>
    </div>
  );
}

function OverviewSection({ project, activity, isOwner, onUpdateProgress }) {
  const [updating, setUpdating] = useState(false);
  const [newProgress, setNewProgress] = useState(project?.progress || 0);

  useEffect(() => {
    setNewProgress(project?.progress || 0);
  }, [project?.progress]);

  const handleSaveProgress = async () => {
    setUpdating(true);
    await onUpdateProgress(newProgress);
    setUpdating(false);
  };

  let daysRemaining = null;
  if (project?.deadline) {
    const diff = new Date(project.deadline) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const owner = project?.owner;

  return (
    <div className="dc-overview-grid">
      <OverviewCard icon="fa-align-left" title="Project Description" wide>
        <p className="dc-description">
          {project?.description || "No project description provided yet."}
        </p>
      </OverviewCard>

      <OverviewCard icon="fa-layer-group" title="Tech Stack">
        <div className="dc-chip-row">
          {project?.techStack && project.techStack.length > 0 ? (
            project.techStack.map((t, idx) => (
              <span key={idx} className="dc-chip">
                {t}
              </span>
            ))
          ) : (
            <span className="dc-hint">No technologies specified</span>
          )}
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-user-tie" title="Project Lead">
        <div className="dc-owner-row">
          <Avatar
            name={owner?.Name || owner?.name || "Project Lead"}
            image={owner?.Image || owner?.profileImage}
            role={owner?.Role}
            size={44}
          />
          <div>
            <div className="dc-owner-name">{owner?.Name || owner?.name || "Project Lead"}</div>
            <div className="dc-owner-role">{owner?.Role || "Lead Developer"}</div>
            {owner?.Email && <div className="dc-hint">{owner.Email}</div>}
          </div>
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-calendar-days" title="Target Deadline">
        <div className="dc-deadline-value">
          {project?.deadline
            ? new Date(project.deadline).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Flexible Target"}
        </div>
        <div className="dc-hint">
          {daysRemaining !== null ? `${daysRemaining} days remaining` : "No strict deadline"}
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-chart-line" title="Completion Progress">
        <div className="dc-progress-track">
          <div className="dc-progress-fill" style={{ width: `${project?.progress || 0}%` }} />
        </div>
        <div className="dc-hint" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{project?.progress || 0}% complete</span>
          {/* Progress edit strictly for Owner */}
          {isOwner && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                style={{ width: "50px", padding: "2px 6px", fontSize: "12px", borderRadius: "4px", border: "1px solid var(--dc-border)" }}
              />
              <button
                className="dc-btn dc-btn-secondary small"
                onClick={handleSaveProgress}
                disabled={updating}
                style={{ padding: "2px 8px", fontSize: "11px" }}
              >
                {updating ? "Saving..." : "Update"}
              </button>
            </div>
          )}
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-shield-halved" title="Project Info">
        <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div>
            <strong>Priority:</strong>{" "}
            <span
              className="dc-badge"
              style={{
                background: priorityStyles[project?.priority]?.bg || "#F0FDF4",
                color: priorityStyles[project?.priority]?.color || "#16A34A",
                padding: "2px 8px",
              }}
            >
              {project?.priority || "Medium"}
            </span>
          </div>
          <div>
            <strong>Difficulty:</strong> {project?.difficulty || "Intermediate"}
          </div>
          <div>
            <strong>Visibility:</strong> {project?.visibility || "Public"}
          </div>
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-bolt" title="Recent Activity Feed" wide>
        {activity && activity.length > 0 ? (
          <ul className="dc-mini-activity">
            {activity.slice(0, 5).map((a, i) => (
              <li key={a._id || i}>
                <span className="dc-mini-dot" />
                <span>{a.message || a.title}</span>
                <span className="dc-mini-time">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="dc-hint">No activity recorded for this workspace yet.</div>
        )}
      </OverviewCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TeamSection                                                        */
/* ------------------------------------------------------------------ */

function MemberCard({ member, isOwner, currentUser, onRemoveMember }) {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [sent, setSent] = useState(false);

  const isSelf = member._id === currentUser?._id;
  const isOwnerMember = member._id === currentUser?._id && isOwner;

  const isAlreadyConnected = currentUser?.Connections?.some(
    (id) => (id._id || id).toString() === member._id.toString()
  );

  const handleConnect = async () => {
    if (isSelf || isAlreadyConnected || sent) return;
    setConnecting(true);
    try {
      await axios.post(`http://localhost:5000/api/connection/request/${member._id}`, {
        senderId: currentUser._id,
      });
      setSent(true);
    } catch (err) {
      console.log(err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="dc-card dc-member-card">
      <Avatar
        name={member.Name}
        image={member.Image || member.profileImage}
        role={member.Role}
        size={56}
      />
      <div className="dc-member-name">{member.Name}</div>
      <div className="dc-member-role">{member.Role || "Developer"}</div>

      {member.Location && <div className="dc-hint"><i className="fa-solid fa-location-dot" /> {member.Location}</div>}

      <div className="dc-chip-row" style={{ justifyContent: "center", marginTop: "6px" }}>
        {member.Skills?.slice(0, 3).map((s, idx) => (
          <span key={idx} className="dc-chip" style={{ fontSize: "11px", padding: "2px 8px" }}>
            {s}
          </span>
        ))}
      </div>

      <div className="dc-member-actions">
        {!isSelf && (
          <button
            className="dc-btn dc-btn-secondary small"
            onClick={handleConnect}
            disabled={isAlreadyConnected || sent || connecting}
          >
            <i className="fa-solid fa-user-plus" />{" "}
            {isAlreadyConnected ? "Connected" : sent ? "Sent" : connecting ? "..." : "Connect"}
          </button>
        )}
        <button
          className="dc-btn dc-btn-ghost small"
          onClick={() => navigate(`/profile/${member._id}`)}
        >
          <i className="fa-regular fa-user" /> Profile
        </button>
        {/* Owner can remove members (except self/owner) */}
        {isOwner && !isSelf && (
          <button
            className="dc-btn dc-btn-secondary small dc-danger"
            onClick={() => onRemoveMember(member._id)}
            title="Remove member from project"
          >
            <i className="fa-solid fa-user-minus" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

function TeamSection({ project, currentUser, isOwner, onRefresh }) {
  const [actionLoading, setActionLoading] = useState(false);

  const handleAcceptRequest = async (applicantId) => {
    setActionLoading(true);
    try {
      const notifRes = await axios.get(`http://localhost:5000/api/notification/${currentUser._id}`);
      const notif = notifRes.data.notifications?.find(
        (n) => n.project?._id === project._id || n.project === project._id
      );

      if (notif) {
        await axios.put(`http://localhost:5000/api/notification/application/accept/${notif._id}`);
      } else {
        const updatedMembers = [...(project.members || []).map(m => m._id || m), applicantId];
        const updatedPending = (project.pendingRequests || [])
          .filter(p => (p._id || p).toString() !== applicantId.toString())
          .map(p => p._id || p);

        await axios.put(`http://localhost:5000/api/projects/update/${project._id}`, {
          userId: currentUser._id,
          members: updatedMembers,
          pendingRequests: updatedPending
        });
      }
      onRefresh();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (applicantId) => {
    setActionLoading(true);
    try {
      const notifRes = await axios.get(`http://localhost:5000/api/notification/${currentUser._id}`);
      const notif = notifRes.data.notifications?.find(
        (n) => n.project?._id === project._id || n.project === project._id
      );

      if (notif) {
        await axios.put(`http://localhost:5000/api/notification/application/reject/${notif._id}`);
      } else {
        const updatedPending = (project.pendingRequests || [])
          .filter(p => (p._id || p).toString() !== applicantId.toString())
          .map(p => p._id || p);

        await axios.put(`http://localhost:5000/api/projects/update/${project._id}`, {
          userId: currentUser._id,
          pendingRequests: updatedPending
        });
      }
      onRefresh();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member from the project?")) return;
    setActionLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/projects/${project._id}/remove-member`, {
        userId: currentUser._id,
        memberIdToRemove: memberId
      });
      onRefresh();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const allMembersMap = new Map();
  if (project?.owner) {
    allMembersMap.set(project.owner._id, { ...project.owner, isOwnerRole: true });
  }
  if (project?.members) {
    project.members.forEach((m) => {
      if (m && m._id) {
        allMembersMap.set(m._id, { ...m, isOwnerRole: m._id === project.owner?._id });
      }
    });
  }

  const teamList = Array.from(allMembersMap.values());
  const pendingRequests = isOwner ? (project?.pendingRequests || []) : [];

  return (
    <div>
      {/* Pending Join Requests (Visible strictly to Project Owner) */}
      {isOwner && pendingRequests.length > 0 && (
        <div className="dc-card" style={{ padding: "20px", marginBottom: "24px", border: "1px solid #FDE68A", background: "#FFFBEB" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#92400E" }}>
            <i className="fa-solid fa-user-clock" /> Pending Join Requests ({pendingRequests.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pendingRequests.map((applicant) => (
              <div
                key={applicant._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#FFFFFF",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--dc-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar name={applicant.Name} image={applicant.Image} size={40} />
                  <div>
                    <strong style={{ fontSize: "14px" }}>{applicant.Name}</strong>
                    <div style={{ fontSize: "12px", color: "var(--dc-gray)" }}>{applicant.Role || "Developer"} · {applicant.Email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="dc-btn dc-btn-primary small"
                    onClick={() => handleAcceptRequest(applicant._id)}
                    disabled={actionLoading}
                  >
                    Accept
                  </button>
                  <button
                    className="dc-btn dc-btn-secondary small dc-danger"
                    onClick={() => handleRejectRequest(applicant._id)}
                    disabled={actionLoading}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Project Collaborators ({teamList.length})</h3>
      <div className="dc-member-grid">
        {teamList.map((m) => (
          <MemberCard key={m._id} member={m} isOwner={isOwner} currentUser={currentUser} onRemoveMember={handleRemoveMember} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Task Board                                                          */
/* ------------------------------------------------------------------ */

function TaskCard({ task, onMove, onDelete }) {
  const p = priorityStyles[task.priority] || priorityStyles.Medium;
  return (
    <div className="dc-card dc-task-card">
      <div className="dc-task-top">
        <span className="dc-badge" style={{ background: p.bg, color: p.color }}>
          {task.priority}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {task.status !== "Completed" && (
            <button
              className="dc-icon-btn tiny"
              title="Move next"
              onClick={() => onMove(task.id, task.status === "To Do" ? "In Progress" : "Completed")}
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          )}
          <button className="dc-icon-btn tiny dc-danger" title="Delete task" onClick={() => onDelete(task.id)}>
            <i className="fa-solid fa-trash-can" />
          </button>
        </div>
      </div>
      <div className="dc-task-title">{task.title}</div>
      {task.description && <div style={{ fontSize: "12px", color: "var(--dc-gray)", marginBottom: "8px" }}>{task.description}</div>}
      <div className="dc-task-footer">
        <span className="dc-task-date">
          <i className="fa-regular fa-calendar" /> {task.dueDate || "No date"}
        </span>
        <span className="dc-tag" style={{ fontSize: "11px" }}>{task.assignee || "Team"}</span>
      </div>
    </div>
  );
}

function TaskColumn({ title, count, tasks, accent, onMove, onDelete }) {
  return (
    <div className="dc-task-column">
      <div className="dc-column-header">
        <span className="dc-column-dot" style={{ background: accent }} />
        <h4>{title}</h4>
        <span className="dc-column-count">{count}</span>
      </div>
      <div className="dc-column-body">
        {tasks.length === 0 ? (
          <div className="dc-empty-mini">No tasks here yet</div>
        ) : (
          tasks.map((t) => <TaskCard key={t.id} task={t} onMove={onMove} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
}

function TaskBoard({ project, onUpdateProject }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`dc_tasks_${project?._id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      { id: "1", title: "Set up project repository & architecture", status: "Completed", priority: "High", assignee: project?.owner?.Name?.split(" ")[0] || "Lead", dueDate: "Initial" },
      { id: "2", title: "Implement core features & component design", status: "In Progress", priority: "High", assignee: "Team", dueDate: "Active" },
      { id: "3", title: "Write unit tests and code documentation", status: "To Do", priority: "Medium", assignee: "QA", dueDate: "Upcoming" },
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  useEffect(() => {
    if (project?._id) {
      localStorage.setItem(`dc_tasks_${project._id}`, JSON.stringify(tasks));
    }
  }, [tasks, project?._id]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      status: "To Do",
      priority: newTaskPriority,
      assignee: newTaskAssignee.trim() || "Unassigned",
      dueDate: "Upcoming",
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskAssignee("");
    setShowModal(false);
  };

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const todoTasks = tasks.filter((t) => t.status === "To Do");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return (
    <>
      <div className="dc-section-toolbar">
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Workspace Kanban Board</h3>
        <button className="dc-btn dc-btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus" /> Add Work Item
        </button>
      </div>

      <div className="dc-kanban" style={{ marginTop: "16px" }}>
        <TaskColumn title="To Do" count={todoTasks.length} tasks={todoTasks} accent="#94A3B8" onMove={handleMoveTask} onDelete={handleDeleteTask} />
        <TaskColumn title="In Progress" count={inProgressTasks.length} tasks={inProgressTasks} accent="#2563EB" onMove={handleMoveTask} onDelete={handleDeleteTask} />
        <TaskColumn title="Completed" count={completedTasks.length} tasks={completedTasks} accent="#16A34A" onMove={handleMoveTask} onDelete={handleDeleteTask} />
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="dc-card" style={{ width: "100%", maxWidth: "450px", padding: "24px", background: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Create Work Item</h3>
              <button className="dc-icon-btn tiny" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600" }}>Task Title</label>
                <input
                  type="text"
                  className="dc-search"
                  style={{ width: "100%", marginTop: "4px" }}
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: "600" }}>Assignee</label>
                  <input
                    type="text"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }}
                    placeholder="Assignee name"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button className="dc-btn dc-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="dc-btn dc-btn-primary" onClick={handleAddTask}>Add Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* DiscussionPanel                                                    */
/* ------------------------------------------------------------------ */

function DiscussionPanel({ project, currentUser }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`dc_msgs_${project?._id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      {
        id: 1,
        sender: project?.owner?.Name || "Project Lead",
        role: project?.owner?.Role || "Lead Developer",
        image: project?.owner?.Image,
        text: `Welcome to ${project?.title || "our workspace"}! Feel free to discuss updates and post links here.`,
        time: "Started",
      },
    ];
  });

  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (project?._id) {
      localStorage.setItem(`dc_msgs_${project._id}`, JSON.stringify(messages));
    }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, project?._id]);

  const send = () => {
    if (!draft.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: currentUser?.Name || "Developer",
      role: currentUser?.Role || "Collaborator",
      image: currentUser?.Image || currentUser?.profileImage,
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((m) => [...m, newMsg]);
    setDraft("");
  };

  return (
    <div className="dc-card dc-discussion-card">
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--dc-border)", background: "var(--dc-bg)" }}>
        <strong style={{ fontSize: "14px" }}>Project Session Discussion Room</strong>
        <span className="dc-hint" style={{ display: "block" }}>
          Visible to active project collaborators
        </span>
      </div>

      <div className="dc-discussion-messages">
        {messages.map((m) => (
          <div key={m.id} className="dc-message">
            <Avatar name={m.sender} image={m.image} size={36} />
            <div className="dc-message-body">
              <div className="dc-message-meta">
                <span className="dc-message-sender">{m.sender}</span>
                <span className="dc-tag" style={{ fontSize: "10px", padding: "1px 6px" }}>{m.role}</span>
                <span className="dc-message-time">{m.time}</span>
              </div>
              <div className="dc-message-bubble">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="dc-discussion-input">
        <input
          placeholder="Share a message or update with project members..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="dc-btn dc-btn-primary small" onClick={send}>
          <i className="fa-solid fa-paper-plane" /> Send
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FilesSection                                                       */
/* ------------------------------------------------------------------ */

function FilesSection({ project }) {
  return (
    <div className="dc-card dc-files-card">
      <div className="dc-section-toolbar inside">
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Project Resources & Repository</h3>
      </div>

      <div className="dc-file-list" style={{ padding: "16px 20px" }}>
        {project?.github && (
          <div className="dc-file-row">
            <span className="dc-file-icon" style={{ color: "#071739" }}>
              <i className="fa-brands fa-github" />
            </span>
            <div className="dc-file-info">
              <div className="dc-file-name">Source Code Repository</div>
              <div className="dc-hint">{project.github}</div>
            </div>
            <div className="dc-file-actions">
              <button
                className="dc-btn dc-btn-secondary small"
                onClick={() => window.open(project.github.startsWith("http") ? project.github : `https://${project.github}`, "_blank")}
              >
                Open GitHub <i className="fa-solid fa-arrow-up-right-from-square" />
              </button>
            </div>
          </div>
        )}

        <div className="dc-file-row">
          <span className="dc-file-icon" style={{ color: "#2563EB" }}>
            <i className="fa-solid fa-layer-group" />
          </span>
          <div className="dc-file-info">
            <div className="dc-file-name">Technology Stack Blueprint</div>
            <div className="dc-hint">{project?.techStack?.join(", ") || "Stack details"}</div>
          </div>
          <div className="dc-file-actions">
            <span className="dc-tag">Configured</span>
          </div>
        </div>

        <div className="dc-file-row">
          <span className="dc-file-icon" style={{ color: "#7C3AED" }}>
            <i className="fa-solid fa-folder-open" />
          </span>
          <div className="dc-file-info">
            <div className="dc-file-name">Project Specification & Requirements</div>
            <div className="dc-hint">Category: {project?.category || "Development"} · Team size target: {project?.teamSize || 1}</div>
          </div>
          <div className="dc-file-actions">
            <span className="dc-tag">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ActivityTimeline                                                   */
/* ------------------------------------------------------------------ */

function ActivityTimeline({ activity }) {
  return (
    <div className="dc-card dc-timeline-card">
      <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700" }}>Workspace Event Timeline</h3>

      {activity && activity.length > 0 ? (
        <ul className="dc-timeline">
          {activity.map((a, idx) => (
            <li key={a._id || idx} className="dc-timeline-item">
              <span className="dc-timeline-icon" style={{ background: "#EFF6FF", color: "#2563EB" }}>
                <i className="fa-solid fa-bell" />
              </span>
              <div className="dc-timeline-content">
                <div style={{ fontWeight: "600", color: "var(--dc-ink)" }}>{a.title || "Notification"}</div>
                <div>{a.message}</div>
                <div className="dc-hint">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dc-empty-state">
          <span className="dc-empty-icon"><i className="fa-solid fa-clock-rotate-left" /></span>
          <h4>No Activity History Yet</h4>
          <p>Recent join requests and updates for this project will appear here.</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WorkspaceSidebar                                                   */
/* ------------------------------------------------------------------ */

function WorkspaceSidebar({ project, isOwner }) {
  return (
    <aside className="dc-sidebar">
      <div className="dc-card dc-sidebar-card">
        <h4>
          <i className="fa-solid fa-chart-simple" /> Project Statistics
        </h4>
        <div className="dc-stats-grid">
          <div>
            <strong>{project?.members?.length || 1}</strong>
            <span>Members</span>
          </div>
          <div>
            <strong>{project?.progress || 0}%</strong>
            <span>Progress</span>
          </div>
          <div>
            <strong>{project?.priority || "Medium"}</strong>
            <span>Priority</span>
          </div>
          <div>
            <strong>{project?.status || "Active"}</strong>
            <span>Status</span>
          </div>
        </div>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4>
          <i className="fa-solid fa-user-tie" /> Project Lead
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={project?.owner?.Name} image={project?.owner?.Image} size={42} />
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px" }}>{project?.owner?.Name || "Lead"}</div>
            <div className="dc-hint">{project?.owner?.Role || "Owner"}</div>
          </div>
        </div>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4>
          <i className="fa-solid fa-link" /> Quick Resources
        </h4>
        <ul className="dc-sidebar-list links">
          {project?.github ? (
            <li onClick={() => window.open(project.github.startsWith("http") ? project.github : `https://${project.github}`, "_blank")}>
              <i className="fa-brands fa-github" /> GitHub Repository
            </li>
          ) : (
            <li className="dc-hint">No GitHub repo linked</li>
          )}
          <li>
            <i className="fa-solid fa-layer-group" /> {project?.category || "Web Project"}
          </li>
        </ul>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* EditProjectModal (Owner Only)                                       */
/* ------------------------------------------------------------------ */

function EditProjectModal({ isOpen, onClose, project, onSave }) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "Web Development");
  const [status, setStatus] = useState(project?.status || "Active");
  const [priority, setPriority] = useState(project?.priority || "Medium");
  const [progress, setProgress] = useState(project?.progress || 0);
  const [github, setGithub] = useState(project?.github || "");
  const [techStackStr, setTechStackStr] = useState(project?.techStack?.join(", ") || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setCategory(project.category || "Web Development");
      setStatus(project.status || "Active");
      setPriority(project.priority || "Medium");
      setProgress(project.progress || 0);
      setGithub(project.github || "");
      setTechStackStr(project.techStack?.join(", ") || "");
    }
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const techStack = techStackStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await onSave({
      title,
      description,
      category,
      status,
      priority,
      progress: Number(progress),
      github,
      techStack,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div className="dc-card" style={{ width: "100%", maxWidth: "550px", padding: "24px", background: "#FFF", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Edit Workspace Details</h3>
          <button className="dc-icon-btn tiny" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Project Title</label>
            <input type="text" className="dc-search" style={{ width: "100%", marginTop: "4px" }} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Description</label>
            <textarea
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px", minHeight: "80px", fontFamily: "inherit" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }}>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Progress (%)</label>
              <input type="number" min="0" max="100" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }} value={progress} onChange={(e) => setProgress(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600" }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid var(--dc-border)", marginTop: "4px" }}>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Game Development">Game Development</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Tech Stack (comma separated)</label>
            <input type="text" className="dc-search" style={{ width: "100%", marginTop: "4px" }} placeholder="React, Node.js, MongoDB" value={techStackStr} onChange={(e) => setTechStackStr(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600" }}>GitHub Repository Link</label>
            <input type="text" className="dc-search" style={{ width: "100%", marginTop: "4px" }} placeholder="https://github.com/username/repo" value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button type="button" className="dc-btn dc-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="dc-btn dc-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton & Access Required Screen                                   */
/* ------------------------------------------------------------------ */

function SkeletonGrid() {
  return (
    <div className="dc-overview-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="dc-card dc-skeleton-card">
          <div className="dc-skel dc-skel-title" />
          <div className="dc-skel dc-skel-line" />
          <div className="dc-skel dc-skel-line short" />
        </div>
      ))}
    </div>
  );
}

function AccessRequiredScreen({ project, isPending, onRequestJoin, requesting }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px 20px", maxWidth: "720px", margin: "40px auto" }}>
      <div className="dc-card" style={{ padding: "36px", textAlign: "center", borderRadius: "20px" }}>
        <span className="dc-empty-icon" style={{ background: "#FEF3C7", color: "#D97706", width: "64px", height: "64px", fontSize: "26px" }}>
          <i className="fa-solid fa-lock" />
        </span>

        <h2 style={{ margin: "16px 0 6px 0", fontSize: "22px", fontWeight: "700" }}>Workspace Access Required</h2>
        <p style={{ color: "var(--dc-gray)", fontSize: "14.5px", marginBottom: "28px" }}>
          You are not currently a member of this project workspace.
        </p>

        {/* Public Overview Card */}
        <div style={{ background: "var(--dc-bg)", border: "1px solid var(--dc-border)", borderRadius: "16px", padding: "20px", textAlign: "left", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{project?.title}</h3>
            <span className="dc-tag">{project?.category || "Project"}</span>
          </div>

          <p style={{ margin: "0 0 16px 0", color: "var(--dc-ink-soft)", fontSize: "14px", lineHeight: "1.5" }}>
            {project?.description || "No description provided."}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--dc-border)", paddingTop: "14px" }}>
            <Avatar name={project?.owner?.Name} image={project?.owner?.Image} size={42} />
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>{project?.owner?.Name || "Project Lead"}</div>
              <div style={{ fontSize: "12.5px", color: "var(--dc-gray)" }}>Project Lead · {project?.owner?.Role || "Owner"}</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "13px", color: "var(--dc-gray)" }}>
              <i className="fa-solid fa-users" /> {project?.membersCount || 1} / {project?.teamSize || 1} members
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isPending ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button className="dc-btn dc-btn-secondary" disabled style={{ padding: "12px 24px", fontSize: "15px", opacity: 0.8, cursor: "not-allowed" }}>
              <i className="fa-solid fa-clock-rotate-left" /> Join Request Pending
            </button>
            <p style={{ fontSize: "13px", color: "var(--dc-gray)", margin: 0 }}>
              You have already sent a request to join this project. Please wait for the project owner to review your application.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button
              className="dc-btn dc-btn-primary"
              style={{ padding: "12px 28px", fontSize: "15px" }}
              onClick={onRequestJoin}
              disabled={requesting}
            >
              <i className="fa-solid fa-user-plus" /> {requesting ? "Sending Request..." : "Request to Join Project"}
            </button>
            <p style={{ fontSize: "13px", color: "var(--dc-gray)", margin: 0 }}>
              Sending a request will notify {project?.owner?.Name || "the project lead"}.
            </p>
          </div>
        )}

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--dc-border)" }}>
          <button className="dc-btn dc-btn-ghost small" onClick={() => navigate("/collaboration")}>
            <i className="fa-solid fa-arrow-left" /> Back to Collaboration Hub
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle, actionText, onAction }) {
  return (
    <div className="dc-empty-state">
      <span className="dc-empty-icon">
        <i className={`fa-solid ${icon}`} />
      </span>
      <h4>{title}</h4>
      <p>{subtitle}</p>
      {actionText && (
        <button className="dc-btn dc-btn-primary" style={{ marginTop: "16px" }} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Workspace Component                                            */
/* ------------------------------------------------------------------ */

export default function Workspace() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = paramId || searchParams.get("id");

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [role, setRole] = useState("none");
  const [isPending, setIsPending] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadWorkspaceData();
    }
  }, [projectId, currentUser]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    setError("");
    setAccessDenied(false);

    try {
      // 1. Fetch user's accessible projects for the header dropdown
      const projectsRes = await axios.get("http://localhost:5000/api/projects");
      let allProjects = [];
      if (projectsRes.data.statuscode === 1) {
        allProjects = projectsRes.data.projects;
      }

      const accessibleProjects = allProjects.filter((p) => {
        const isOwner = p.owner?._id === currentUser?._id;
        const isMem = p.members?.some(
          (m) => (m._id || m).toString() === currentUser?._id.toString()
        );
        return isOwner || isMem;
      });

      setUserProjects(accessibleProjects);

      let targetId = projectId;
      if (!targetId && accessibleProjects.length > 0) {
        targetId = accessibleProjects[0]._id;
      }

      if (!targetId) {
        setProject(null);
        setLoading(false);
        return;
      }

      // 2. Fetch target project detail with strict backend membership check
      const detailRes = await axios.get(
        `http://localhost:5000/api/projects/detail/${targetId}?userId=${currentUser._id}`
      );

      if (detailRes.data.statuscode === 1) {
        if (detailRes.data.accessDenied) {
          setAccessDenied(true);
          setRole("none");
          setIsPending(!!detailRes.data.isPending);
          setProject(detailRes.data.project);
        } else {
          setAccessDenied(false);
          setRole(detailRes.data.role);
          setProject(detailRes.data.project);

          // 3. Fetch activity timeline for members/owner
          try {
            const actRes = await axios.get(`http://localhost:5000/api/projects/activity/${targetId}`);
            if (actRes.data.statuscode === 1) {
              setActivity(actRes.data.activities);
            }
          } catch {
            setActivity([]);
          }
        }
      } else {
        setError(detailRes.data.message || "Project Not Found");
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setError("Project Not Found");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Access Unauthorized");
      } else {
        setError(err.response?.data?.message || "Server Error: Unable to fetch workspace data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendJoinRequest = async () => {
    if (!project?._id || !currentUser?._id) return;
    setRequesting(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/projects/join/${project._id}`, {
        userId: currentUser._id,
      });

      if (res.data.statuscode === 1 || res.data.message?.includes("already")) {
        setIsPending(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRequesting(false);
    }
  };

  const handleUpdateProjectFields = async (updatedData) => {
    if (!project?._id || role !== "owner") return;
    try {
      const res = await axios.put(`http://localhost:5000/api/projects/update/${project._id}`, {
        userId: currentUser._id,
        ...updatedData,
      });
      if (res.data.statuscode === 1) {
        setProject(res.data.project);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isOwner = role === "owner";

  return (
    <div className="dc-workspace">
      {loading ? (
        <div style={{ padding: "30px" }}>
          <SkeletonGrid />
        </div>
      ) : error ? (
        <div style={{ padding: "40px 20px" }}>
          <EmptyState
            icon="fa-triangle-exclamation"
            title="Workspace Error"
            subtitle={error}
            actionText="Back to Collaboration Hub"
            onAction={() => navigate("/collaboration")}
          />
        </div>
      ) : accessDenied ? (
        /* Access Required Screen for Non-Members */
        <AccessRequiredScreen
          project={project}
          isPending={isPending}
          onRequestJoin={handleSendJoinRequest}
          requesting={requesting}
        />
      ) : !project ? (
        <div style={{ padding: "40px 20px" }}>
          <EmptyState
            icon="fa-folder-open"
            title="No Active Workspace Selected"
            subtitle="Explore available developer projects in the Collaboration Hub."
            actionText="Explore Projects"
            onAction={() => navigate("/collaboration")}
          />
        </div>
      ) : (
        <>
          <WorkspaceHeader
            project={project}
            userProjects={userProjects}
            onSelectProject={(selectedId) => navigate(`/workspace/${selectedId}`)}
            isOwner={isOwner}
            role={role}
            onEdit={() => setEditModalOpen(true)}
          />

          <div className="dc-tabs-sticky">
            <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="dc-body">
            <main className="dc-main">
              {activeTab === "Overview" && (
                <OverviewSection
                  project={project}
                  activity={activity}
                  isOwner={isOwner}
                  onUpdateProgress={(val) => handleUpdateProjectFields({ progress: val })}
                />
              )}
              {activeTab === "Tasks" && (
                <TaskBoard project={project} onUpdateProject={handleUpdateProjectFields} />
              )}
              {activeTab === "Files" && <FilesSection project={project} />}
              {activeTab === "Discussion" && <DiscussionPanel project={project} currentUser={currentUser} />}
              {activeTab === "Activity" && <ActivityTimeline activity={activity} />}
              {activeTab === "Team" && (
                <TeamSection
                  project={project}
                  currentUser={currentUser}
                  isOwner={isOwner}
                  onRefresh={loadWorkspaceData}
                />
              )}
            </main>

            <WorkspaceSidebar project={project} isOwner={isOwner} />
          </div>

          {/* Edit Project Modal (Owner Only) */}
          {isOwner && (
            <EditProjectModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              project={project}
              onSave={handleUpdateProjectFields}
            />
          )}
        </>
      )}
    </div>
  );
}