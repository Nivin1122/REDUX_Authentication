import { useState } from 'react'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'
import Admin_Home from './pages/Admin_Home'


function Logout(){
  localStorage.clear()
  return <Navigate to={"/login"}/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path='/'
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<RegisterAndLogout/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin_home" element={<Admin_Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
