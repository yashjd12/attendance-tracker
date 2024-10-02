import React, { useState } from 'react';
import Lottie from 'lottie-react';
import UserAnimation from '../Animations/UserAnimation.json'; // Path to your animation JSON file

const initialProfile = {
  id: 'S001',
  name: 'Hardik Pandya',
  email: 'hardik.pandya@example.com',
  enrollmentYear: '2020',
  studentID: 'S001'
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      name,
      email
    }));
    setIsEditing(false);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-5xl font-bold mb-8 text-gray-800">My Profile</h2>

      {/* Profile Icon and Student ID */}
      <div className="flex flex-col items-center mb-8">
        {/* Lottie Animation */}
        <div className="w-40 h-40 mb-4">
          <Lottie 
            animationData={UserAnimation}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
            speed={0.1}  // Adjust the speed here (0.5 is half speed)
          />
        </div>
        <p className="text-xl font-semibold text-gray-700">Student ID: {profile.studentID}</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          ) : (
            <p className="mt-1 text-lg font-semibold text-gray-800">{profile.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          ) : (
            <p className="mt-1 text-lg font-semibold text-gray-800">{profile.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enrollment Year:</label>
          <p className="mt-1 text-lg font-semibold text-gray-800">{profile.enrollmentYear}</p>
        </div>

        {/* Edit and Save Button */}
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
