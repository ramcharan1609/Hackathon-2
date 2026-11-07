const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async handleImageUpload(file) {
        if (!file) return null;
        
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }
            
            return data.imageUrl;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(data.token);
        return data;
    }

    async adminLogin(email, password) {
        const data = await this.request('/auth/admin-login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(data.token);
        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        this.setToken(data.token);
        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    async createReport(reportData) {
        return await this.request('/reports', {
            method: 'POST',
            body: JSON.stringify(reportData)
        });
    }

    async getReports() {
        return await this.request('/reports');
    }

    async getReport(id) {
        return await this.request(`/reports/${id}`);
    }

    async updateReportStatus(id, status) {
        return await this.request(`/reports/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async deleteReport(id) {
        return await this.request(`/reports/${id}`, {
            method: 'DELETE'
        });
    }

    async getUsers() {
        return await this.request('/users');
    }

    async getUser(id) {
        return await this.request(`/users/${id}`);
    }

    async updateUser(id, userData) {
        return await this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(id) {
        return await this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }

    async getAdminDashboard() {
        return await this.request('/admin/dashboard');
    }

    async getAdminUsers(page = 1, limit = 10, search = '') {
        const params = new URLSearchParams({ page, limit });
        if (search) params.append('search', search);
        return await this.request(`/admin/users?${params}`);
    }

    async getAdminReports(page = 1, limit = 10, status = '', wasteType = '') {
        const params = new URLSearchParams({ page, limit });
        if (status) params.append('status', status);
        if (wasteType) params.append('wasteType', wasteType);
        return await this.request(`/admin/reports?${params}`);
    }

    async getAnalytics() {
        return await this.request('/admin/analytics');
    }
}

const api = new ApiClient();
