import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userType }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 overflow-hidden">
      <h2 className="text-2xl font-semibold mb-8">Tracker</h2>
      <nav>
        <ul>
          {userType === 'student' ? (
            <>
              <li className="mb-4">
                <Link to="/student-attendance" className="hover:text-gray-300">My Attendance</Link>
              </li>
              <li className="mb-4">
                <Link to="/notifications" className="hover:text-gray-300">Notifications</Link>
              </li>
              <li className="mb-4">
                <Link to="/student-profile" className="hover:text-gray-300">Profile</Link>
              </li>
              <li className="mb-4">
                <Link to="/apply-leave" className="hover:text-gray-300">Apply Leave</Link>
              </li>
              <li>
                <Link to="/logout" className="hover:text-gray-300">Logout</Link>
              </li>
            </>
          ) : userType === 'teacher' ? (
            <>
              <li className="mb-4">
                <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              </li>
              <li className="mb-4">
                <Link to="/attendance" className="hover:text-gray-300">Attendance</Link>
              </li>
              <li className="mb-4">
                <Link to="/students" className="hover:text-gray-300">Students</Link>
              </li>
              <li className="mb-4">
                <Link to="/courses" className="hover:text-gray-300">My Courses</Link>
              </li>
              <li className="mb-4">
                <Link to="/leaves" className="hover:text-gray-300">Leaves</Link>
              </li>
              <li>
                <Link to="/logout" className="hover:text-gray-300">Logout</Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
