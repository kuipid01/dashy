/* eslint-disable @typescript-eslint/no-explicit-any */
// Earnings API types based on the backend response structure

export interface MonthlyEarning {
  month: string; // Format: "Jan 2006"
  amount: number;
  start: string; // RFC3339 format
  end: string; // RFC3339 format
}

export interface EarningsResponse {
  store_id: number;
  this_month_earnings: number;
  last_month_earnings: number;
  growth_rate: number; // percentage growth
  monthly_earnings: MonthlyEarning[]; // past 6 months data
}

export interface EarningsApiResponse {
  success: boolean;
  data: EarningsResponse;
  message?: string;
}

export interface EarningsError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Chart data format for the earnings component
export interface EarningsChartData {
  month: string;
  earnings: number;
}

// Query parameters for earnings filtering
export interface EarningsQueryParams {
  storeId?: number;
  year?: number;
  month?: number;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
}

// Earnings statistics for additional analytics
export interface EarningsStats {
  totalEarnings: number;
  averageMonthlyEarnings: number;
  bestMonth: MonthlyEarning;
  worstMonth: MonthlyEarning;
  growthTrend: 'increasing' | 'decreasing' | 'stable';
  projectedNextMonth: number;
}
