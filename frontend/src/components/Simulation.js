// src/components/Simulation.js
import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';

const Simulation = () => {
  const [simulationForm, setSimulationForm] = useState({
    availableDrivers: 3,
    startTime: '09:00',
    maxHoursPerDay: 8
  });
  
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
    fetchSimulationHistory();
  }, []);

  const fetchDrivers = async () => {
    try {
      const driversData = await api.getDrivers();
      setDrivers(driversData);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    }
  };

  const fetchSimulationHistory = async () => {
    try {
      const history = await api.getSimulationHistory();
      setSimulationHistory(history);
    } catch (err) {
      console.error('Failed to fetch simulation history:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setSimulationForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (simulationForm.availableDrivers < 1 || simulationForm.availableDrivers > drivers.length) {
      setError(`Available drivers must be between 1 and ${drivers.length}`);
      return false;
    }

    if (simulationForm.maxHoursPerDay < 1 || simulationForm.maxHoursPerDay > 24) {
      setError('Max hours per day must be between 1 and 24');
      return false;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(simulationForm.startTime)) {
      setError('Please enter a valid time in HH:MM format');
      return false;
    }

    return true;
  };

  const runSimulation = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const results = await api.runSimulation(simulationForm);
      setSimulationResults(results);
      fetchSimulationHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation
  const getDeliveryChartData = () => {
    if (!simulationResults?.deliveryBreakdown) return null;

    return {
      labels: simulationResults.deliveryBreakdown.map(item => item.label),
      datasets: [{
        label: 'Deliveries',
        data: simulationResults.deliveryBreakdown.map(item => item.value),
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      }],
    };
  };

  const getFuelChartData = () => {
    if (!simulationResults?.fuelCostBreakdown) return null;

    return {
      labels: simulationResults.fuelCostBreakdown.map(item => item.label),
      datasets: [{
        label: 'Fuel Cost (₹)',
        data: simulationResults.fuelCostBreakdown.map(item => item.value),
        backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="simulation-page">
      <div className="page-header">
        <h1>Delivery Simulation</h1>
        <p>Experiment with staffing and delivery schedules to optimize profits and efficiency</p>
      </div>

      {/* Simulation Form */}
      <div className="simulation-form-container">
        <h2>Simulation Parameters</h2>
        
        <div className="simulation-form">
          <div className="form-group">
            <label>
              Available Drivers
              <span className="field-info">(Max: {drivers.length})</span>
            </label>
            <input
              type="number"
              name="availableDrivers"
              value={simulationForm.availableDrivers}
              onChange={handleInputChange}
              min="1"
              max={drivers.length}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Route Start Time
              <span className="field-info">(HH:MM format)</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={simulationForm.startTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Max Hours per Driver per Day
              <span className="field-info">(1-24 hours)</span>
            </label>
            <input
              type="number"
              name="maxHoursPerDay"
              value={simulationForm.maxHoursPerDay}
              onChange={handleInputChange}
              min="1"
              max="24"
              className="form-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            onClick={runSimulation}
            disabled={loading || drivers.length === 0}
            className="run-simulation-button"
          >
            {loading ? 'Running Simulation...' : 'Run Simulation'}
          </button>

          {drivers.length === 0 && (
            <p className="warning-message">
              No drivers available. Please add drivers first.
            </p>
          )}
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResults && (
        <div className="simulation-results">
          <h2>Simulation Results</h2>

          {/* KPI Results */}
          <div className="results-kpi-grid">
            <div className="result-card profit">
              <h3>Total Profit</h3>
              <p className="result-value">₹{simulationResults.results.totalProfit.toLocaleString()}</p>
            </div>

            <div className="result-card efficiency">
              <h3>Efficiency Score</h3>
              <p className="result-value">{simulationResults.results.efficiencyScore}%</p>
            </div>

            <div className="result-card deliveries">
              <h3>On-Time Deliveries</h3>
              <p className="result-value">
                {simulationResults.results.onTimeDeliveries}/{simulationResults.results.totalDeliveries}
              </p>
            </div>

            <div className="result-card fuel">
              <h3>Fuel Cost</h3>
              <p className="result-value">₹{simulationResults.results.fuelCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Results Charts */}
          <div className="results-charts">
            <div className="chart-container">
              <h3>Delivery Performance</h3>
              <div className="chart-wrapper">
                {getDeliveryChartData() && (
                  <Doughnut 
                    data={getDeliveryChartData()} 
                    options={chartOptions}
                  />
                )}
              </div>
            </div>

            <div className="chart-container">
              <h3>Fuel Cost by Traffic Level</h3>
              <div className="chart-wrapper">
                {getFuelChartData() && (
                  <Bar 
                    data={getFuelChartData()} 
                    options={{
                      ...chartOptions,
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
                )}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="results-breakdown">
            <h3>Financial Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span>Bonuses Earned:</span>
                <span className="positive">+₹{simulationResults.results.bonuses.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Penalties Applied:</span>
                <span className="negative">-₹{simulationResults.results.penalties.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Total Fuel Cost:</span>
                <span className="negative">-₹{simulationResults.results.fuelCost.toLocaleString()}</span>
              </div>
              <div className="breakdown-item total">
                <span>Net Profit:</span>
                <span>₹{simulationResults.results.totalProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation History */}
      <div className="simulation-history">
        <h2>Simulation History</h2>
        {simulationHistory.length > 0 ? (
          <div className="history-list">
            {simulationHistory.slice(0, 5).map((sim, index) => (
              <div key={sim._id || index} className="history-item">
                <div className="history-info">
                  <span className="history-date">
                    {new Date(sim.timestamp).toLocaleString()}
                  </span>
                  <span className="history-params">
                    Drivers: {sim.inputs.availableDrivers}, 
                    Start: {sim.inputs.startTime}, 
                    Max Hours: {sim.inputs.maxHoursPerDay}
                  </span>
                </div>
                <div className="history-results">
                  <span>Profit: ₹{sim.results.totalProfit}</span>
                  <span>Efficiency: {sim.results.efficiencyScore}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-history">
            <p>No simulation history available</p>
            <p>Run your first simulation to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;