import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/api/auth';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (userData, token) =>
                set({ user: userData, token, isAuthenticated: true }),
            logout: () =>
                set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (userData) =>
                set((state) => ({ user: { ...state.user, ...userData } })),
            fetchProfile: async () => {
                try {
                    const response = await authApi.getProfile();
                    if (response.data) {
                        set({ user: response.data });
                        return response.data;
                    }
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage
        }
    )
);
