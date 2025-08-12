// src/components/RouteManagement.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRoute, setEditingRoute] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    routeId: '',
    distance: 0,
    trafficLevel: 'Low',
    baseTime: 0
  });

  const trafficLevels = ['Low', 'Medium', 'High'];

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const routesData = await api.getRoutes();
      setRoutes(routesData);
    } catch (err) {
      setError('Failed to fetch routes');
      console.error('Fetch routes error:', err);
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
      routeId: '',
      distance: 0,
      trafficLevel: 'Low',
      baseTime: 0
    });
    setEditingRoute(null);
    setShowAddForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.routeId.trim()) {
      setError('Route ID is required');
      return;
    }

    if (formData.distance <= 0) {
      setError('Distance must be greater than 0');
      return;
    }

    if (formData.baseTime <= 0) {
      setError('Base time must be greater than 0');
      return;
    }

    try {
      if (editingRoute) {
        await api.updateRoute(editingRoute._id, formData);
      } else {
        await api.createRoute(formData);
      }
      
      fetchRoutes();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save route');
    }
  };

  const handleEdit = (route) => {
    setFormData({
      routeId: route.routeId,
      distance: route.distance,
      trafficLevel: route.trafficLevel,
      baseTime: route.baseTime
    });
    setEditingRoute(route);
    setShowAddForm(true);
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      await api.deleteRoute(routeId);
      fetchRoutes();
    } catch (err) {
      setError('Failed to delete route');
    }
  };

  const getTrafficColor = (trafficLevel) => {
    switch (trafficLevel) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const calculateFuelCost = (route) => {
    let baseCost = 5 * route.distance; // ₹5/km
    if (route.trafficLevel === 'High') {
      baseCost += 2 * route.distance; // +₹2/km surcharge
    }
    return baseCost;
  };

  const getRouteEfficiency = (route) => {
    const timePerKm = route.baseTime / route.distance;
    if (timePerKm < 2) return 'Excellent';
    if (timePerKm < 3) return 'Good';
    if (timePerKm < 4) return 'Average';
    return 'Slow';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading routes...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Route Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="add-button"
        >
          Add New Route
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
              <h2>{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
              <button onClick={resetForm} className="close-button">×</button>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Route ID *</label>
                <input
                  type="text"
                  name="routeId"
                  value={formData.routeId}
                  onChange={handleInputChange}
                  placeholder="e.g., RT001"
                  required
                  disabled={editingRoute} // Don't allow changing route ID when editing
                />
              </div>

              <div className="form-group">
                <label>Distance (km) *</label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Traffic Level *</label>
                <select
                  name="trafficLevel"
                  value={formData.trafficLevel}
                  onChange={handleInputChange}
                  required
                >
                  {trafficLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <small>High traffic adds ₹2/km fuel surcharge</small>
              </div>

              <div className="form-group">
                <label>Base Time (minutes) *</label>
                <input
                  type="number"
                  name="baseTime"
                  value={formData.baseTime}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
                <small>Expected delivery time under normal conditions</small>
              </div>

              {formData.distance > 0 && formData.baseTime > 0 && (
                <div className="form-preview">
                  <h4>Route Preview:</h4>
                  <p>Fuel Cost: ₹{calculateFuelCost(formData)}</p>
                  <p>Speed: {(formData.distance / (formData.baseTime / 60)).toFixed(1)} km/h</p>
                  <p>Efficiency: {getRouteEfficiency(formData)}</p>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="routes-container">
        {routes.length > 0 ? (
          <div className="routes-grid">
            {routes.map((route) => (
              <div key={route._id} className="route-card">
                <div className="route-header">
                  <h3>{route.routeId}</h3>
                  <div 
                    className="traffic-badge"
                    style={{ backgroundColor: getTrafficColor(route.trafficLevel) }}
                  >
                    {route.trafficLevel} Traffic
                  </div>
                </div>

                <div className="route-stats">
                  <div className="stat">
                    <span className="stat-label">Distance:</span>
                    <span className="stat-value">{route.distance} km</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Base Time:</span>
                    <span className="stat-value">{route.baseTime} min</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Fuel Cost:</span>
                    <span className="stat-value">₹{calculateFuelCost(route)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Speed:</span>
                    <span className="stat-value">
                      {(route.distance / (route.baseTime / 60)).toFixed(1)} km/h
                    </span>
                  </div>
                </div>

                <div className="route-efficiency">
                  <span className="efficiency-label">Route Efficiency:</span>
                  <span className={`efficiency-value ${getRouteEfficiency(route).toLowerCase()}`}>
                    {getRouteEfficiency(route)}
                  </span>
                </div>

                <div className="route-actions">
                  <button 
                    onClick={() => handleEdit(route)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(route._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No Routes Found</h3>
            <p>Add your first delivery route to start planning</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="primary-button"
            >
              Add First Route
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {routes.length > 0 && (
        <div className="summary-stats">
          <h3>Route Summary</h3>
          <div className="stats-grid">
            <div className="summary-stat">
              <span>Total Routes:</span>
              <span>{routes.length}</span>
            </div>
            <div className="summary-stat">
              <span>Total Distance:</span>
              <span>{routes.reduce((sum, r) => sum + r.distance, 0).toFixed(1)} km</span>
            </div>
            <div className="summary-stat">
              <span>High Traffic Routes:</span>
              <span>{routes.filter(r => r.trafficLevel === 'High').length}</span>
            </div>
            <div className="summary-stat">
              <span>Avg Fuel Cost:</span>
              <span>
                ₹{Math.round(routes.reduce((sum, r) => sum + calculateFuelCost(r), 0) / routes.length)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;