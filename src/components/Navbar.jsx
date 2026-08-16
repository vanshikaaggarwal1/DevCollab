import React, { useState, useEffect } from 'react'
import '../CSS/Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'


const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)


    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close menu on route change
    useEffect(() => { setMenuOpen(false) }, [location])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Get user initials
    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const navLinks = [
        { label: 'Home', href: '#hero' },
        { label: 'Features', href: '#features' },
        { label: 'Projects', href: '#projects' },
        { label: 'Developers', href: '#developers' },
        { label: 'Contact', href: '#cta' },
    ]

    return (
        <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <i className="fa-solid fa-code"></i>
                    </div>
                    <span>DevCollab</span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="navbar-nav-links">
                    {navLinks.map(link => (
                        <li key={link.label}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>

                {/* Right Actions */}
                <div className="navbar-actions">
                    {user ? (
                        // ── LOGGED IN ──
                        <>


                            <Link to="/dashboard" className="nav-action-btn nav-dashboard-btn">
                                <i className="fa-solid fa-gauge-high"></i>
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/create-project" className="nav-action-btn nav-create-btn">
                                <i className="fa-solid fa-plus"></i>
                                <span>New Project</span>
                            </Link>
                            <div className="nav-avatar-wrapper">
                                <Link to="/personalprofile" className="nav-avatar" title={user.Name}>
                                    {getInitials(user.Name)}
                                </Link>
                                <div className="nav-dropdown">
                                    <div className="nav-dropdown-header">
                                        <div className="nav-dropdown-avatar">{getInitials(user.Name)}</div>
                                        <div>
                                            <p className="nav-dropdown-name">{user.Name}</p>
                                            <p className="nav-dropdown-email">{user.Email}</p>
                                        </div>
                                    </div>
                                    <div className="nav-dropdown-divider"></div>
                                    <Link to="/dashboard" className="nav-dropdown-item">
                                        <i className="fa-solid fa-gauge-high"></i> Dashboard
                                    </Link>
                                    <Link to="/editprofile" className="nav-dropdown-item">
                                        <i className="fa-regular fa-user"></i> Edit Profile
                                    </Link>
                                    <Link to="/create-project" className="nav-dropdown-item">
                                        <i className="fa-solid fa-plus"></i> New Project
                                    </Link>
                                    <div className="nav-dropdown-divider"></div>
                                    <button className="nav-dropdown-item nav-logout-item" onClick={handleLogout}>
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // ── GUEST ──
                        <>
                            <Link to="/login" className="nav-action-btn nav-login-btn">Login</Link>
                            <Link to="/signup" className="nav-action-btn nav-signup-btn">
                                Get Started <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </>
                    )}

                    {/* Hamburger */}
                    <button
                        className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
                {navLinks.map(link => (
                    <a key={link.label} href={link.href} className="nav-mobile-link">{link.label}</a>
                ))}
                <div className="nav-mobile-divider"></div>
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-mobile-link">Dashboard</Link>
                        <Link to="/editprofile" className="nav-mobile-link">Edit Profile</Link>
                        <button className="nav-mobile-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-mobile-link">Login</Link>
                        <Link to="/signup" className="nav-mobile-cta">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar