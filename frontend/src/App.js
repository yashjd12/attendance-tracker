import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import Leaves from './pages/Leaves';
import Logout from './pages/Logout';
import StudentAttendance from './pages/StudentAttendance';
import Notification from './pages/Notification';
import ApplyLeave from './pages/ApplyLeave';
import StudentProfile from './pages/StudentProfile';

function App() {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.role);
        setUserId(decoded.id); 
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (type, userId) => {
    setUserType(type); 
    setUserId(userId);
  };

  const handleLogout = () => {
    setUserType(null);
    setUserId(null);
    localStorage.removeItem('token'); 
  };

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    let decoded;
    if (token) {
      try {
        decoded = jwtDecode(token);
        setUserType(decoded.role);
        setUserId(decoded.id); 
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('token');
      }
    }
    return decoded?.id ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {userType && <Sidebar userType={userType} />}
        <div 
          className="flex-1 p-4 overflow-hidden"
          style={{ 
            background: 'linear-gradient(to right, #FFFFFF, #D7E1EC)' 
          }}
        >
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard userId={userId} />} />} />
            <Route path="/attendance" element={<PrivateRoute element={<Attendance userId={userId} />} />} />
            <Route path="/students" element={<PrivateRoute element={<Students userId={userId} />} />} />
            <Route path="/courses" element={<PrivateRoute element={<Courses userId={userId} />} />} />
            <Route path="/leaves" element={<PrivateRoute element={<Leaves userId={userId} />} />} />
            <Route path="/notifications" element={<PrivateRoute element={<Notification userId={userId} />} />} />
            <Route path="/apply-leave" element={<PrivateRoute element={<ApplyLeave userId={userId} />} />} />
            <Route path="/student-profile" element={<PrivateRoute element={<StudentProfile userId={userId} />} />} />
            <Route path="/student-attendance" element={<PrivateRoute element={<StudentAttendance userId={userId} />} />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
