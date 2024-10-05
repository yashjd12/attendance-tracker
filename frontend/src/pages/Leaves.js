import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons
import axios from 'axios'; // For making API requests

const Leaves = ({ userId }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests when component mounts
  useEffect(() => {
    fetchLeaveRequests();
  }, [userId]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/leaves/${userId}`);
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leave requests');
      setLoading(false);
    }
  };

  const handleCommentChange = (id, value) => {
    setComments((prevComments) => ({ ...prevComments, [id]: value }));
  };

  const handleStatusChange = (id, value) => {
    setStatus((prevStatus) => ({ ...prevStatus, [id]: value }));
  };

  const handleSendStatus = async (id) => {
    try {
      // Send the updated status and comment to the backend
      await axios.put(`http://localhost:5000/api/leaves/${id}`, {
        status: status[id],
        comment: comments[id] || ''
      });

      // After successful update, refetch leave requests
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update leave request');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Leave Requests</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {leaveRequests.map((request) => (
          <div
            key={request.leave_id}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 border-l-4 border-gray-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="text-2xl text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {request.student_name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Course:</strong> {request.course_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Leave Dates:</strong> {request.leave_start_date} to {request.leave_end_date}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reason:</strong> {request.reason}
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              {status[request.leave_id] === "approved" ? (
                <span className="text-green-500 font-semibold flex items-center gap-2">
                  <FaCheckCircle className="text-lg" />
                  Approved
                </span>
              ) : status[request.leave_id] === "rejected" ? (
                <span className="text-red-500 font-semibold flex items-center gap-2">
                  <FaTimesCircle className="text-lg" />
                  Rejected
                </span>
              ) : (
                <span className="text-gray-500 font-semibold">Pending</span>
              )}
            </div>

            {/* Status and Comment Section */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => handleStatusChange(request.leave_id, "approved")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(request.leave_id, "rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>

            <textarea
              placeholder="Add a comment..."
              value={comments[request.leave_id] || ""}
              onChange={(e) => handleCommentChange(request.leave_id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <button
              onClick={() => handleSendStatus(request.leave_id)}
              style={{ width: "120px" }} // Adjust the width as needed
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaves;
