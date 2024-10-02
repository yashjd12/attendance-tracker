import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        onLogin(data.role, data.id);
        localStorage.setItem('token', data.token);

        if (data.role === 'student') {
          navigate('/student-attendance'); // Redirect to student's page
        } else if (data.role === 'faculty') {
          navigate('/dashboard'); // Redirect to teacher's dashboard
        }
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{ 
        background: 'linear-gradient(to right, #FFFFFF, #D7E1EC)' 
      }}
    >
      <div className="bg-white p-12 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/signup')} 
            className="text-blue-600 hover:underline"
          >
            Don't have an account? Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
