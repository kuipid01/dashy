// Additional types specific to order API operations

export interface OrderResponse {
  success: boolean;
  data: {
    id: number;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    userId: number;
    net_total: number;
    commission: number;
    storeId?: number;
    paymentId?: string;
    deliveryMode: "store" | "agent" | "external";
    deliveryId?: string;
    agentId?: number;
    thirdPartyProvider?: string;
    thirdPartyTrackingId?: string;
    contactId?: string;
    addressId?: string;
    orderStatus: string;
    sales_means: "ONLINE" | "STORE";
    placedAt: string;
    placed_at: string;
    updatedAt: string;
    deletedAt?: string;
    orderItems: Array<{
      orderID?: number;
      productID: number;
      quantity: number;
      price: number;
      name: string;
      UnitPrice: number;
      TotalPrice: number;
      CreatedAt: string;
      Quantity: number;
      Product: {
        id: number;
        name: string;
        category: string;
        image: string[];
        price: number;
        storeId: number;
        live: boolean;
        createdAt: string;
      };
    }>;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    store?: {
      id: number;
      name: string;
      description?: string;
    };
    payment?: {
      id: string;
      amount: number;
      status: string;
    };
    deliveryOption?: {
      id: string;
      name: string;
      description?: string;
      price: number;
    };
    agent?: {
      id: number;
      name: string;
    };
    contact?: {
      id: string;
      name: string;
      phone: string;
      email?: string;
    };
    address?: {
      id: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: {
    orders: Array<{
      id: number;
      total: number;
      status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
      userId: number;
      net_total: number;
      commission: number;
      storeId?: number;
      orderStatus: string;
      sales_means: "ONLINE" | "STORE";
      placedAt: string;
      placed_at: string;
      updatedAt: string;
      orderItems: Array<{
        productID: number;
        quantity: number;
        price: number;
        name: string;
        Product: {
          id: number;
          name: string;
          image: string[];
          price: number;
        };
      }>;
      user?: {
        id: number;
        name: string;
        email: string;
      };
      store?: {
        id: number;
        name: string;
      };
    }>;
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface OrderProductsResponse {
  success: boolean;
  data: {
    order: {
      id: number;
      total: number;
      status: string;
      orderItems: Array<{
        orderID: number;
        productID: number;
        quantity: number;
        price: number;
        name: string;
        UnitPrice: number;
        TotalPrice: number;
        CreatedAt: string;
        Quantity: number;
        Product: {
          id: number;
          name: string;
          category: string;
          image: string[];
          videos?: string[];
          description?: string;
          stock?: number;
          price: number;
          discountedPrice?: number;
          rating: number;
          storeId: number;
          live: boolean;
          createdAt: string;
          store?: {
            id: number;
            name: string;
          };
        };
      }>;
    };
  };
  message?: string;
}

export interface LinkDeliveryOptionResponse {
  success: boolean;
  data: {
    order: {
      id: number;
      deliveryMode: "store" | "agent" | "external";
      deliveryId?: string;
      agentId?: number;
      thirdPartyProvider?: string;
      thirdPartyTrackingId?: string;
      updatedAt: string;
    };
  };
  message: string;
}

export interface OrderError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Query parameters for filtering orders
export interface OrderQueryParams {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  storeId?: number;
  userId?: number;
  deliveryMode?: "store" | "agent" | "external";
  sales_means?: "ONLINE" | "STORE";
  page?: number;
  limit?: number;
  sortBy?: "placedAt" | "updatedAt" | "total" | "status";
  sortOrder?: "asc" | "desc";
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
}

// Bulk operations
export interface BulkOrderOperation {
  operation: "update_status" | "delete" | "assign_delivery";
  orderIds: number[];
  data?: any; // For update operations
}

export interface BulkOrderResponse {
  success: boolean;
  data: {
    processed: number;
    successful: number;
    failed: number;
    errors?: Array<{
      orderId: number;
      error: string;
    }>;
  };
  message: string;
}

// Order statistics
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  ordersByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
}
