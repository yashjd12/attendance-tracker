import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons

const initialLeaveRequests = [
  { id: 'L001', studentName: 'Hardik Pandya', leaveDate: '2024-09-15', reason: 'Medical Appointment' },
  { id: 'L002', studentName: 'Rohit Sharma', leaveDate: '2024-09-16', reason: 'Family Event' },
  // Add more leave requests as needed
];

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});

  const handleCommentChange = (id, value) => {
    setComments(prevComments => ({ ...prevComments, [id]: value }));
  };

  const handleStatusChange = (id, value) => {
    setStatus(prevStatus => ({ ...prevStatus, [id]: value }));
  };

  const handleSendStatus = (id) => {
    const updatedRequests = leaveRequests.filter(request => request.id !== id);
    setLeaveRequests(updatedRequests);
    alert(`Leave request ${id} has been ${status[id] === 'approved' ? 'approved' : 'rejected'} with comment: ${comments[id] || 'No comment'}`);
    // Implement API call or logic to update the leave status and comment
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Leave Requests</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 border-l-4 border-gray-300"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="text-2xl text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {request.studentName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong> {request.leaveDate}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reason:</strong> {request.reason}
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              {status[request.id] === "approved" ? (
                <span className="text-green-500 font-semibold flex items-center gap-2">
                  <FaCheckCircle className="text-lg" />
                  Approved
                </span>
              ) : status[request.id] === "rejected" ? (
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
                onClick={() => handleStatusChange(request.id, "approved")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(request.id, "rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>

            <textarea
              placeholder="Add a comment..."
              value={comments[request.id] || ""}
              onChange={(e) => handleCommentChange(request.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <button
              onClick={() => handleSendStatus(request.id)}
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
