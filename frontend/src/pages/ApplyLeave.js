import React, { useState } from 'react';

const initialLeaveRequests = [
  { id: 'L001', fromDate: '2024-09-15', toDate: '2024-09-16', reason: 'Medical Appointment', status: 'Pending' },
  { id: 'L002', fromDate: '2024-09-20', toDate: '2024-09-21', reason: 'Family Event', status: 'Approved', comment: 'Approved by faculty' },
  // Add more leave requests as needed
];

const ApplyLeave = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const handleApplyLeave = () => {
    if (!fromDate || !toDate || !reason) {
      alert('Please fill all the fields.');
      return;
    }

    const newLeaveRequest = {
      id: `L${leaveRequests.length + 1}`,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
    };

    setLeaveRequests([newLeaveRequest, ...leaveRequests]);
    setFromDate('');
    setToDate('');
    setReason('');
    alert('Leave request applied successfully.');
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Apply for Leave</h2>

      {/* Apply for Leave Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Reason:</label>
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
              request.status === 'Approved' ? 'border-green-500' : request.status === 'Rejected' ? 'border-red-500' : 'border-yellow-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">{request.reason}</h3>
                <p className="text-sm text-gray-600">
                  <strong>From:</strong> {request.fromDate} <strong>To:</strong> {request.toDate}
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
