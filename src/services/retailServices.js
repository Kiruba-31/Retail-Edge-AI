import apiClient from './apiClient';

// 1. Authentication Services
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/me'),
};

// 2. Inventory (500 Products) Services
export const inventoryService = {
  getProducts: (params) => apiClient.get('/inventory', { params }), // { category, page, limit, search }
  restockItem: (productId) => apiClient.post(`/inventory/${productId}/restock`),
};

// 3. Queue Management Services
export const queueService = {
  getCounters: () => apiClient.get('/counters'),
  toggleCounter: (counterId, status) => apiClient.patch(`/counters/${counterId}`, { status }),
  assignStaffToCounter: (counterId, staffName) => apiClient.post(`/counters/${counterId}/assign`, { staffName }),
};

// 4. Employees & Attendance Services
export const employeeService = {
  getAll: () => apiClient.get('/employees'),
  create: (employeeData) => apiClient.post('/employees', employeeData),
  updateRole: (id, newRole) => apiClient.patch(`/employees/${id}/role`, { role: newRole }),
  delete: (id) => apiClient.delete(`/employees/${id}`),
};

// 5. Shopper Analytics Services
export const analyticsService = {
  getFootfallStats: (timeframe) => apiClient.get(`/analytics/footfall?timeframe=${timeframe}`),
  getZoneAnalytics: () => apiClient.get('/analytics/zones'),
};
