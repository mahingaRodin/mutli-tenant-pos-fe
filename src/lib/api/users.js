import { apiClient } from './client';

export const userApi = {
    getAll: async (page = 0, size = 20) => {
        return apiClient.get(`/users?page=${page}&size=${size}`);
    },
    getById: async (id) => {
        return apiClient.get(`/users/${id}`);
    },
    getByStoreId: async (storeId) => {
        return apiClient.get(`/users/store/${storeId}`);
    },
    update: async (id, userData) => {
        return apiClient.put(`/users/${id}`, userData);
    },
    delete: async (id) => {
        return apiClient.delete(`/users/${id}`);
    }
};
