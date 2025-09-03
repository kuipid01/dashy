
import { Product } from "@/app/(handlers)/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the structure for an individual cart item
interface CartItem {
    product: Product;
    quantity: number;
    storeId: number;
    storeName?: string;
}

// The main state of the cart store
interface CartState {
    items: Record<string, CartItem>; // A map for O(1) item access
    totalItems: number; // A derived state for convenience
    groupedByStore: boolean; // Toggle for store grouping view
}

// Actions to manipulate the cart state
interface CartActions {
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateItemQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleGroupByStore: () => void;
    getItemsByStore: () => Record<number, CartItem[]>;
}

// The combined store interface
interface CartStore extends CartState, CartActions { }

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: {},
            totalItems: 0,
            groupedByStore: false,

            // Action to add a product to the cart or increase its quantity
            addItem: (product, quantity = 1) => {
                set((state) => {
                    const items = { ...state.items };
                    const existingItem = items[product.ID ?? product.id];
                    console.log(product, "product in store")
                    if (existingItem) {
                        // Update quantity if item already exists
                        existingItem.quantity += quantity;
                    } else {
                        // Add a new item with store information
                        items[product.ID ?? product.id] = { 
                            product, 
                            quantity,
                            storeId: product.storeId || product.store_id,
                            storeName: product.store?.name
                        };
                    }

                    // Recalculate total items
                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );

                    return { items, totalItems: newTotalItems };
                });
            },

            // Action to remove an item completely from the cart
            removeItem: (productId) => {
                set((state) => {
                    const items = { ...state.items };
                    const itemToRemove = items[productId];
                    if (!itemToRemove) return state; //  Do nothing if item doesn't exist

                    delete items[productId];

                    // Recalculate total items
                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );

                    return { items, totalItems: newTotalItems };
                });
            },

            // Action to update the quantity of an existing item
            updateItemQuantity: (productId, quantity) => {
                set((state) => {
                    const items = { ...state.items };
                    const existingItem = items[productId];

                    if (!existingItem) return state; // Do nothing if item doesn't exist

                    if (quantity <= 0) {
                        delete items[productId]; // Remove item if quantity is zero or less
                    } else {
                        existingItem.quantity = quantity; // Update the quantity
                    }

                    // Recalculate total items
                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );

                    return { items, totalItems: newTotalItems };
                });
            },

            // Action to remove all items from the cart
            clearCart: () => {
                set({ items: {}, totalItems: 0 });
            },

            // Toggle store grouping view
            toggleGroupByStore: () => {
                set((state) => ({ groupedByStore: !state.groupedByStore }));
            },

            // Get items grouped by store
            getItemsByStore: () => {
                const state = get();
                const items = Object.values(state.items);
                const grouped: Record<number, CartItem[]> = {};
                
                items.forEach(item => {
                    const storeId = item.storeId;
                    if (!grouped[storeId]) {
                        grouped[storeId] = [];
                    }
                    grouped[storeId].push(item);
                });
                
                return grouped;
            },
        }),
        {
            name: "shopping-cart-storage", // A unique name for your storage key
        }
    )
);