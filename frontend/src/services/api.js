// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.api.post('/auth/login', { email, password });
  }

  async register(email, password) {
    return this.api.post('/auth/register', { email, password });
  }

  // Driver endpoints
  async getDrivers() {
    return this.api.get('/drivers');
  }

  async createDriver(driverData) {
    return this.api.post('/drivers', driverData);
  }

  async updateDriver(id, driverData) {
    return this.api.put(`/drivers/${id}`, driverData);
  }

  async deleteDriver(id) {
    return this.api.delete(`/drivers/${id}`);
  }

  // Route endpoints
  async getRoutes() {
    return this.api.get('/routes');
  }

  async createRoute(routeData) {
    return this.api.post('/routes', routeData);
  }

  async updateRoute(id, routeData) {
    return this.api.put(`/routes/${id}`, routeData);
  }

  async deleteRoute(id) {
    return this.api.delete(`/routes/${id}`);
  }

  // Order endpoints
  async getOrders() {
    return this.api.get('/orders');
  }

  async createOrder(orderData) {
    return this.api.post('/orders', orderData);
  }

  async updateOrder(id, orderData) {
    return this.api.put(`/orders/${id}`, orderData);
  }

  async deleteOrder(id) {
    return this.api.delete(`/orders/${id}`);
  }

  // Simulation endpoints
  async runSimulation(simulationData) {
    return this.api.post('/simulation', simulationData);
  }

  async getSimulationHistory() {
    return this.api.get('/simulations');
  }

  // Dashboard endpoint
  async getDashboardData() {
    return this.api.get('/dashboard');
  }

  // Initialize sample data
  async initializeData() {
    return this.api.post('/init-data');
  }
}

const api = new ApiService();
export default api;