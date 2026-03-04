import { apiClient } from './client';

export const customerApi = {
    getByBranchId: async (branchId, params = {}) => {
        const { page = 0, size = 100, ...filters } = params;
        return apiClient.get(`/customers/branch/${branchId}`, {
            params: { page, size, ...filters }
        });
    }
};
