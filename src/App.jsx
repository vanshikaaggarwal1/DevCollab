import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import CreateProject from './pages/CreateProject';
import EditProfile from './pages/EditProfile';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Projects from './pages/Projects';
import Connections from './pages/Connection';
import Notification from './pages/Notification';
import PersonalProfile from './pages/PersonalProfile';
import CollaborationHub from './pages/CollaborationHub';
import Workspace from './pages/Workspace';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editprofile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personalprofile"
            element={
              <ProtectedRoute>
                <PersonalProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connection"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:id"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />

          {/* Public / Semi-Public Routes */}
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/collaboration" element={<CollaborationHub />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
