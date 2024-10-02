import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Leaves from './pages/Leaves';
import Logout from './pages/Logout'
import StudentAttendance from './pages/StudentAttendance'
import Notification from './pages/Notification';
import ApplyLeave from './pages/ApplyLeave';
import StudentProfile from './pages/StudentProfile';

function App() {
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
  };

  const handleLogout = () => {
    setUserType(null); // Clear the userType to hide the sidebar
  };

  const PrivateRoute = ({ element }) => {
    return userType ? element : <Navigate to="/login" />;
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
