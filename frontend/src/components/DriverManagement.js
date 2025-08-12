// src/components/DriverManagement.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './DriverManagement.css'

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDriver, setEditingDriver] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    currentShiftHours: 0,
    past7DayWorkHours: 0
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const driversData = await api.getDrivers();
      setDrivers(driversData);
    } catch (err) {
      setError('Failed to fetch drivers');
      console.error('Fetch drivers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      currentShiftHours: 0,
      past7DayWorkHours: 0
    });
    setEditingDriver(null);
    setShowAddForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Driver name is required');
      return;
    }

    if (formData.currentShiftHours < 0 || formData.past7DayWorkHours < 0) {
      setError('Work hours cannot be negative');
      return;
    }

    try {
      if (editingDriver) {
        await api.updateDriver(editingDriver._id, formData);
      } else {
        await api.createDriver(formData);
      }
      
      fetchDrivers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save driver');
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      currentShiftHours: driver.currentShiftHours,
      past7DayWorkHours: driver.past7DayWorkHours
    });
    setEditingDriver(driver);
    setShowAddForm(true);
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      await api.deleteDriver(driverId);
      fetchDrivers();
    } catch (err) {
      setError('Failed to delete driver');
    }
  };

  const getDriverStatus = (driver) => {
    if (driver.currentShiftHours > 8) {
      return { status: 'fatigued', label: 'Fatigued', color: '#EF4444' };
    } else if (driver.currentShiftHours > 6) {
      return { status: 'tired', label: 'Tired', color: '#F59E0B' };
    } else {
      return { status: 'fresh', label: 'Fresh', color: '#10B981' };
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading drivers...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Driver Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="add-button"
        >
          Add New Driver
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
              <button onClick={resetForm} className="close-button">×</button>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Driver Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter driver name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Shift Hours</label>
                <input
                  type="number"
                  name="currentShiftHours"
                  value={formData.currentShiftHours}
                  onChange={handleInputChange}
                  min="0"
                  max="24"
                  step="0.5"
                />
                <small>Hours worked in current shift</small>
              </div>

              <div className="form-group">
                <label>Past 7-Day Work Hours</label>
                <input
                  type="number"
                  name="past7DayWorkHours"
                  value={formData.past7DayWorkHours}
                  onChange={handleInputChange}
                  min="0"
                  max="168"
                  step="0.5"
                />
                <small>Total hours worked in past 7 days</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drivers List */}
      <div className="drivers-container">
        {drivers.length > 0 ? (
          <div className="drivers-grid">
            {drivers.map((driver) => {
              const driverStatus = getDriverStatus(driver);
              return (
                <div key={driver._id} className="driver-card">
                  <div className="driver-header">
                    <h3>{driver.name}</h3>
                    <div 
                      className="driver-status"
                      style={{ color: driverStatus.color }}
                    >
                      {driverStatus.label}
                    </div>
                  </div>

                  <div className="driver-stats">
                    <div className="stat">
                      <span className="stat-label">Current Shift:</span>
                      <span className="stat-value">{driver.currentShiftHours}h</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">7-Day Total:</span>
                      <span className="stat-value">{driver.past7DayWorkHours}h</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Weekly Average:</span>
                      <span className="stat-value">
                        {(driver.past7DayWorkHours / 7).toFixed(1)}h/day
                      </span>
                    </div>
                  </div>

                  <div className="driver-actions">
                    <button 
                      onClick={() => handleEdit(driver)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(driver._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>

                  {driver.currentShiftHours > 8 && (
                    <div className="driver-warning">
                      ⚠️ Driver may be fatigued (30% slower next day)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👨‍✈️</div>
            <h3>No Drivers Found</h3>
            <p>Add your first driver to start managing deliveries</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="primary-button"
            >
              Add First Driver
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {drivers.length > 0 && (
        <div className="summary-stats">
          <h3>Driver Summary</h3>
          <div className="stats-grid">
            <div className="summary-stat">
              <span>Total Drivers:</span>
              <span>{drivers.length}</span>
            </div>
            <div className="summary-stat">
              <span>Available:</span>
              <span>{drivers.filter(d => d.currentShiftHours <= 8).length}</span>
            </div>
            <div className="summary-stat">
              <span>Fatigued:</span>
              <span>{drivers.filter(d => d.currentShiftHours > 8).length}</span>
            </div>
            <div className="summary-stat">
              <span>Average Shift Hours:</span>
              <span>
                {(drivers.reduce((sum, d) => sum + d.currentShiftHours, 0) / drivers.length).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;