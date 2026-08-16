import React, { useState } from 'react'
import '../CSS/SignUp.css'
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
        <div className="signup-page">
            <div className="signup-container">
                {/* Left Panel */}
                <div className="signup-left">
                    <div className="signup-left-content">
                        <Link to="/" className="signup-logo">
                            <div className="signup-logo-icon"><i className="fa-solid fa-code"></i></div>
                            <span>DevCollab</span>
                        </Link>
                        <h2>Start Your Dev <span>Journey.</span></h2>
                        <p>Create your profile, join projects, and collaborate with talented developers from around the world.</p>
                        <div className="signup-features-list">
                            <div className="signup-feature-item">
                                <i className="fa-solid fa-check"></i>
                                <span>Find developer teammates</span>
                            </div>
                            <div className="signup-feature-item">
                                <i className="fa-solid fa-check"></i>
                                <span>Create and manage projects</span>
                            </div>
                            <div className="signup-feature-item">
                                <i className="fa-solid fa-check"></i>
                                <span>Build your developer portfolio</span>
                            </div>
                            <div className="signup-feature-item">
                                <i className="fa-solid fa-check"></i>
                                <span>100% free to join</span>
                            </div>
                        </div>
                    </div>
                    <div className="signup-orb signup-orb-1"></div>
                    <div className="signup-orb signup-orb-2"></div>
                </div>

                {/* Right Panel */}
                <div className="signup-right">
                    <div className="signup-card">
                        <div className="signup-card-header">
                            <h2>Create Account</h2>
                            <p>Start building amazing projects together</p>
                        </div>

                        {error && (
                            <div className="signup-error">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {error}
                            </div>
                        )}

                        <div className="signup-form">
                            <div className="signup-form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="signup-input-wrapper">
                                    <i className="fa-regular fa-user signup-input-icon"></i>
                                    <input
                                        id="name"
                                        type="text"
                                        className="signup-input"
                                        placeholder="John Carter"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            <div className="signup-form-group">
                                <label htmlFor="email">Email address</label>
                                <div className="signup-input-wrapper">
                                    <i className="fa-regular fa-envelope signup-input-icon"></i>
                                    <input
                                        id="email"
                                        type="email"
                                        className="signup-input"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="signup-form-group">
                                <label htmlFor="password">Password</label>
                                <div className="signup-input-wrapper">
                                    <i className="fa-solid fa-lock signup-input-icon"></i>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="signup-input"
                                        placeholder="Min. 6 characters"
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="signup-input-toggle"
                                        onClick={() => setShowPassword(v => !v)}
                                    >
                                        <i className={`fa-regular fa-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                className="signup-submit-btn"
                                onClick={add}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Creating account...</>
                                ) : (
                                    <><i className="fa-solid fa-user-plus"></i> Create Account</>
                                )}
                            </button>

                            <p className="signup-terms">
                                By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
                            </p>
                        </div>

                        <div className="signup-footer">
                            <p>Already have an account? <Link to="/login">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp