import Navbar from './components/Navbar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import CreateProject from './pages/CreateProject'
import EditProfile from './pages/EditProfile'
import { AuthProvider } from './Context/AuthContext'
import Projects from './pages/Projects'
import Connections from './pages/Connection'
import Notification from './pages/Notification'
import PersonalProfile from './pages/PersonalProfile'
import { Logincontext } from './pages/context'
import { useEffect, useState } from 'react'
import CollaborationHub from './pages/CollaborationHub'
import Workspace from './pages/Workspace'


function App() {


const[userid,setuserid]=useState("")


useEffect(()=>{
let id=JSON.parse(localStorage.getItem("user"))
if(id){
setuserid(id._id)
}

},[])


  return (
    <AuthProvider>
      <BrowserRouter>

      <Logincontext.Provider value={[userid,setuserid]}>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/connection" element={<Connections />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path='/personalprofile' element={<PersonalProfile/>}/>
          <Route path='/collaboration' element={<CollaborationHub/>}/>
          <Route path='/workspace' element={<Workspace/>}/>
        </Routes>
        </Logincontext.Provider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
