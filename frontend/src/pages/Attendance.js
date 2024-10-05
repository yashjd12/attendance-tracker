import React, { useState, useEffect, useRef } from 'react';
import Filter from '../components/Filter';
import axios from 'axios';

const Attendance = ({ userId }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);

  const rowRefs = useRef([]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleAttendanceChange = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].is_present = !updatedStudents[index].is_present;
    setStudents(updatedStudents);
  };

  const handleSave = () => {
    console.log('Submit button clicked');
    
    const attendanceData = {
      course_id: selectedCourse,
      attendance_date: selectedDate,
      attendance_data: students.map(student => ({
        id: student.id,
        is_present: student.is_present,
      })),
    };
    axios.post('http://localhost:5000/api/attendance', attendanceData)
      .then(response => {
        alert('Attendance Saved Successfully');
      })
      .catch(error => {
        console.error('Error saving attendance:', error);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setCurrentRow((prev) => {
        const nextRow = prev + 1;
        return nextRow < students.length ? nextRow : prev;
      });
    } else if (event.key === "ArrowUp") {
      setCurrentRow((prev) => {
        const prevRow = prev - 1;
        return prevRow >= 0 ? prevRow : prev;
      });
    } else if (event.key === " ") {
      handleAttendanceChange(currentRow);
    }
  };

  // Fetch faculty courses on userId change
  useEffect(() => {
    if (userId) {
      axios.get('http://localhost:5000/api/facultyCourses', {
        params: { user_id: userId }
      })
      .then((response) => {
        setCourseOptions(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching faculty courses", error);
      });
    }
  }, [userId]);

  // Fetch students and their attendance on course and date selection
  useEffect(() => {
    if (selectedCourse && selectedDate) {
      axios.get('http://localhost:5000/api/attendance', {
        params: { course_id: selectedCourse, attendance_date: selectedDate }
      })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance data", error);
      });
    }
  }, [selectedCourse, selectedDate]);

  // Calculate total present count
  useEffect(() => {
    const presentCount = students.filter(student => student.is_present).length;
    setTotalPresent(presentCount);
  }, [students]);

  // Handle keyboard navigation
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRow, students]);

  // Scroll to current row
  useEffect(() => {
    if (rowRefs.current[currentRow]) {
      rowRefs.current[currentRow].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentRow]);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Attendance</h2>
      
      {/* Filter and Submit Button in the same row */}
      <div className="flex justify-between items-center mb-4">
        <Filter
          courses={courseOptions}
          date={selectedDate}
          onCourseChange={handleCourseChange}
          onDateChange={handleDateChange}
        />
        <button
          onClick={handleSave}
          className="ml-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
        >
          Save Attendance
        </button>
      </div>

      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <p className="text-md font-medium text-gray-700">Total Count:</p>
          <p className="text-md font-bold text-gray-900">{students.length}</p>
        </div>
        <div>
          <p className="text-md font-medium text-gray-700">Total Present:</p>
          <p className="text-md font-bold text-green-600">{totalPresent}</p>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-lg shadow-md"
        style={{ maxHeight: "440px", overflowY: "auto" }}
      >
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 text-left sticky top-0 z-12 text-black" style={{ backgroundColor: '#71D2F8' }}>
                Student ID
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left sticky top-0 z-12 text-black" style={{ backgroundColor: '#71D2F8' }}>
                Name
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left sticky top-0 z-12 text-black" style={{ backgroundColor: '#71D2F8' }}>
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`${index === currentRow ? "bg-gray-100 bg-opacity-50" : ""}`}
              >
                <td className="py-3 px-4 border-b border-gray-200">
                  {student.id}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {student.name}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={student.is_present}
                    onChange={() => handleAttendanceChange(index)}
                    className="form-checkbox h-4 w-4"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
