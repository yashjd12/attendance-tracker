import React from 'react';

const DashboardCard = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4 mb-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default DashboardCard;
