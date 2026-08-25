import React, { useState } from 'react';
import '../CSS/Hero.css';
import '../CSS/Features.css';
import '../CSS/Projects.css';
import '../CSS/Developers.css';
import '../CSS/CTA.css';
import ProfilePreview from './ProfilePreview';
import JoinProjectModal from "../pages/JoinProjectModal";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';




const Hero = () => {


    const { user } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        getDevelopers();
    }, []);

    const getDevelopers = async () => {
        try {

            const res = await axios.get(
                "http://localhost:5000/api/user/all"
            );

            if (res.data.statuscode === 1) {
                setDevelopers(res.data.users);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const showToast = (msg, type = 'info') => {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-info'}"></i><span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    };

    if (user) {
        return <MemberHero user={user} navigate={navigate} showToast={showToast} developers={developers} />;
    }

    return (
        <GuestHero
            developers={developers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            navigate={navigate}
            showToast={showToast}
        />
    );
};

/* ────────────────────────────
   MEMBER HERO (Logged In)
──────────────────────────── */
const MemberHero = ({ user, navigate, showToast, developers }) => {

    const [stats, setStats] = useState({
        projects: 0,
        connections: 0,
        messages: 0,
        notifications: 0
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        getDashboard();
        fetchStats();
        fetchActivity();

    }, []);

    const getDashboard = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/user/${user._id}`
            );

            if (res.data.statuscode === 1) {

                // setStats(res.data.stats);
                // setActivities(res.data.activities);

            }

        }
        catch (err) {
            console.log(err);
        }
    }
    const fetchStats = async () => {

        const projectRes = await axios.get(
            `http://localhost:5000/api/projects/${user._id}`
        );

        const notificationRes = await axios.get(
            `http://localhost:5000/api/notification/${user._id}`
        );

        const connectionRes = await axios.get(
            `http://localhost:5000/api/connection/connections/${user._id}`
        );


        setStats({
            projects: projectRes.data.projects.length,
            connections: connectionRes.data.connections.length,
            notifications: notificationRes.data.notifications.length,
            messages: 0
        });
    };

    const fetchActivity = async () => {
        try {

            const res = await axios.get(
                `http://localhost:5000/api/notification/${user._id}`
            );

            if (res.data.statuscode === 1) {

                const activity = res.data.notifications.map((notification) => ({

                    type: notification.type,
                    text: notification.message,
                    time: new Date(notification.createdAt).toLocaleString()

                }));

                setActivities(activity);

            }

        } catch (err) {
            console.log(err);
        }
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    const quickActions = [
        { icon: 'fa-gauge-high', label: 'My Dashboard', desc: 'View your stats & activity', route: '/dashboard', color: 'primary' },
        { icon: 'fa-plus', label: 'Create Project', desc: 'Start a new collaboration', route: '/create-project', color: 'accent' },
        { icon: 'fa-user-group', label: 'Browse Devs', desc: 'Find your next teammate', href: '#developers', color: 'success' },
        { icon: 'fa-user-pen', label: 'Edit Profile', desc: 'Update your developer profile', route: '/editprofile', color: 'warning' },
    ];

    const getActivityIcon = (type) => {

        switch (type) {

            case "connection_request":
                return "fa-user-plus";

            case "project_created":
                return "fa-code";

            case "project_join":
                return "fa-code-branch";

            case "message":
                return "fa-comment";

            case "notification":
                return "fa-bell";

            default:
                return "fa-circle";
        }

    }

    return (
        <>
            {/* Member Hero Banner */}
            <section id="hero" className="member-hero">
                {/* Animated background orbs */}
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
                <div className="hero-orb hero-orb-3"></div>

                <div className="member-hero-content">
                    {/* Greeting */}
                    <div className="member-greeting">
                        <div className="member-avatar-large">{getInitials(user.Name)}</div>
                        <div className="member-greeting-text">
                            <div className="member-badge">
                                <span className="glow-dot"></span>
                                Member
                            </div>
                            <h1>Welcome back, <span className="gradient-text">{user.Name?.split(' ')[0]}!</span></h1>
                            <p>Ready to build something amazing today? Your community is waiting.</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="member-quick-actions">
                        {quickActions.map((action, i) => (
                            <div
                                key={i}
                                className={`quick-action-card quick-action-${action.color}`}
                                onClick={() => action.route ? navigate(action.route) : document.querySelector(action.href)?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <div className="quick-action-icon">
                                    <i className={`fa-solid ${action.icon}`}></i>
                                </div>
                                <div>
                                    <h3>{action.label}</h3>
                                    <p>{action.desc}</p>
                                </div>
                                <i className="fa-solid fa-chevron-right quick-action-arrow"></i>
                            </div>
                        ))}
                    </div>

                    {/* Stats + Activity Row */}
                    <div className="member-bottom-row">
                        {/* Mini Stats */}
                        <div className="member-mini-stats">
                            <h2>Your Stats</h2>
                            <div className="mini-stats-grid">
                                <div className="mini-stat">
                                    <i className="fa-solid fa-briefcase"></i>
                                    <span className="mini-stat-num">{stats.projects}</span>
                                    <span className="mini-stat-label">Projects</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-user-group"></i>
                                    <span className="mini-stat-num">{stats.connections}</span>
                                    <span className="mini-stat-label">Connections</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-code-commit"></i>
                                    <span className="mini-stat-num">{stats.messages}</span>
                                    <span className="mini-stat-label">Messages</span>
                                </div>
                                <div className="mini-stat">
                                    <i className="fa-solid fa-bell"></i>
                                    <span className="mini-stat-num">{stats.notifications}</span>
                                    <span className="mini-stat-label">Notifications</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="member-activity">
                            <h2>Recent Activity</h2>
                            <ul className="activity-list">

                                {activities.length === 0 ? (

                                    <li className="activity-empty">
                                        No recent activity.
                                    </li>

                                ) : (

                                    activities.map((item, index) => (

                                        <li
                                            key={index}
                                            className={`activity-item activity-${item.type}`}
                                        >

                                            <div className="activity-icon">
                                                <i className={`fa-solid ${getActivityIcon(item.type)}`}></i>
                                            </div>

                                            <div className="activity-content">
                                                <p>{item.text}</p>
                                                <span>{item.time}</span>
                                            </div>

                                        </li>

                                    ))

                                )}

                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shared sections below */}
            <SharedSections showToast={showToast} developers={developers} />
        </>
    );
};

/* ────────────────────────────
   GUEST HERO
──────────────────────────── */
const GuestHero = ({ developers, selectedUser, setSelectedUser, navigate, showToast }) => {
    return (
        <>
            <section id="hero" className="guest-hero">
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
                <div className="hero-orb hero-orb-3"></div>

                <div className="hero-left">
                    <div className="hero-badge">
                        <i className="fa-solid fa-bolt"></i>
                        Developer Collaboration Platform
                    </div>

                    <h1>
                        Build Amazing<br />
                        <span className="gradient-text">Projects Together</span>
                    </h1>

                    <p>
                        DevCollab is where developers connect, collaborate, and ship real‑world projects.
                        Find your perfect teammates, showcase your skills, and grow your career.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/signup">
                            <button className="primary-btn">
                                Get Started Free <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </Link>
                        <a href="#developers">
                            <button className="secondary-btn">
                                <i className="fa-solid fa-user-group"></i> Browse Developers
                            </button>
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <h2>10K<span>+</span></h2>
                            <p>Developers</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <h2>2.5K<span>+</span></h2>
                            <p>Projects</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <h2>98<span>%</span></h2>
                            <p>Satisfaction</p>
                        </div>
                    </div>
                </div>


                <div className="hero-right">
                    <div className='hero-image'><img src="https://www.sinequa.com/wp-content/uploads/2023/08/blog-understanding-the-digital-workplace-5-questions-and-answers-1200.jpg" alt="Developers Collaborating" />
                        <div className="code-window">
                            <div className="window-top">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                                <span className="window-filename">
                                    <i className="fa-regular fa-file-code"></i> project.js
                                </span>
                            </div>
                            <div className="code">
                                <p><span className="kw">const</span> project = &#123;</p>
                                <p>&nbsp;&nbsp;name: <span className="string">"DevCollab"</span>,</p>
                                <p>&nbsp;&nbsp;team: <span className="arr">["Frontend", "Backend", "Design"]</span>,</p>
                                {/* <p>&nbsp;&nbsp;status: <span className="string">"Building..."</span>,</p> */}
                                <p>&nbsp;&nbsp;openSource: <span className="bool">true</span>,</p>
                                {/* <p>&nbsp;&nbsp;stars: <span className="num">10240</span></p> */}
                                <p>&#125;;</p>
                                <p className="code-cursor"><span className="kw">await</span> devCollab.<span className="fn">launch</span>()<span className="blink">|</span></p>
                            </div>
                        </div>


                        <div className="floating-card developer">
                            <div className="floating-avatar" style={{background : '#071739'}}>R</div>
                            <div>
                                <p>Rahul • MERN Dev</p>
                                <span className="floating-status"><span className="glow-dot" style={{ width: 5, height: 5 }}></span> Available</span>
                            </div>
                        </div>

                        <div className="floating-card designer">
                            <div className="floating-avatar" style={{background : '#071739'}}>S</div>
                            <div>
                                <p>Sarah • UI/UX Designer</p>
                                <span className="floating-status"><span className="glow-dot" style={{ width: 5, height: 5 }}></span> Building</span>
                            </div>
                        </div>

                        <div className="floating-card backend">
                            <div className="floating-avatar" style={{background : '#071739'}}>A</div>
                            <div>
                                <p>Alex • Backend Eng.</p>
                                <span className="floating-status"><span className="glow-dot" style={{ width: 5, height: 5 }}></span> Coding</span>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </section>

            <SharedSections showToast={showToast} developers={developers} />

            {selectedUser && (
                <ProfilePreview
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </>
    );
};

/* ────────────────────────────
   SHARED SECTIONS (Features, Projects, Devs, CTA)
──────────────────────────── */
const SharedSections = ({ showToast, developers }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);
    const [developerSearch, setDeveloperSearch] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        getProjects()
    }, []);

    // const handleJoinProject = (projectName) => {
    //     if (!user) {
    //         navigate('/login');
    //     } else {
    //         showToast(`Joined "${projectName}" successfully!`, 'success');
    //     }
    // };

    const getProjects = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects`);
            setProjects(res.data.projects);
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoinProject = async (project = selectedProject) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!project) return;

        try {
            await axios.put(
                `http://localhost:5000/api/projects/join/${project._id}`,
                {
                    userId: user._id,
                }
            );

            showToast(`Joined "${project.title}" successfully!`, "success");

            setShowJoinModal(false);

            getProjects(); // Refresh the project list
        } catch (err) {
            console.log(err);
            showToast("Failed to join project.", "error");
        }
    };

    return (
        <>
            {/* ── FEATURES ── */}
            <section id="features">
                <div className="feature-heading">
                    <div className="section-badge">Why DevCollab?</div>
                    <h2>Everything You Need to <span>Collaborate</span></h2>
                    <p>A complete ecosystem for developers to connect, build, and grow their careers through real projects.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
                        <div className="feature-icon-wrapper primary">
                            <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div className="feature-badge">Most Popular</div>
                        <h3>Find Developers</h3>
                        <p>Discover talented frontend, backend, full-stack, AI, and mobile developers worldwide.</p>
                        <div className="feature-link">Explore now <i className="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div className="feature-card" onClick={() => navigate(user ? '/create-project' : 'signup')}>
                        <div className="feature-icon-wrapper accent">
                            <i className="fa-solid fa-code"></i>
                        </div>
                        <h3>Create Projects</h3>
                        <p>Start your own project and invite developers with the exact skills your idea needs.</p>
                        <div className="feature-link">Create now <i className="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div className="feature-card" onClick={() => navigate('/signup')}>
                        <div className="feature-icon-wrapper success">
                            <i className="fa-solid fa-comments"></i>
                        </div>
                        <h3>Collaborate</h3>
                        <p>Discuss ideas, assign tasks, and build incredible things with your dream team.</p>
                        <div className="feature-link">Learn more <i className="fa-solid fa-arrow-right"></i></div>
                    </div>

                    <div className="feature-card" onClick={() => navigate('/signup')}>
                        <div className="feature-icon-wrapper warning">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <h3>Grow Your Career</h3>
                        <p>Build a stunning portfolio with real-world projects that employers actually want to see.</p>
                        <div className="feature-link">Get started <i className="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div>
            </section>

            {/* ── PROJECTS ── */}
            <section id="projects">
                <div className="projects-heading">
                    <div className="section-badge">Open Projects</div>
                    <h2>Trending <span>Projects</span></h2>
                    <p>Join exciting projects and collaborate with talented developers around the world.</p>
                </div>

                <div className="project-grid">
                    {projects.map((proj) => (
                        <div className="project-card" key={proj._id}>
                            <div className="project-card-header">
                                <span
                                    className={`project-tag ${proj.status === "Hiring"
                                        ? "tag-hiring"
                                        : proj.status === "Open"
                                            ? "tag-open"
                                            : "tag-new"
                                        }`}
                                >
                                    {proj.status}
                                </span>

                                <span className="project-members">
                                    <i className="fa-solid fa-user-group"></i>{" "}
                                    {proj.members?.length || 0} members
                                </span>
                            </div>

                            <div className="project-card-body">
                                <h3>{proj.title}</h3>

                                <p>{proj.description}</p>

                                <div className="tech-stack">
                                    {proj.techStack?.map((tech, index) => (
                                        <span key={index}>{tech}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="project-card-footer">
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate("/login");
                                            return;
                                        }

                                        setSelectedProject(proj);
                                        setShowJoinModal(true);
                                    }}
                                >
                                    <i className="fa-solid fa-plus"></i> Join Project
                                </button>
                            </div>
                        </div>
                    ))}
                    <JoinProjectModal
                        isOpen={showJoinModal}
                        project={selectedProject}
                        onClose={() => setShowJoinModal(false)}
                        onConfirm={handleJoinProject}
                    />
                </div>
            </section>

            {/* ── DEVELOPERS ── */}
            <section id="developers">
                <div className="developers-heading">
                    <div className="section-badge">Community</div>
                    <h2>Meet Our <span>Developers</span></h2>
                    <p>Connect with skilled developers and start building amazing things together.</p>
                </div>

                <div className="developer-grid">
                    {developers
                        .filter(dev => dev._id !== user?._id)
                        .slice(0, 3)
                        .map(dev => (
                            <div className="developer-card" key={dev._id}>
                                <div className="developer-avatar-wrapper">
                                    <img
                                        src={dev.Image
                                            ? `http://localhost:5000${dev.Image}`
                                            : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"}
                                        alt={dev.Name}
                                    />

                                    <div className="online-badge"></div>
                                </div>

                                <h3>{dev.Name}</h3>

                                <h5>{dev.Role}</h5>

                                <p className="dev-location">
                                    <i className="fa-solid fa-location-dot"></i>
                                    {" "}
                                    {dev.Location}
                                </p>

                                <div className="skills">
                                    {dev.Skills?.map((skill, idx) => (
                                        <span key={idx}>{skill}</span>
                                    ))}
                                </div>

                                <button onClick={() => setSelectedUser(dev)}>
                                    <i className="fa-regular fa-eye"></i>
                                    {" "}View Profile
                                </button>
                            </div>
                        ))}
                </div>
                <div className="show-more-container">
                    <button
                        className='show-more-developers'
                        onClick={() => setShowDeveloperPanel(true)}
                    >
                        Show More <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </section>
            {/* ── CTA ── */}
            <section id="cta">
                <div className="cta-glow"></div>
                <div className="cta-content">
                    <div className="section-badge light">Join the Community</div>
                    <h2>Ready to Build Something <span>Amazing?</span></h2>
                    <p>
                        Join thousands of developers collaborating on real-world projects,
                        leveling up their skills, and building the future together.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/signup">
                            <button className="primary-btn">
                                Get Started Free <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </Link>
                        <a href="#projects">
                            <button className="secondary-btn">
                                <i className="fa-solid fa-compass"></i> Explore Projects
                            </button>
                        </a>
                    </div>
                    <div className="cta-social-proof">
                        <div className="cta-avatars">
                            {[12, 20, 33, 44, 55].map(n => (
                                <img key={n} src={`https://i.pravatar.cc/36?img=${n}`} alt="member" />
                            ))}
                        </div>
                        <p><strong>10,000+</strong> developers already building</p>
                    </div>
                </div>
            </section>

            {selectedUser && (
                <ProfilePreview
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}

            {showDeveloperPanel && (
                <div className="developer-panel-overlay">

                    <div className="developer-panel">

                        <div className="developer-panel-header">
                            <h2>Developers</h2>

                            <button onClick={() => setShowDeveloperPanel(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="developer-search">
                            <input
                                type="text"
                                placeholder="Search developers..."
                                value={developerSearch}
                                onChange={(e) => setDeveloperSearch(e.target.value)}
                            />
                        </div>

                        <div className="developer-list">

                            {developers
                                .filter(dev =>
                                    dev.Name.toLowerCase().includes(
                                        developerSearch.toLowerCase()
                                    )
                                )
                                .map(dev => (

                                    <div className="developer-item" key={dev._id}>

                                        <div className="developer-item-left">

                                            <img
                                                src={
                                                    dev.Image
                                                        ? `http://localhost:5000${dev.Image}`
                                                        : "https://cdn-icons-png.magnific.com/256/11461/11461169.png?semt=ais_white_label"
                                                }
                                                alt={dev.Name}
                                            />

                                            <div className='dev-info'>
                                                <h4>{dev.Name}</h4>
                                                <p>{dev.Role}</p>
                                            </div>

                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedUser(dev);
                                                setShowDeveloperPanel(false);
                                            }}
                                        >
                                            View Profile
                                        </button>

                                    </div>

                                ))}

                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default Hero;