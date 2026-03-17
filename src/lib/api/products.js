import { apiClient } from './client';

// NOTE: The backend has NO GET /api/products endpoint.
// Products MUST be fetched per-store: GET /api/products/store/{storeId}
// ProductDto fields: sellingPrice (display price), mrp, image (not imageUrl), storeId, category
export const productApi = {
    // No getAll - use getByStoreId per store instead
    create: async (productData) => {
        return apiClient.post('/products', productData);
    },
    getByStoreId: async (storeId, page = 0, size = 50) => {
        return apiClient.get(`/products/store/${storeId}`, { params: { page, size } });
    },
    search: async (storeId, keyword, page = 0, size = 20) => {
        return apiClient.get(`/products/store/${storeId}/search`, {
            params: { keyword, page, size }
        });
    },
    update: async (id, productData) => {
        return apiClient.patch(`/products/${id}`, productData);
    },
    delete: async (id) => {
        return apiClient.delete(`/products/${id}`);
    }
};
