/* eslint-disable @typescript-eslint/no-explicit-any */
// Additional types specific to temporal user API operations

export interface TemporalUserResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
      
    status: "active" | "pending" | "inactive";
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export interface TemporalUserListResponse {
  success: boolean;
  data: {
    users: Array<{
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      status: "active" | "pending" | "inactive";
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  };
}

export interface LinkOrderResponse {
  success: boolean;
  message: string;
  data?: {
    temporalUserId: number;
    orderId: number;
    linkedAt: string;
  };
}

export interface TemporalUserError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Query parameters for filtering temporal users
export interface TemporalUserQueryParams {
  email?: string;
  status?: "active" | "pending" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "email" | "firstName" | "lastName";
  sortOrder?: "asc" | "desc";
}

// Bulk operations
export interface BulkTemporalUserOperation {
  operation: "update" | "delete" | "activate" | "deactivate";
  userIds: number[];
  data?: any; // For update operations
}

export interface BulkTemporalUserResponse {
  success: boolean;
  data: {
    processed: number;
    successful: number;
    failed: number;
    errors?: Array<{
      userId: number;
      error: string;
    }>;
  };
  message: string;
}
