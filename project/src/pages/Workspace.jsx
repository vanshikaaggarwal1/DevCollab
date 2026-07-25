import React, { useState, useEffect, useMemo, useRef } from "react";
import "../CSS/Workspace.css";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with real API calls to your Express backend   */
/* ------------------------------------------------------------------ */

const WORKSPACE = {
  title: "DevCollab Workspace",
  project: "Nova CRM Redesign",
  status: "Active",
  membersCount: 8,
  lastUpdated: "2 hours ago",
};

const TABS = ["Overview", "Tasks", "Files", "Discussion", "Activity", "Team"];

const OVERVIEW = {
  description:
    "A ground-up redesign of the Nova CRM dashboard focused on faster workflows for sales teams, a cleaner data model, and a component library shared across every internal tool.",
  techStack: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Redis"],
  owner: { name: "Ariana Cole", role: "Lead Engineer", initials: "AC" },
  deadline: "Aug 29, 2026",
  completion: 68,
  nextMilestone: { name: "Beta release to internal QA", date: "Jul 18, 2026" },
  recentActivity: [
    { text: "Priya merged \"Refactor auth middleware\"", time: "35m ago" },
    { text: "New file uploaded: api-contracts-v2.pdf", time: "2h ago" },
    { text: "Marcus completed \"Design settings page\"", time: "5h ago" },
  ],
};

const MEMBERS = [
  { id: 1, name: "Ariana Cole", role: "Lead Engineer", initials: "AC", online: true, contribution: 92, color: "#2563EB" },
  { id: 2, name: "Priya Nair", role: "Backend Engineer", initials: "PN", online: true, contribution: 81, color: "#7C3AED" },
  { id: 3, name: "Marcus Yu", role: "Product Designer", initials: "MY", online: false, contribution: 74, color: "#0EA5E9" },
  { id: 4, name: "Sofia Reyes", role: "Frontend Engineer", initials: "SR", online: true, contribution: 88, color: "#F59E0B" },
  { id: 5, name: "Daniel Osei", role: "QA Engineer", initials: "DO", online: false, contribution: 63, color: "#16A34A" },
  { id: 6, name: "Lena Fischer", role: "DevOps", initials: "LF", online: true, contribution: 70, color: "#DB2777" },
];

const TASKS = {
  todo: [
    { id: "t1", title: "Set up rate limiting on public API", priority: "High", assignee: "PN", dueDate: "Jul 12", progress: 0 },
    { id: "t2", title: "Draft onboarding email sequence", priority: "Low", assignee: "MY", dueDate: "Jul 20", progress: 0 },
    { id: "t3", title: "Migrate legacy webhook handlers", priority: "Medium", assignee: "LF", dueDate: "Jul 16", progress: 0 },
  ],
  inProgress: [
    { id: "t4", title: "Build task board drag-and-drop", priority: "High", assignee: "SR", dueDate: "Jul 10", progress: 55 },
    { id: "t5", title: "Refactor auth middleware", priority: "High", assignee: "PN", dueDate: "Jul 11", progress: 80 },
    { id: "t6", title: "Write integration tests for billing", priority: "Medium", assignee: "DO", dueDate: "Jul 14", progress: 30 },
  ],
  completed: [
    { id: "t7", title: "Design settings page", priority: "Medium", assignee: "MY", dueDate: "Jul 5", progress: 100 },
    { id: "t8", title: "Set up CI pipeline", priority: "High", assignee: "LF", dueDate: "Jul 2", progress: 100 },
  ],
};

const FILES = [
  { id: 1, name: "api-contracts-v2.pdf", type: "pdf", uploadedBy: "Priya Nair", date: "Jul 6, 2026", size: "1.2 MB" },
  { id: 2, name: "design-system-tokens.json", type: "json", uploadedBy: "Marcus Yu", date: "Jul 5, 2026", size: "18 KB" },
  { id: 3, name: "nova-crm-wireframes.fig", type: "figma", uploadedBy: "Marcus Yu", date: "Jul 3, 2026", size: "8.4 MB" },
  { id: 4, name: "db-schema-diagram.png", type: "image", uploadedBy: "Ariana Cole", date: "Jul 1, 2026", size: "640 KB" },
  { id: 5, name: "sprint-14-notes.docx", type: "doc", uploadedBy: "Sofia Reyes", date: "Jun 29, 2026", size: "44 KB" },
];

