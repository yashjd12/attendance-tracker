import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import DashboardCard from '../components/DashboardCard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Data for the Bar Chart
const barChartData = {
  labels: ['Engineering Mechanics', 'Mathematics', 'Physics', 'Chemistry'],
  datasets: [
    {
      label: 'Attendance',
      data: [75, 85, 65, 90], // Example data
      backgroundColor: '#4A90E2', // Blue color
      borderColor: '#357ABD', // Darker blue color
      borderWidth: 1,
    },
  ],
};

// Data for the Donut Chart
const donutChartData = {
  labels: ['Present', 'Absent'],
  datasets: [
    {
      label: 'Monthly Attendance',
      data: [70, 30], // Example data
      backgroundColor: ['#50E3C2', '#FF4F5A'], // Green and red colors
      borderColor: '#fff',
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

  return (
    <div className="p-8">
      <div className="flex flex-wrap -mx-4 mb-6">
        <DashboardCard title="Total Students">
          <p className="text-4xl font-bold text-blue-600">200</p>
        </DashboardCard>
        <DashboardCard title="% Present">
          <p className="text-4xl font-bold text-green-600">85%</p>
        </DashboardCard>
        <DashboardCard title="% Absent">
          <p className="text-4xl font-bold text-red-600">15%</p>
        </DashboardCard>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto max-h-[500px]">
          <div className="p-6 mb-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Course Attendance Bar Chart</h3>
          </div>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return context.dataset.label + ': ' + context.raw + '%';
                    },
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-auto max-h-[500px]">
          <div className="p-6 mb-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Donut Chart (Monthly Attendance - {currentMonth})</h3>
          </div>
          <Doughnut
            data={donutChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return context.label + ': ' + context.raw + '%';
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
