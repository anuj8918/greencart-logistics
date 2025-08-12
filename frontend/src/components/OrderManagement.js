// src/components/OrderManagement.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Management.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    orderId: '',
    valueRs: 0,
    assignedRoute: '',
    deliveryTimestamp: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchRoutes();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await api.getOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const routesData = await api.getRoutes();
      setRoutes(routesData);
    } catch (err) {
      console.error('Failed to fetch routes:', err);
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
      orderId: '',
      valueRs: 0,
      assignedRoute: '',
      deliveryTimestamp: ''
    });
    setEditingOrder(null);
    setShowAddForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.orderId.trim()) {
      setError('Order ID is required');
      return;
    }

    if (formData.valueRs <= 0) {
      setError('Order value must be greater than 0');
      return;
    }

    if (!formData.assignedRoute) {
      setError('Please select a route');
      return;
    }

    if (!formData.deliveryTimestamp) {
      setError('Delivery timestamp is required');
      return;
    }

    try {
      if (editingOrder) {
        await api.updateOrder(editingOrder._id, formData);
      } else {
        await api.createOrder(formData);
      }
      
      fetchOrders();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save order');
    }
  };

  const handleEdit = (order) => {
    setFormData({
      orderId: order.orderId,
      valueRs: order.valueRs,
      assignedRoute: order.assignedRoute,
      deliveryTimestamp: new Date(order.deliveryTimestamp).toISOString().slice(0, 16)
    });
    setEditingOrder(order);
    setShowAddForm(true);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await api.deleteOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  const getOrderPriority = (value) => {
    if (value >= 2000) return { label: 'High', color: '#EF4444' };
    if (value >= 1000) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Low', color: '#10B981' };
  };

  const getRouteInfo = (routeId) => {
    return routes.find(route => route.routeId === routeId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `ORD${timestamp}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Order Management</h1>
        <button 
          onClick={() => {
            setFormData(prev => ({ ...prev, orderId: generateOrderId() }));
            setShowAddForm(true);
          }}
          className="add-button"
        >
          Add New Order
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
              <h2>{editingOrder ? 'Edit Order' : 'Add New Order'}</h2>
              <button onClick={resetForm} className="close-button">×</button>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Order ID *</label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  placeholder="e.g., ORD001"
                  required
                  disabled={editingOrder} // Don't allow changing order ID when editing
                />
                {!editingOrder && (
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, orderId: generateOrderId() }))}
                    className="generate-button"
                  >
                    Generate ID
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Order Value (₹) *</label>
                <input
                  type="number"
                  name="valueRs"
                  value={formData.valueRs}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  required
                />
                <small>Orders ₹1000 get 10% bonus if delivered on time</small>
              </div>

              <div className="form-group">
                <label>Assigned Route *</label>
                <select
                  name="assignedRoute"
                  value={formData.assignedRoute}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route.routeId}>
                      {route.routeId} - {route.distance}km ({route.trafficLevel} Traffic)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Timestamp *</label>
                <input
                  type="datetime-local"
                  name="deliveryTimestamp"
                  value={formData.deliveryTimestamp}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {formData.assignedRoute && (
                <div className="form-preview">
                  <h4>Order Preview:</h4>
                  {(() => {
                    const routeInfo = getRouteInfo(formData.assignedRoute);
                    const priority = getOrderPriority(formData.valueRs);
                    return routeInfo ? (
                      <>
                        <p>Route: {routeInfo.distance}km, {routeInfo.baseTime}min base time</p>
                        <p>Priority: <span style={{ color: priority.color }}>{priority.label}</span></p>
                        <p>Estimated Fuel Cost: ₹{5 * routeInfo.distance + (routeInfo.trafficLevel === 'High' ? 2 * routeInfo.distance : 0)}</p>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingOrder ? 'Update Order' : 'Add Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="orders-container">
        {orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map((order) => {
              const priority = getOrderPriority(order.valueRs);
              const routeInfo = getRouteInfo(order.assignedRoute);
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>{order.orderId}</h3>
                    <div 
                      className="priority-badge"
                      style={{ backgroundColor: priority.color }}
                    >
                      {priority.label} Priority
                    </div>
                  </div>

                  <div className="order-stats">
                    <div className="stat">
                      <span className="stat-label">Value:</span>
                      <span className="stat-value">₹{order.valueRs.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Route:</span>
                      <span className="stat-value">{order.assignedRoute}</span>
                    </div>
                    {routeInfo && (
                      <>
                        <div className="stat">
                          <span className="stat-label">Distance:</span>
                          <span className="stat-value">{routeInfo.distance}km</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Traffic:</span>
                          <span className="stat-value">{routeInfo.trafficLevel}</span>
                        </div>
                      </>
                    )}
                    <div className="stat">
                      <span className="stat-label">Delivery Time:</span>
                      <span className="stat-value">{formatDate(order.deliveryTimestamp)}</span>
                    </div>
                  </div>

                  {order.valueRs > 1000 && (
                    <div className="order-bonus">
                      🎁 Eligible for 10% on-time bonus
                    </div>
                  )}

                  <div className="order-actions">
                    <button 
                      onClick={() => handleEdit(order)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(order._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>Add your first order to start managing deliveries</p>
            <button 
              onClick={() => {
                setFormData(prev => ({ ...prev, orderId: generateOrderId() }));
                setShowAddForm(true);
              }}
              className="primary-button"
            >
              Add First Order
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="summary-stats">
          <h3>Order Summary</h3>
          <div className="stats-grid">
            <div className="summary-stat">
              <span>Total Orders:</span>
              <span>{orders.length}</span>
            </div>
            <div className="summary-stat">
              <span>Total Value:</span>
              <span>₹{orders.reduce((sum, o) => sum + o.valueRs, 0).toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span>High Value Orders:</span>
              <span>{orders.filter(o => o.valueRs > 1000).length}</span>
            </div>
            <div className="summary-stat">
              <span>Average Order Value:</span>
              <span>
                ₹{Math.round(orders.reduce((sum, o) => sum + o.valueRs, 0) / orders.length).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;