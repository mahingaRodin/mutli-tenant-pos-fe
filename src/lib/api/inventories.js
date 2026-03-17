import { apiClient } from './client';

export const inventoryApi = {
    getByBranchId: async (branchId, page = 0, size = 100) => {
        return apiClient.get(`/inventories/branch/${branchId}`, { params: { page, size } });
    },
    getByProductAndBranch: async (branchId, productId) => {
        return apiClient.get(`/inventories/branch/${branchId}/product/${productId}`);
    },
};
