import React from "react";
import "../CSS/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-section footer-brand">
                    <Link to="/" className="footer-logo">
                        <div className="footer-logo-icon">
                            <i className="fa-solid fa-code"></i>
                        </div>
                        <span>DevCollab</span>
                    </Link>
                    <p>
                        Connect with developers, build amazing projects,
                        and grow your career through meaningful collaboration.
                    </p>
                    <div className="social-icons">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                            <i className="fa-brands fa-github"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Discord">
                            <i className="fa-brands fa-discord"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Platform</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="/#developers">Browse Developers</a></li>
                        <li><a href="/#projects">Projects</a></li>
                        <li><Link to="/create-project">Create Project</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-section">
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-section">
                    <h3>Contact</h3>
                    <ul className="footer-contact">
                        <li>
                            <a href="mailto:support@devcollab.com">
                                <i className="fa-solid fa-envelope"></i>
                                support@devcollab.com
                            </a>
                        </li>
                        <li>
                            <a href="tel:+919876543210">
                                <i className="fa-solid fa-phone"></i>
                                +91 98765 43210
                            </a>
                        </li>
                        <li>
                            <span>
                                <i className="fa-solid fa-location-dot"></i>
                                India
                            </span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 DevCollab. All Rights Reserved. Made with <i className="fa-solid fa-heart" style={{ color: '#ff4d6d', margin: '0 3px' }}></i> for developers.</p>
            </div>
        </footer>
    );
};

export default Footer;