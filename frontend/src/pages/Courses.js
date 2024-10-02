import React, { useState } from 'react';

const initialCourses = [
  {
    id: '1',
    name: 'Engineering Mechanics',
    students: [
      { id: 'S001', name: 'Hardik Pandya' },
      { id: 'S002', name: 'Rohit Sharma' }
    ]
  },
  {
    id: '2',
    name: 'Mathematics',
    students: [
      { id: 'S003', name: 'Virat Kohli' },
      { id: 'S004', name: 'Shubman Gill' }
    ]
  }
];

const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formState, setFormState] = useState({
    newCourseName: '',
    newStudentId: '',
    newStudentName: '',
    showAddCourseForm: false,
    showAddStudentModal: false
  });

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleAddCourse = () => {
    if (formState.newCourseName.trim()) {
      const newCourse = { id: Date.now().toString(), name: formState.newCourseName, students: [] };
      setCourses([...courses, newCourse]);
      setFormState(prev => ({ ...prev, newCourseName: '', showAddCourseForm: false }));
    }
  };

  const handleDeleteCourse = (courseId) => {
    const courseToDelete = courses.find(course => course.id === courseId);
    const confirmed = window.confirm(`Are you sure you want to delete "${courseToDelete.name}" from your courses?`);
    if (confirmed) {
      setCourses(courses.filter(course => course.id !== courseId));
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
      }
    }
  };

  const handleAddStudent = () => {
    if (selectedCourse && formState.newStudentId.trim() && formState.newStudentName.trim()) {
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            students: [
              ...course.students,
              { id: formState.newStudentId, name: formState.newStudentName }
            ]
          };
        }
        return course;
      });

      setCourses(updatedCourses);
      setSelectedCourse(updatedCourses.find(course => course.id === selectedCourse.id));
      setFormState(prev => ({ ...prev, newStudentId: '', newStudentName: '', showAddStudentModal: false }));
    }
  };

  const handleDeleteStudent = (studentId) => {
    const studentToDelete = selectedCourse.students.find(student => student.id === studentId);
    const confirmed = window.confirm(`Are you sure you want to delete "${studentToDelete.name}" from "${selectedCourse.name}"?`);
    if (confirmed) {
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            students: course.students.filter(student => student.id !== studentId)
          };
        }
        return course;
      });

      setCourses(updatedCourses);
      setSelectedCourse(updatedCourses.find(course => course.id === selectedCourse.id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 bg-white-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Courses Management</h2>

      {/* Add Course */}
      <div className="mb-8">
        {!formState.showAddCourseForm ? (
          <button
            onClick={() => setFormState(prev => ({ ...prev, showAddCourseForm: true }))}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Course
          </button>
        ) : (
          <div className="mb-6 flex items-center gap-6">
            <input
              type="text"
              name="newCourseName"
              placeholder="Enter new course name"
              value={formState.newCourseName}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg shadow-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleAddCourse}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Add Course
            </button>
            <button
              onClick={() => setFormState(prev => ({ ...prev, showAddCourseForm: false }))}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* List of Courses */}
      <div className="flex flex-wrap gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 cursor-pointer transform transition-transform hover:scale-105 ${
              selectedCourse?.id === course.id ? "bg-blue-100" : ""
            }`}
            onClick={() => handleCourseClick(course)}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCourse(course.id);
                }}
                className="text-red-600 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Students in Selected Course */}
      {selectedCourse && (
        <div className="mt-8 flex flex-col gap-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-semibold text-gray-800">
              {selectedCourse.name} - Students ({selectedCourse.students.length})
            </h3>
            {!formState.showAddStudentModal && (
              <button
                onClick={() => setFormState(prev => ({ ...prev, showAddStudentModal: true }))}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Add Student
              </button>
            )}
          </div>

          {/* Add Student Modal */}
          {formState.showAddStudentModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-3xl mt-32 ml-64">
                <h4 className="text-2xl font-semibold mb-4">Add Student</h4>
                <div className="mb-6">
                  <input
                    type="text"
                    name="newStudentId"
                    placeholder="Enter student ID"
                    value={formState.newStudentId}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="newStudentName"
                    placeholder="Enter student name"
                    value={formState.newStudentName}
                    onChange={handleChange}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddStudent}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Add Student
                  </button>
                  <button
                    onClick={() => setFormState(prev => ({ ...prev, showAddStudentModal: false }))}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-700">Student ID</th>
                  <th className="py-2 px-4 text-left text-gray-700">Name</th>
                  <th className="py-2 px-4 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.students.map(student => (
                  <tr key={student.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{student.id}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-red-600">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="hover:text-red-700"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