const MESSAGES = [
  { id: 1, sender: "Priya Nair", initials: "PN", color: "#7C3AED", text: "Pushed the auth middleware refactor, can someone review?", time: "9:12 AM" },
  { id: 2, sender: "Ariana Cole", initials: "AC", color: "#2563EB", text: "On it — looking now.", time: "9:15 AM" },
  { id: 3, sender: "Sofia Reyes", initials: "SR", color: "#F59E0B", text: "Drag-and-drop is mostly working, just fixing the drop animation.", time: "9:41 AM" },
  { id: 4, sender: "Marcus Yu", initials: "MY", color: "#0EA5E9", text: "Uploaded new wireframes for the settings page 🎨", time: "10:03 AM" },
];

const ACTIVITY = [
  { id: 1, icon: "fa-user-plus", color: "#2563EB", text: "Lena Fischer joined the workspace", time: "Today, 8:02 AM" },
  { id: 2, icon: "fa-list-check", color: "#F59E0B", text: "Priya created \"Set up rate limiting on public API\"", time: "Today, 9:10 AM" },
  { id: 3, icon: "fa-circle-check", color: "#16A34A", text: "Marcus completed \"Design settings page\"", time: "Yesterday, 4:45 PM" },
  { id: 4, icon: "fa-file-arrow-up", color: "#7C3AED", text: "Ariana uploaded db-schema-diagram.png", time: "Yesterday, 2:20 PM" },
  { id: 5, icon: "fa-comment", color: "#DB2777", text: "Sofia commented on \"Build task board drag-and-drop\"", time: "Jul 6, 11:30 AM" },
  { id: 6, icon: "fa-pen", color: "#64748B", text: "Workspace description updated", time: "Jul 5, 3:00 PM" },
];

const SIDEBAR = {
  deadlines: [
    { name: "Beta release to QA", date: "Jul 18" },
    { name: "Sprint 15 review", date: "Jul 21" },
    { name: "Client demo", date: "Jul 29" },
  ],
  notifications: [
    { text: "Daniel mentioned you in a comment", time: "12m ago" },
    { text: "New task assigned to you", time: "1h ago" },
    { text: "Lena requested access to Files", time: "3h ago" },
  ],
  pinnedNotes: [
    "Staging env creds rotated every Monday.",
    "Use feature branches prefixed with ticket ID.",
  ],
  quickLinks: [
    { label: "GitHub Repo", icon: "fa-brands fa-github" },
    { label: "Figma Board", icon: "fa-brands fa-figma" },
    { label: "CI Dashboard", icon: "fa-solid fa-gauge-high" },
  ],
  stats: { tasksDone: 24, tasksTotal: 36, filesShared: 18, messages: 214 },
};

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

