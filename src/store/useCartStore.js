import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            
            addItem: (product, branchId, storeId) => {
                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex(
                    (item) => item.id === product.id && item.branchId === branchId
                );

                if (existingItemIndex > -1) {
                    const updatedItems = [...currentItems];
                    updatedItems[existingItemIndex].quantity += 1;
                    set({ items: updatedItems });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            { 
                                ...product, 
                                quantity: 1, 
                                branchId, 
                                storeId,
                                addedAt: new Date().toISOString()
                            }
                        ]
                    });
                }
            },

            removeItem: (productId, branchId) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === productId && item.branchId === branchId)
                    )
                });
            },

            updateQuantity: (productId, branchId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId, branchId);
                    return;
                }
                
                const updatedItems = get().items.map((item) =>
                    item.id === productId && item.branchId === branchId
                        ? { ...item, quantity }
                        : item
                );
                set({ items: updatedItems });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            
            getTotalAmount: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);
