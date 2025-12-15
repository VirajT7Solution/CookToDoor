import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartSummary } from '../types/customer.types';

interface CartState {
  cart: CartSummary | null;
  isLoading: boolean;
  setCart: (cart: CartSummary | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: number, updates: Partial<CartItem>) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  setIsLoading: (loading: boolean) => void;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      setCart: (cart) => set({ cart }),

      addItem: (item) => {
        const currentCart = get().cart;
        if (!currentCart) {
          set({
            cart: {
              items: [item],
              subtotal: item.itemTotal,
              totalItems: 1,
            },
          });
        } else {
          const existingItemIndex = currentCart.items.findIndex(
            (i) => i.id === item.id
          );
          let newItems: CartItem[];
          if (existingItemIndex >= 0) {
            newItems = [...currentCart.items];
            newItems[existingItemIndex] = item;
          } else {
            newItems = [...currentCart.items, item];
          }
          const newSubtotal = newItems.reduce(
            (sum, i) => sum + i.itemTotal,
            0
          );
          set({
            cart: {
              ...currentCart,
              items: newItems,
              subtotal: newSubtotal,
              totalItems: newItems.length,
            },
          });
        }
      },

      updateItem: (itemId, updates) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        const newItems = currentCart.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        const newSubtotal = newItems.reduce(
          (sum, i) => sum + i.itemTotal,
          0
        );
        set({
          cart: {
            ...currentCart,
            items: newItems,
            subtotal: newSubtotal,
            totalItems: newItems.length,
          },
        });
      },

      removeItem: (itemId) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        const newItems = currentCart.items.filter((item) => item.id !== itemId);
        if (newItems.length === 0) {
          set({ cart: null });
          return;
        }
        const newSubtotal = newItems.reduce(
          (sum, i) => sum + i.itemTotal,
          0
        );
        set({
          cart: {
            ...currentCart,
            items: newItems,
            subtotal: newSubtotal,
            totalItems: newItems.length,
          },
        });
      },

      clearCart: () => set({ cart: null }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      getCartItemCount: () => {
        const cart = get().cart;
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);