const priorityStyles = {
  High: { bg: "#FEF2F2", color: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706" },
  Low: { bg: "#F0FDF4", color: "#16A34A" },
};

const statusStyles = {
  Active: { bg: "#EFF6FF", color: "#2563EB" },
  Completed: { bg: "#F0FDF4", color: "#16A34A" },
  Archived: { bg: "#F1F5F9", color: "#64748B" },
};

const fileIcons = {
  pdf: { icon: "fa-file-pdf", color: "#DC2626" },
  json: { icon: "fa-file-code", color: "#D97706" },
  figma: { icon: "fa-brands fa-figma", color: "#7C3AED" },
  image: { icon: "fa-file-image", color: "#2563EB" },
  doc: { icon: "fa-file-word", color: "#1D4ED8" },
};

function Avatar({ initials, color, size = 40, online }) {
  return (
    <span className="dc-avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
      {online !== undefined && <span className={`dc-status-dot ${online ? "online" : "offline"}`} />}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  WorkspaceHeader                                                    */
/* ------------------------------------------------------------------ */

function WorkspaceHeader({ onInvite }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusStyles[WORKSPACE.status];
  const navigate = useNavigate();

  return (
    <header className="dc-header">
      <div className="dc-header-left">
        <div className="dc-header-titles">
          <h1>{WORKSPACE.title}</h1>
          <div className="dc-header-meta">
            <span className="dc-project-name">{WORKSPACE.project}</span>
            <span className="dc-badge" style={{ background: status.bg, color: status.color }}>
              <span className="dc-dot" style={{ background: status.color }} />
              {WORKSPACE.status}
            </span>
            <span className="dc-meta-item">
              <i className="fa-solid fa-users" /> {WORKSPACE.membersCount} members
            </span>
            <span className="dc-meta-item">
              <i className="fa-regular fa-clock" /> Updated {WORKSPACE.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      <div className="dc-header-actions">
        <button className="dc-btn dc-btn-secondary" onClick={onInvite}>
          <i className="fa-solid fa-user-plus" /> Invite Member
        </button>
        <button className="dc-btn dc-btn-primary" onClick={() => navigate("/dashboard")}>
          <i className="fa-solid fa-gauge-high"></i> Dashboard
        </button>
        <div className="dc-menu-wrap">
          <button className="dc-icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="More options">
            <i className="fa-solid fa-ellipsis-vertical" />
          </button>
          {menuOpen && (
            <div className="dc-dropdown" onMouseLeave={() => setMenuOpen(false)}>
              <button><i className="fa-regular fa-pen-to-square" /> Edit Workspace</button>
              <button><i className="fa-regular fa-copy" /> Duplicate</button>
              <button><i className="fa-solid fa-box-archive" /> Archive</button>
              <button className="dc-danger"><i className="fa-regular fa-trash-can" /> Delete</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  WorkspaceTabs                                                      */
/* ------------------------------------------------------------------ */

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
/*  OverviewCard                                                       */
/* ------------------------------------------------------------------ */

function OverviewCard({ icon, title, children, wide }) {
  return (
    <div className={`dc-card dc-overview-card ${wide ? "wide" : ""}`}>
      <div className="dc-card-header">
        <span className="dc-card-icon"><i className={`fa-solid ${icon}`} /></span>
        <h3>{title}</h3>
      </div>
      <div className="dc-card-body">{children}</div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="dc-overview-grid">
      <OverviewCard icon="fa-align-left" title="Project Description" wide>
        <p className="dc-description">{OVERVIEW.description}</p>
      </OverviewCard>

      <OverviewCard icon="fa-layer-group" title="Tech Stack">
        <div className="dc-chip-row">
          {OVERVIEW.techStack.map((t) => (
            <span key={t} className="dc-chip">{t}</span>
          ))}
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-user-tie" title="Project Owner">
        <div className="dc-owner-row">
          <Avatar initials={OVERVIEW.owner.initials} color="#2563EB" size={44} />
          <div>
            <div className="dc-owner-name">{OVERVIEW.owner.name}</div>
            <div className="dc-owner-role">{OVERVIEW.owner.role}</div>
          </div>
        </div>
      </OverviewCard>

      <OverviewCard icon="fa-calendar-days" title="Deadline">
        <div className="dc-deadline-value">{OVERVIEW.deadline}</div>
        <div className="dc-hint">42 days remaining</div>
      </OverviewCard>

      <OverviewCard icon="fa-chart-line" title="Completion Progress">
        <div className="dc-progress-track">
          <div className="dc-progress-fill" style={{ width: `${OVERVIEW.completion}%` }} />
        </div>
        <div className="dc-hint">{OVERVIEW.completion}% complete</div>
      </OverviewCard>

      <OverviewCard icon="fa-flag-checkered" title="Next Milestone">
        <div className="dc-owner-name">{OVERVIEW.nextMilestone.name}</div>
        <div className="dc-hint">Target: {OVERVIEW.nextMilestone.date}</div>
      </OverviewCard>

      <OverviewCard icon="fa-bolt" title="Recent Activity" wide>
        <ul className="dc-mini-activity">
          {OVERVIEW.recentActivity.map((a, i) => (
            <li key={i}>
              <span className="dc-mini-dot" />
              <span>{a.text}</span>
              <span className="dc-mini-time">{a.time}</span>
            </li>
          ))}
        </ul>
      </OverviewCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MemberCard                                                         */
/* ------------------------------------------------------------------ */

function MemberCard({ member }) {
  return (
    <div className="dc-card dc-member-card">
      <Avatar initials={member.initials} color={member.color} size={56} online={member.online} />
      <div className="dc-member-name">{member.name}</div>
      <div className="dc-member-role">{member.role}</div>
      <div className="dc-contribution">
        <div className="dc-progress-track thin">
          <div className="dc-progress-fill" style={{ width: `${member.contribution}%`, background: member.color }} />
        </div>
        <span className="dc-hint">{member.contribution}% contribution</span>
      </div>
      <div className="dc-member-actions">
        <button className="dc-btn dc-btn-secondary small"><i className="fa-regular fa-message" /> Message</button>
        <button className="dc-btn dc-btn-ghost small"><i className="fa-regular fa-user" /> Profile</button>
      </div>
    </div>
  );
}

function InviteMemberCard({ onInvite }) {
  return (
    <button className="dc-card dc-invite-card" onClick={onInvite}>
      <span className="dc-invite-icon"><i className="fa-solid fa-plus" /></span>
      <span>Invite new member</span>
    </button>
  );
}

function TeamSection({ onInvite }) {
  return (
    <div className="dc-member-grid">
      {MEMBERS.map((m) => <MemberCard key={m.id} member={m} />)}
      <InviteMemberCard onInvite={onInvite} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TaskCard + Task Board                                              */
/* ------------------------------------------------------------------ */

function TaskCard({ task }) {
  const p = priorityStyles[task.priority];
  const member = MEMBERS.find((m) => m.initials === task.assignee);
  return (
    <div className="dc-card dc-task-card">
      <div className="dc-task-top">
        <span className="dc-badge" style={{ background: p.bg, color: p.color }}>{task.priority}</span>
        <button className="dc-icon-btn tiny"><i className="fa-solid fa-ellipsis" /></button>
      </div>
      <div className="dc-task-title">{task.title}</div>
      {task.progress > 0 && (
        <div className="dc-progress-track thin">
          <div className="dc-progress-fill" style={{ width: `${task.progress}%` }} />
        </div>
      )}
      <div className="dc-task-footer">
        <span className="dc-task-assignee">
          <Avatar initials={task.assignee} color={member ? member.color : "#94A3B8"} size={26} />
        </span>
        <span className="dc-task-date"><i className="fa-regular fa-calendar" /> {task.dueDate}</span>
      </div>
    </div>
  );
}

function TaskColumn({ title, count, tasks, accent }) {
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
          tasks.map((t) => <TaskCard key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}

function TaskBoard() {
  return (
    <>
      <div className="dc-section-toolbar">
        <button className="dc-btn dc-btn-primary">
          <i className="fa-solid fa-plus" /> Add Task
        </button>
      </div>
      <div className="dc-kanban">
        <TaskColumn title="To Do" count={TASKS.todo.length} tasks={TASKS.todo} accent="#94A3B8" />
        <TaskColumn title="In Progress" count={TASKS.inProgress.length} tasks={TASKS.inProgress} accent="#2563EB" />
        <TaskColumn title="Completed" count={TASKS.completed.length} tasks={TASKS.completed} accent="#16A34A" />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FileCard + Files section                                           */
/* ------------------------------------------------------------------ */

function FileCard({ file }) {
  const meta = fileIcons[file.type] || { icon: "fa-file", color: "#64748B" };
  return (
    <div className="dc-file-row">
      <span className="dc-file-icon" style={{ color: meta.color }}>
        <i className={meta.icon.includes("fa-") && meta.icon.includes("brands") ? meta.icon : `fa-solid ${meta.icon}`} />
      </span>
      <div className="dc-file-info">
        <div className="dc-file-name">{file.name}</div>
        <div className="dc-hint">Uploaded by {file.uploadedBy} · {file.date} · {file.size}</div>
      </div>
      <div className="dc-file-actions">
        <button className="dc-icon-btn" title="Preview"><i className="fa-regular fa-eye" /></button>
        <button className="dc-icon-btn" title="Download"><i className="fa-solid fa-download" /></button>
      </div>
    </div>
  );
}

function FilesSection() {
  return (
    <div className="dc-card dc-files-card">
      <div className="dc-section-toolbar inside">
        <div className="dc-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input placeholder="Search files..." />
        </div>
        <button className="dc-btn dc-btn-primary">
          <i className="fa-solid fa-upload" /> Upload File
        </button>
      </div>
      <div className="dc-file-list">
        {FILES.map((f) => <FileCard key={f.id} file={f} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DiscussionPanel                                                     */
/* ------------------------------------------------------------------ */

function DiscussionPanel() {
  const [messages, setMessages] = useState(MESSAGES);
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), sender: "You", initials: "YO", color: "#2563EB", text: draft, time: "Now" },
    ]);
    setDraft("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="dc-card dc-discussion-card">
      <div className="dc-discussion-messages">
        {messages.map((m) => (
          <div key={m.id} className="dc-message">
            <Avatar initials={m.initials} color={m.color} size={36} />
            <div className="dc-message-body">
              <div className="dc-message-meta">
                <span className="dc-message-sender">{m.sender}</span>
                <span className="dc-message-time">{m.time}</span>
              </div>
              <div className="dc-message-bubble">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="dc-discussion-input">
        <button className="dc-icon-btn" title="Attach file"><i className="fa-solid fa-paperclip" /></button>
        <button className="dc-icon-btn" title="Emoji"><i className="fa-regular fa-face-smile" /></button>
        <input
          placeholder="Write a message..."
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
/*  ActivityTimeline                                                    */
/* ------------------------------------------------------------------ */

function ActivityTimeline() {
  return (
    <div className="dc-card dc-timeline-card">
      <ul className="dc-timeline">
        {ACTIVITY.map((a) => (
          <li key={a.id} className="dc-timeline-item">
            <span className="dc-timeline-icon" style={{ background: `${a.color}1A`, color: a.color }}>
              <i className={`fa-solid ${a.icon}`} />
            </span>
            <div className="dc-timeline-content">
              <div>{a.text}</div>
              <div className="dc-hint">{a.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WorkspaceSidebar                                                    */
/* ------------------------------------------------------------------ */

function WorkspaceSidebar() {
  const { stats } = SIDEBAR;
  return (
    <aside className="dc-sidebar">
      <div className="dc-card dc-sidebar-card">
        <h4><i className="fa-regular fa-calendar-days" /> Upcoming Deadlines</h4>
        <ul className="dc-sidebar-list">
          {SIDEBAR.deadlines.map((d, i) => (
            <li key={i}><span>{d.name}</span><span className="dc-tag">{d.date}</span></li>
          ))}
        </ul>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4><i className="fa-regular fa-bell" /> Recent Notifications</h4>
        <ul className="dc-sidebar-list">
          {SIDEBAR.notifications.map((n, i) => (
            <li key={i}><span>{n.text}</span><span className="dc-hint">{n.time}</span></li>
          ))}
        </ul>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4><i className="fa-solid fa-thumbtack" /> Pinned Notes</h4>
        <ul className="dc-sidebar-list notes">
          {SIDEBAR.pinnedNotes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4><i className="fa-solid fa-link" /> Quick Links</h4>
        <ul className="dc-sidebar-list links">
          {SIDEBAR.quickLinks.map((l, i) => (
            <li key={i}><i className={l.icon} /> {l.label}</li>
          ))}
        </ul>
      </div>

      <div className="dc-card dc-sidebar-card">
        <h4><i className="fa-solid fa-chart-simple" /> Project Statistics</h4>
        <div className="dc-stats-grid">
          <div><strong>{stats.tasksDone}/{stats.tasksTotal}</strong><span>Tasks Done</span></div>
          <div><strong>{stats.filesShared}</strong><span>Files Shared</span></div>
          <div><strong>{stats.messages}</strong><span>Messages</span></div>
          <div><strong>{MEMBERS.length}</strong><span>Members</span></div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  WorkspaceFooter                                                     */
/* ------------------------------------------------------------------ */

function WorkspaceFooter({ onInvite }) {
  return (
    <footer className="dc-footer">
      <button className="dc-btn dc-btn-primary"><i className="fa-solid fa-plus" /> Create Task</button>
      <button className="dc-btn dc-btn-secondary"><i className="fa-solid fa-upload" /> Upload File</button>
      <button className="dc-btn dc-btn-secondary"><i className="fa-solid fa-video" /> Start Meeting</button>
      <button className="dc-btn dc-btn-secondary" onClick={onInvite}><i className="fa-solid fa-user-plus" /> Invite Member</button>
      <button className="dc-btn dc-btn-ghost dc-danger"><i className="fa-solid fa-right-from-bracket" /> Leave Workspace</button>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton + empty state                                     */
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

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="dc-empty-state">
      <span className="dc-empty-icon"><i className={`fa-solid ${icon}`} /></span>
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Workspace component                                           */
/* ------------------------------------------------------------------ */

export default function Workspace() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Due date");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleInvite = () => {
    // wire this up to your real invite modal / API call
    alert("Invite member flow goes here");
  };

  const showToolbar = activeTab === "Tasks";

  return (
    <div className="dc-workspace">
      <WorkspaceHeader onInvite={handleInvite} />
      <div className="dc-tabs-sticky">
        <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="dc-body">
        <main className="dc-main">
          {showToolbar && (
            <div className="dc-section-toolbar top">
              <div className="dc-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="dc-toolbar-right">
                <div className="dc-dropdown-wrap">
                  <button className="dc-btn dc-btn-ghost" onClick={() => setFilterOpen((o) => !o)}>
                    <i className="fa-solid fa-filter" /> {filterPriority}
                  </button>
                  {filterOpen && (
                    <div className="dc-dropdown" onMouseLeave={() => setFilterOpen(false)}>
                      {["All", "High", "Medium", "Low"].map((p) => (
                        <button key={p} onClick={() => { setFilterPriority(p); setFilterOpen(false); }}>{p} Priority</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="dc-dropdown-wrap">
                  <button className="dc-btn dc-btn-ghost" onClick={() => setSortOpen((o) => !o)}>
                    <i className="fa-solid fa-arrow-down-wide-short" /> {sortBy}
                  </button>
                  {sortOpen && (
                    <div className="dc-dropdown" onMouseLeave={() => setSortOpen(false)}>
                      {["Due date", "Priority", "Assignee"].map((s) => (
                        <button key={s} onClick={() => { setSortBy(s); setSortOpen(false); }}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              {activeTab === "Overview" && <OverviewSection />}
              {activeTab === "Tasks" && <TaskBoard />}
              {activeTab === "Files" && <FilesSection />}
              {activeTab === "Discussion" && <DiscussionPanel />}
              {activeTab === "Activity" && <ActivityTimeline />}
              {activeTab === "Team" && <TeamSection onInvite={handleInvite} />}
            </>
          )}

          {/* Example of the empty state, shown only when a search yields nothing */}
          {activeTab === "Tasks" && search && !Object.values(TASKS).flat().some((t) =>
            t.title.toLowerCase().includes(search.toLowerCase())
          ) && (
            <EmptyState
              icon="fa-inbox"
              title="No tasks match your search"
              subtitle="Try a different keyword or clear your filters."
            />
          )}
        </main>

        <WorkspaceSidebar />
      </div>

      <WorkspaceFooter onInvite={handleInvite} />
    </div>
  );
}