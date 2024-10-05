import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = ({ userId }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchName, setSearchName] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [studentsData, setStudentsData] = useState([]);

  const handleCourseChange = (e) => setSelectedCourse(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleSearchChange = (e) => setSearchName(e.target.value);

  const handleSendAlert = async (student) => {
    if (student.monthlyAttendance < 75) {
      const alertData = {
        studentId: student.id,
        courseId: student.course,
        monthlyAttendance: student.monthlyAttendance,
        selectedMonth: selectedMonth,
      };
      
    const monthName = new Date(selectedMonth).toLocaleString('default', { month: 'long' });

    try {
      const response = await axios.post('http://localhost:5000/api/sendAlert', {
        ...alertData,
        selectedMonth: monthName, // Use the full month name
      });
      alert(`Alert sent to ${student.name} due to low attendance!`);
    } catch (error) {
      console.error("Error sending alert:", error);
      alert("Failed to send alert. Please try again.");
    }
  }
};

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        params: {
          course_id: selectedCourse,
          search_name: searchName,
        },
      });
      setStudentsData(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
    }
  };

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/facultyCourses', {
          params: { user_id: userId },
        });
        setCourseOptions(response.data);
      } catch (error) {
        console.error("Error fetching faculty courses", error);
      }
    };
  
    fetchCourses();
  }, [userId]);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Students</h2>

      {/* Filters */}
      <div className="mb-6 flex items-center">
        <label className="mr-4">
          Course:
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="ml-2 p-2 border rounded"
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
        </label>

        <label className="ml-6">
          Month:
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="ml-2 p-2 border rounded"
          />
        </label>

        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={handleSearchChange}
          className="ml-6 p-2 border border-gray-300 rounded"
        />

        {/* Search Button */}
        <button
          onClick={fetchStudents}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-4">Student ID</th>
              <th className="pb-4">Student Name</th>
              <th className="pb-4">% Attendance (Month)</th>
              <th className="pb-4">% Attendance (Overall)</th>
              <th className="pb-4">No. of Leaves</th>
              <th className="pb-4">Alert</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr key={student.id}>
                <td className="py-2">{student.id}</td>
                <td className="py-2">{student.name}</td>
                <td className="py-2">{student.monthlyAttendance}%</td>
                <td className="py-2">{student.overallAttendance}%</td>
                <td className="py-2">{student.leaves}</td>
                <td className="py-2">
                  {student.monthlyAttendance < 75 && (
                    <button
                      onClick={() => handleSendAlert(student)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Send Alert
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
