import React, { useContext, useState } from 'react'
import '../CSS/Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { Logincontext } from './context'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)



    const[userid,setuserid]=useContext(Logincontext)
    const userlogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.")
            return
        }
        setLoading(true)
        setError("")
        try {
            const users = { email, password };
            const result = await fetch("http://localhost:5000/api/loginusers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(users)
            });
            const msg = await result.json();

            if (msg.statuscode === 1) {
                login(msg.user);
                setuserid(msg.user._id)
                navigate("/dashboard");
            } else {
                setError(msg.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') userlogin()
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
                    <h2>Connect. Build. <span>Grow.</span></h2>
                    <p>Join thousands of developers collaborating on real-world projects and building the future together.</p>
                    <div className="auth-stats">
                        <div className="auth-stat"><h3>10K+</h3><p>Developers</p></div>
                        <div className="auth-stat"><h3>2.5K+</h3><p>Projects</p></div>
                        <div className="auth-stat"><h3>98%</h3><p>Satisfaction</p></div>
                    </div>
                </div>
                <div className="auth-orb auth-orb-1"></div>
                <div className="auth-orb auth-orb-2"></div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your developer workspace</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <div className="auth-form">
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
                            <div className="label-wrapper">
                                <label htmlFor="password">Password</label>
                                <span className="forgot-password">Forgot password?</span>
                            </div>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="current-password"
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

                    <div className="auth-footer">
                        <p>New to DevCollab? <Link to="/signup">Create a free account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login