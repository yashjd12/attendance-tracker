import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import the jwt-decode library
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import Signup component
import Courses from './pages/Courses';
import Leaves from './pages/Leaves';
import Logout from './pages/Logout';
import StudentAttendance from './pages/StudentAttendance';
import Notification from './pages/Notification';
import ApplyLeave from './pages/ApplyLeave';
import StudentProfile from './pages/StudentProfile';

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeToken(token); // Decode the token to get user type
        setUserType(decoded.role); // Set user type
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    }
  }, []);

  const handleLogin = (type) => {
    setUserType(type); // Set user type upon login
  };

  const handleLogout = () => {
    setUserType(null); // Reset user type upon logout
    localStorage.removeItem('token'); 
  };

  const PrivateRoute = ({ element }) => {
    return userType ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {userType && <Sidebar userType={userType} />} {/* Render sidebar if userType exists */}
        <div 
          className="flex-1 p-4 overflow-hidden"
          style={{ 
            background: 'linear-gradient(to right, #FFFFFF, #D7E1EC)' 
          }}
        >
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} /> {/* Add Signup Route */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/attendance" element={<PrivateRoute element={<Attendance />} />} />
            <Route path="/students" element={<PrivateRoute element={<Students />} />} />
            <Route path="/courses" element={<PrivateRoute element={<Courses />} />} />
            <Route path="/leaves" element={<PrivateRoute element={<Leaves />} />} />
            <Route path="/notifications" element={<PrivateRoute element={<Notification />} />} />
            <Route path="/apply-leave" element={<PrivateRoute element={<ApplyLeave />} />} />
            <Route path="/student-profile" element={<PrivateRoute element={<StudentProfile />} />} />
            <Route path="/student-attendance" element={<PrivateRoute element={<StudentAttendance />} />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

// Function to decode the JWT token
function decodeToken(token) {
  try {
    const decoded = jwtDecode(token); // Decode the token using jwt-decode
    return decoded; // Return the decoded payload
  } catch (error) {
    console.error('Failed to decode token:', error);
    throw error;
  }
}
