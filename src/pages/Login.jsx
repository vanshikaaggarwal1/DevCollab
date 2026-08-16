import React, { useState } from 'react';
import '../CSS/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const userlogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
            });
            const msg = response.data;

            if (msg.statuscode === 1) {
                login(msg.user);
                navigate("/dashboard");
            } else {
                setError(msg.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to connect to the server. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') userlogin();
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Panel */}
                <div className="login-left">
                    <div className="login-left-content">
                        <Link to="/" className="login-logo">
                            <div className="login-logo-icon"><i className="fa-solid fa-code"></i></div>
                            <span>DevCollab</span>
                        </Link>
                        <h2>Connect. Build. <span>Grow.</span></h2>
                        <p>Join thousands of developers collaborating on real-world projects and building the future together.</p>
                        <div className="login-stats">
                            <div className="login-stat"><h3>10K+</h3><p>Developers</p></div>
                            <div className="login-stat"><h3>2.5K+</h3><p>Projects</p></div>
                            <div className="login-stat"><h3>98%</h3><p>Satisfaction</p></div>
                        </div>
                    </div>
                    <div className="login-orb login-orb-1"></div>
                    <div className="login-orb login-orb-2"></div>
                </div>

                {/* Right Panel */}
                <div className="login-right">
                    <div className="login-card">
                        <div className="login-card-header">
                            <h2>Welcome back</h2>
                            <p>Sign in to your developer workspace</p>
                        </div>

                        {error && (
                            <div className="login-error">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {error}
                            </div>
                        )}

                        <div className="login-form">
                            <div className="login-form-group">
                                <label htmlFor="email">Email address</label>
                                <div className="login-input-wrapper">
                                    <i className="fa-regular fa-envelope login-input-icon"></i>
                                    <input
                                        id="email"
                                        type="email"
                                        className="login-input"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <div className="login-label-wrapper">
                                    <label htmlFor="password">Password</label>
                                    <span className="login-forgot-password">Forgot password?</span>
                                </div>
                                <div className="login-input-wrapper">
                                    <i className="fa-solid fa-lock login-input-icon"></i>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="login-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="login-input-toggle"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        <i className={`fa-regular fa-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                className="login-submit-btn"
                                onClick={userlogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
                                ) : (
                                    <><i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In</>
                                )}
                            </button>
                        </div>

                        <div className="login-footer">
                            <p>New to DevCollab? <Link to="/signup">Create a free account</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;