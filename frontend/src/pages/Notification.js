import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelopeOpenText } from 'react-icons/fa';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulating fetching notifications from a database or an API
    const fetchNotifications = async () => {
      const initialNotifications = [
        {
          id: 1,
          type: 'Alert',
          course: 'Engineering Mechanics',
          month: 'August 2024',
          attendancePercentage: 60,
        },
        {
          id: 2,
          type: 'Leave',
          leaveStatus: 'Approved',
          comment: 'Get well soon!',
        },
      ];
      setNotifications(initialNotifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
          >
            <div className="flex-shrink-0">
              {notification.type === 'Alert' ? (
                <FaBell className="text-3xl text-yellow-500" />
              ) : (
                <FaEnvelopeOpenText className="text-3xl text-green-500" />
              )}
            </div>
            <div>
              {notification.type === 'Alert' ? (
                <>
                  <h3 className="text-xl font-semibold">
                    Alert for {notification.course}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Month:</strong> {notification.month}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Attendance:</strong> {notification.attendancePercentage}%
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">
                    Leave Status: {notification.leaveStatus}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Comment:</strong> {notification.comment}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
