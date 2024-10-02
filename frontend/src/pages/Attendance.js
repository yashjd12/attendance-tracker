import React, { useState, useEffect, useRef } from 'react';
import Filter from '../components/Filter';

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [students, setStudents] = useState([
    { id: "S001", name: "Hardik Pandya", isPresent: false },
    { id: "S002", name: "Rohit Sharma", isPresent: false },
    { id: "S003", name: "Virat Kohli", isPresent: false },
    { id: "S004", name: "Shubman Gill", isPresent: false },
    { id: "S005", name: "Ishan Kishan", isPresent: false },
    { id: "S006", name: "Rishabh Pant", isPresent: false },
    { id: "S007", name: "Jasprit Bumrah", isPresent: false },
    { id: "S008", name: "Suryakumar Yadav", isPresent: false },
    { id: "S009", name: "Sachin Tendulkar", isPresent: false },
    { id: "S010", name: "Yuvraj Singh", isPresent: false },
    { id: "S011", name: "M.S Dhoni", isPresent: false },
    { id: "S012", name: "K L Rahul", isPresent: false },
    { id: "S013", name: "Kuldeep Yadav", isPresent: false },
    { id: "S014", name: "Yuzuvendra Chahal", isPresent: false },
    { id: "S015", name: "Ravindra Jadeja", isPresent: false },
    { id: "S016", name: "Shivam Dube", isPresent: false },
  ]);
  const [currentRow, setCurrentRow] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);

  // Ref for each row
  const rowRefs = useRef([]);

  const totalCount = students.length;


  const courseOptions = [
    { value: "mechanics", label: "Engineering Mechanics" },
    { value: "mathematics", label: "Mathematics" },
  ];

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleAttendanceChange = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].isPresent = !updatedStudents[index].isPresent;
    setStudents(updatedStudents);
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
  
  useEffect(() => {
    const presentCount = students.filter(student => student.isPresent).length;
    setTotalPresent(presentCount);
  }, [students]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRow, students]);

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
      <Filter
        courses={courseOptions}
        date={selectedDate}
        onCourseChange={handleCourseChange}
        onDateChange={handleDateChange}
      />
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
                className={`${
                  index === currentRow ? "bg-gray-100 bg-opacity-50" : ""
                }`}
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
                    checked={student.isPresent}
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
