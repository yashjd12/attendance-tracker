import React from 'react';

const Filter = ({ courses, date, onCourseChange, onDateChange }) => {
  return (
    <div className="flex space-x-4 mb-6 mt-6">
      <div className="flex items-center mr-4">
        <label className="text-md font-medium text-gray-700 mr-3">Course:</label>
        <select
          className="p-2 border rounded-lg"
          onChange={onCourseChange}
        >
          {courses.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label className="text-md font-medium text-gray-700 mr-3">Date:</label>
        <input
          type="date"
          value={date}
          onChange={onDateChange}
          className="p-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default Filter;
