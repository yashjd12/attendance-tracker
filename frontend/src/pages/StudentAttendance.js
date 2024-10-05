import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [monthlyAttendance, setMonthlyAttendance] = useState('');
  const [overallAttendance, setOverallAttendance] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if(userId){
          const response = await axios.get(`http://localhost:5000/api/courses/${userId}`);
          console.log("Courses response", response.data);
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userId]);

  // Function to handle course change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Function to handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Function to handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to handle search button click
  const handleSearch = async () => {
    if (!selectedCourse || !selectedMonth || !selectedDate) {
      alert('Please select a course, month, and date.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/student/attendance', {
        userId,
        courseId: selectedCourse,
        month: selectedMonth,
        date: selectedDate,
      });
  
      const { monthlyAttendance, overallAttendance, attendanceStatus } = response.data;
      setMonthlyAttendance(monthlyAttendance);
      setOverallAttendance(overallAttendance);
      setAttendanceStatus(attendanceStatus);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };
  

  return (
    <div className="p-8 bg-white-100 rounded-lg shadow-lg max-w-full mx-auto h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-900">My Attendance</h2>
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
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
              <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
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
