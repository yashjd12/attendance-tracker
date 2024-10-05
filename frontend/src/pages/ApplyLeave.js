import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplyLeave = ({ userId }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]); // State for storing courses
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const leaveResponse = await axios.get(
            `http://localhost:5000/api/student/leaves/${userId}`
          );
          setLeaveRequests(leaveResponse.data);

          const courseResponse = await axios.get(
            `http://localhost:5000/api/courses/${userId}`
          );
          setCourses(courseResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleApplyLeave = async () => {
    // Validate inputs
    if (!fromDate || !toDate || !reason || !courseId) {
      alert("Please fill all the fields.");
      return;
    }

    const newLeaveRequest = {
      student_id: userId, // Pass the userId as student_id
      course_id: courseId, // Include courseId in the leave request
      leave_start_date: fromDate,
      leave_end_date: toDate,
      reason,
      status: "Pending",
    };

    try {
      // Make the POST request to your backend API
      const response = await axios.post(
        "http://localhost:5000/api/student/leaves",
        newLeaveRequest
      );

      if (response.status === 201) {
        const leaveResponse = await axios.get(
          `http://localhost:5000/api/student/leaves/${userId}`
        );
        setLeaveRequests(leaveResponse.data);
        alert("Leave request applied successfully.");
        setFromDate("");
        setToDate("");
        setReason("");
        setCourseId("");
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("An error occurred while applying for leave. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute on fromDate
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Apply for Leave</h2>

      {/* Apply for Leave Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex gap-4 mb-4 items-end">
          {" "}
          {/* Added items-end to align items vertically */}
          <div className="w-1/3">
            {" "}
            {/* Adjusted width for better spacing */}
            <label className="block text-sm font-medium text-gray-700">
              From Date:
            </label>
            <input
              type="date"
              value={fromDate}
              min={getCurrentDate()} // Set min as today's date
              onChange={(e) => {
                setFromDate(e.target.value);
                // Reset toDate if it is older than the new fromDate
                if (toDate && new Date(toDate) < new Date(e.target.value)) {
                  setToDate("");
                }
              }}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="w-1/3">
            {" "}
            {/* Adjusted width for better spacing */}
            <label className="block text-sm font-medium text-gray-700">
              To Date:
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate || getCurrentDate()} // Set min as fromDate or today's date
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          {/* Course Dropdown moved here */}
          <div className="w-1/3">
            {" "}
            {/* Adjusted width for better spacing */}
            <label className="block text-sm font-medium text-gray-700">
              Select Course:
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Reason:
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for leave"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        <button
          onClick={handleApplyLeave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Leave
        </button>
      </div>

      {/* Pending Leave Requests */}
      <h2 className="text-2xl font-semibold mb-4">Pending Leave Requests</h2>

      {/* Scrollable Pending Leave Requests */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className={`bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 border-l-4 ${
              request.status === "Approved"
                ? "border-green-500"
                : request.status === "Rejected"
                ? "border-red-500"
                : "border-yellow-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">{request.reason}</h3>
                <p className="text-sm text-gray-600">
                  <strong>From:</strong> {request.fromDate} <strong>To:</strong>{" "}
                  {request.toDate}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {request.status}
                </p>
                {request.comment && (
                  <p className="text-sm text-gray-600">
                    <strong>Comment:</strong> {request.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplyLeave;
