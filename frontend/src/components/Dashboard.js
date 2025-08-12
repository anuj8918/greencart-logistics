// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProfit: 0,
    efficiencyScore: 0,
    onTimeDeliveries: 0,
    totalDeliveries: 0,
    deliveryBreakdown: [],
    fuelCostBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      await api.initializeData();
      alert('Sample data initialized successfully!');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to initialize data');
    }
  };

  // Chart configurations
  const deliveryChartData = {
    labels: dashboardData.deliveryBreakdown.map(item => item.label || 'Unknown'),
    datasets: [
      {
        label: 'Deliveries',
        data: dashboardData.deliveryBreakdown.map(item => item.value || 0),
        backgroundColor: [
          '#10B981', // Green for on-time
          '#EF4444'  // Red for late
        ],
        borderColor: [
          '#059669',
          '#DC2626'
        ],
        borderWidth: 1,
      },
    ],
  };

  const fuelCostChartData = {
    labels: dashboardData.fuelCostBreakdown.map(item => item.label || 'Unknown'),
    datasets: [
      {
        label: 'Fuel Cost (₹)',
        data: dashboardData.fuelCostBreakdown.map(item => item.value || 0),
        backgroundColor: [
          '#3B82F6', // Blue for low
          '#F59E0B', // Yellow for medium
          '#EF4444'  // Red for high
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Data',
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>GreenCart Logistics Dashboard</h1>
        <button onClick={initializeData} className="init-data-button">
          Initialize Sample Data
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card profit">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>Total Profit</h3>
            <p className="kpi-value">₹{dashboardData.totalProfit?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="kpi-card efficiency">
          <div className="kpi-icon">⚡</div>
          <div className="kpi-content">
            <h3>Efficiency Score</h3>
            <p className="kpi-value">{dashboardData.efficiencyScore?.toFixed(1) || 0}%</p>
          </div>
        </div>

        <div className="kpi-card deliveries">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <h3>On-Time Deliveries</h3>
            <p className="kpi-value">
              {dashboardData.onTimeDeliveries || 0}/{dashboardData.totalDeliveries || 0}
            </p>
          </div>
        </div>

        <div className="kpi-card fuel">
          <div className="kpi-icon">⛽</div>
          <div className="kpi-content">
            <h3>Fuel Cost</h3>
            <p className="kpi-value">₹{dashboardData.fuelCost?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>On-time vs Late Deliveries</h3>
          <div className="chart-wrapper">
            {dashboardData.deliveryBreakdown.length > 0 ? (
              <Doughnut 
                data={deliveryChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false
                    }
                  }
                }}
              />
            ) : (
              <div className="no-data">
                <p>No delivery data available</p>
                <small>Run a simulation to see delivery breakdown</small>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Fuel Cost Breakdown by Traffic</h3>
          <div className="chart-wrapper">
            {dashboardData.fuelCostBreakdown.length > 0 ? (
              <Bar 
                data={fuelCostChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '₹' + value;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="no-data">
                <p>No fuel cost data available</p>
                <small>Run a simulation to see fuel cost breakdown</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => window.location.href = '/simulation'}
            className="action-button primary"
          >
            Run New Simulation
          </button>
          <button 
            onClick={() => window.location.href = '/drivers'}
            className="action-button secondary"
          >
            Manage Drivers
          </button>
          <button 
            onClick={() => window.location.href = '/orders'}
            className="action-button secondary"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;