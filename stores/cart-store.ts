
import { Product } from "@/app/(handlers)/types/product";
import { ProductVariant } from "@/constants/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the structure for an individual cart item
export interface CartItem {
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    storeId: number;
    storeName?: string;
    // Composite key for unique identification
    cartItemId: string; // Format: "productId_variantId" or "productId" if no variant
}

// The main state of the cart store
interface CartState {
    items: Record<string, CartItem>; // A map for O(1) item access
    totalItems: number; // A derived state for convenience
    groupedByStore: boolean; // Toggle for store grouping view
    // Shipping-related state
    shippingFeesByStore: Record<number, number>;
    shippingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        addressDescription?: string;
        lat?: number;
        lon?: number;
    };
}

// Actions to manipulate the cart state
interface CartActions {
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (cartItemId: string) => void;
    updateItemQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    toggleGroupByStore: () => void;
    getItemsByStore: () => Record<number, CartItem[]>;
    // Helper functions for variant handling
    getCartItemId: (productId: string | number, variantId?: string) => string;
    getItemPrice: (item: CartItem) => number;
    getItemTotalPrice: (item: CartItem) => number;
    // Shipping-related actions
    setShippingFeeForStore: (storeId: number, fee: number) => void;
    clearShippingFees: () => void;
    setShippingAddress: (addr: NonNullable<CartState["shippingAddress"]>) => void;
    getTotalShipping: () => number;
    // Hydration flag
    _hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;
}

// The combined store interface
interface CartStore extends CartState, CartActions { }

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: {},
            totalItems: 0,
            groupedByStore: false,
            shippingFeesByStore: {},

            // Action to add a product to the cart or increase its quantity
            addItem: (product, quantity = 1, variant?: ProductVariant) => {
                set((state) => {
                    console.group("🟩 ADD ITEM TO CART");

                    console.log("🛍️ Product received:", product);
                    console.log("🔢 Quantity to add:", quantity);
                    console.log("🧩 Variant (if any):", variant);

                    const items = { ...state.items };
                    console.log("📦 Current cart items before adding:", items);

                    const cartItemId = get().getCartItemId(product.ID ?? product.id, variant?.id);
                    console.log("🆔 Generated cartItemId:", cartItemId);

                    const existingItem = items[cartItemId];
                    console.log(
                        existingItem
                            ? "♻️ Item already exists in cart, will increase quantity."
                            : "✨ Item not in cart, will create new entry."
                    );

                    if (existingItem) {
                        existingItem.quantity += quantity;
                        console.log("🔁 Updated quantity:", existingItem.quantity);
                    } else {
                        items[cartItemId] = {
                            product,
                            variant,
                            quantity,
                            storeId: product.storeId || product.store_id,
                            storeName: product.store?.name,
                            cartItemId,
                        };
                        console.log("✅ Added new item to cart:", items[cartItemId]);
                    }

                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    console.log("🧮 Recalculated total items in cart:", newTotalItems);

                    console.groupEnd();
                    return { items, totalItems: newTotalItems };
                });
            },

            // Action to remove an item completely from the cart
            removeItem: (cartItemId) => {
                set((state) => {
                    console.group("🟥 REMOVE ITEM FROM CART");

                    console.log("🆔 cartItemId to remove:", cartItemId);

                    const items = { ...state.items };
                    console.log("📦 Current cart items before removal:", items);

                    const itemToRemove = items[cartItemId];

                    if (!itemToRemove) {
                        console.warn("⚠️ No item found for the given cartItemId. Nothing removed.");
                        console.groupEnd();
                        return state;
                    }

                    console.log("🗑️ Removing item:", itemToRemove);
                    delete items[cartItemId];

                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    console.log("🧮 Recalculated total items in cart after removal:", newTotalItems);

                    console.groupEnd();
                    return { items, totalItems: newTotalItems };
                });
            },

            // Action to update the quantity of an existing item
            updateItemQuantity: (cartItemId, quantity) => {
                set((state) => {
                    console.group("🟦 UPDATE ITEM QUANTITY");

                    console.log("🆔 cartItemId:", cartItemId);
                    console.log("🔢 New quantity requested:", quantity);

                    const items = { ...state.items };
                    console.log("📦 Current cart items:", items);

                    const existingItem = items[cartItemId];

                    if (!existingItem) {
                        console.warn("⚠️ Item not found in cart. Quantity update skipped.");
                        console.groupEnd();
                        return state;
                    }

                    console.log("🧩 Found existing item:", existingItem);

                    if (quantity <= 0) {
                        console.log("🗑️ Quantity is zero or less. Removing item from cart.");
                        delete items[cartItemId];
                    } else {
                        console.log(`🔄 Updating quantity from ${existingItem.quantity} → ${quantity}`);
                        existingItem.quantity = quantity;
                    }

                    const newTotalItems = Object.values(items).reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    console.log("🧮 Recalculated total items in cart:", newTotalItems);

                    console.groupEnd();
                    return { items, totalItems: newTotalItems };
                });
            },


            // Action to remove all items from the cart
            clearCart: () => {
                set({ items: {}, totalItems: 0, shippingFeesByStore: {}, shippingAddress: undefined });
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
            setShippingFeeForStore: (storeId, fee) => {
                set((state) => ({
                    shippingFeesByStore: { ...state.shippingFeesByStore, [storeId]: fee }
                }));
            },
            clearShippingFees: () => {
                set({ shippingFeesByStore: {} });
            },
            setShippingAddress: (addr) => {
                set({ shippingAddress: { ...addr } });
            },
            getTotalShipping: () => {
                const state = get();
                return Object.values(state.shippingFeesByStore).reduce((sum, n) => sum + (Number(n) || 0), 0);
            },
            // Helper functions for variant handling
            getCartItemId: (productId, variantId) => {
                return variantId ? `${productId}_${variantId}` : `${productId}`;
            },
            getItemPrice: (item) => {
                // Return variant price if available, otherwise product price
                return item.variant?.price || item.product.discounted_price || item.product.price;
            },
            getItemTotalPrice: (item) => {
                const unitPrice = get().getItemPrice(item);
                return unitPrice * item.quantity;
            },
            // Hydration tracking
            _hasHydrated: false,
            setHasHydrated: (v) => set({ _hasHydrated: v }),
        }),
        {
            name: "shopping-cart-storage", // A unique name for your storage key
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);