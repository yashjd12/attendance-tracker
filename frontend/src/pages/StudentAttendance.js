import React, { useState } from 'react';

// Mock data for courses; replace with real data from your API or state management
const courses = [
  { id: 'C001', name: 'Engineering Mechanics' },
  { id: 'C002', name: 'Mathematics' },
  { id: 'C003', name: 'Chemistry' },
];

const StudentAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [monthlyAttendance, setMonthlyAttendance] = useState('85');
  const [overallAttendance, setOverallAttendance] = useState('88');
  const [attendanceStatus, setAttendanceStatus] = useState('Present');

  // Function to handle course change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    // Hardcode values for now
    setMonthlyAttendance('85');
    setOverallAttendance('88');
    setAttendanceStatus('Present');
  };

  // Function to handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Function to handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-8 bg-white-100 rounded-lg shadow-lg max-w-full mx-auto h-full">
      <h2 className="text-4xl font-bold mb-8 text-gray-900">My Attendance</h2>
      <div className="mb-8 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="course" className="block text-gray-800 text-lg font-semibold mb-2">Course</label>
          <select 
            id="course" 
            value={selectedCourse} 
            onChange={handleCourseChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="month" className="block text-gray-800 text-lg font-semibold mb-2">Month</label>
          <input 
            type="month" 
            id="month" 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="date" className="block text-gray-800 text-lg font-semibold mb-2">Date</label>
          <input 
            type="date" 
            id="date" 
            value={selectedDate} 
            onChange={handleDateChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>
      <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg h-[300px] flex flex-col justify-between">
        <h3 className="text-3xl font-semibold mb-4 text-gray-900">Attendance Summary</h3>
        {selectedCourse ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-gray-800">Monthly Attendance:</span>
              <span className={`text-xl font-semibold ${parseFloat(monthlyAttendance) >= 75 ? 'text-green-700' : 'text-red-600'}`}>{monthlyAttendance}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-gray-800">Overall Attendance:</span>
              <span className={`text-xl font-semibold ${parseFloat(overallAttendance) >= 75 ? 'text-green-700' : 'text-red-600'}`}>{overallAttendance}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-gray-800">Status for Selected Date:</span>
              <span className={`text-xl font-semibold ${attendanceStatus === 'Present' ? 'text-green-700' : 'text-red-600'}`}>{attendanceStatus}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Select a course to view attendance.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
