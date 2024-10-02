import React, { useState } from 'react';

const Students = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchName, setSearchName] = useState('');
  
  const courseOptions = [
    { value: 'mechanics', label: 'Engineering Mechanics' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    // Add more courses as needed
  ];

  const studentsData = [
    { id: 'S001', name: 'Hardik Pandya', monthlyAttendance: 60, overallAttendance: 80, leaves: 9, course: 'mechanics' },
    { id: 'S002', name: 'Rohit Sharma', monthlyAttendance: 85, overallAttendance: 90, leaves: 3, course: 'mathematics' },
    { id: 'S003', name: 'Virat Kohli', monthlyAttendance: 72, overallAttendance: 88, leaves: 7, course: 'physics' },
    { id: 'S004', name: 'Shubman Gill', monthlyAttendance: 95, overallAttendance: 95, leaves: 1, course: 'mechanics' },
    // Add more students as needed
  ];

  const handleCourseChange = (e) => setSelectedCourse(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleSearchChange = (e) => setSearchName(e.target.value);

  const handleSendAlert = (student) => {
    if (student.monthlyAttendance < 75) {
      alert(`Alert sent to ${student.name} due to low attendance!`);
    }
  };

  const filteredStudents = studentsData.filter((student) => {
    return (
      (!selectedCourse || student.course === selectedCourse) &&
      (!searchName || student.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!selectedMonth || true) // You can add more logic here to filter based on month if applicable.
    );
  });

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Students</h2>

      {/* Filters */}
      <div className="mb-6">
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
            {filteredStudents.map((student) => (
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
