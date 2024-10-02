import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout(); // Call the logout function to clear userType
    navigate('/login'); // Redirect to login page
  }, [onLogout, navigate]);

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{ 
        background: 'linear-gradient(to right, #FFFFFF, #D7E1EC)' 
      }}
    >
      <div className="bg-white p-12 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Logging Out...</h2>
      </div>
    </div>
  );
};

export default Logout;
