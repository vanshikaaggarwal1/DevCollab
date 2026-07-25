import React, { useState } from 'react'
import '../CSS/Login.css'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
    const navigate = useNavigate()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const add = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields.")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }
        setLoading(true)
        setError("")
        try {
            const userinfo = { name, email, password };
            const result = await fetch("http://localhost:5000/api/signupusers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userinfo)
            });
            const msg = await result.json();

            if (msg.statuscode === 1) {
                navigate("/login");
            } else {
                setError(msg.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        } finally {
            setLoading(false)
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') add()
    }

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo-icon"><i className="fa-solid fa-code"></i></div>
                        <span>DevCollab</span>
                    </Link>
                    <h2>Start Your Dev <span>Journey.</span></h2>
                    <p>Create your profile, join projects, and collaborate with talented developers from around the world.</p>
                    <div className="auth-features-list">
                        <div className="auth-feature-item">
                            <i className="fa-solid fa-check"></i>
                            <span>Find developer teammates</span>
                        </div>
                        <div className="auth-feature-item">
                            <i className="fa-solid fa-check"></i>
                            <span>Create and manage projects</span>
                        </div>
                        <div className="auth-feature-item">
                            <i className="fa-solid fa-check"></i>
                            <span>Build your developer portfolio</span>
                        </div>
                        <div className="auth-feature-item">
                            <i className="fa-solid fa-check"></i>
                            <span>100% free to join</span>
                        </div>
                    </div>
                </div>
                <div className="auth-orb auth-orb-1"></div>
                <div className="auth-orb auth-orb-2"></div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Create Account</h2>
                        <p>Start building amazing projects together</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <div className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <i className="fa-regular fa-user input-icon"></i>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Carter"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <div className="input-wrapper">
                                <i className="fa-regular fa-envelope input-icon"></i>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="input-toggle"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    <i className={`fa-regular fa-eye${showPassword ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            className="auth-submit-btn"
                            onClick={add}
                            disabled={loading}
                        >
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Creating account...</>
                            ) : (
                                <><i className="fa-solid fa-user-plus"></i> Create Account</>
                            )}
                        </button>

                        <p className="auth-terms">
                            By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
                        </p>
                    </div>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp