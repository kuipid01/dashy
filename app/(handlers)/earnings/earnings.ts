// Earnings business logic and utility functions
import { EarningsResponse, MonthlyEarning, EarningsChartData, EarningsStats } from "./types";

/**
 * Convert earnings data to chart format for the earnings component
 * @param monthlyEarnings - Array of monthly earnings from API
 * @returns Chart data format
 */
export const convertToChartData = (monthlyEarnings: MonthlyEarning[]): EarningsChartData[] => {
  return monthlyEarnings.map(earning => ({
    month: earning.month,
    earnings: earning.amount,
  }));
};

/**
 * Calculate earnings statistics from the earnings response
 * @param earningsData - The earnings response from API
 * @returns Calculated earnings statistics
 */
export const calculateEarningsStats = (earningsData: EarningsResponse): EarningsStats => {
  const { monthly_earnings } = earningsData;
  
  const totalEarnings = monthly_earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const averageMonthlyEarnings = monthly_earnings.length > 0 ? totalEarnings / monthly_earnings.length : 0;
  
  const sortedEarnings = [...monthly_earnings].sort((a, b) => b.amount - a.amount);
  const bestMonth = sortedEarnings[0] || { month: "N/A", amount: 0, start: "", end: "" };
  const worstMonth = sortedEarnings[sortedEarnings.length - 1] || { month: "N/A", amount: 0, start: "", end: "" };
  
  // Calculate growth trend
  let growthTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (monthly_earnings.length >= 2) {
    const recent = monthly_earnings.slice(-2);
    const growth = recent[1].amount - recent[0].amount;
    if (growth > 0) growthTrend = 'increasing';
    else if (growth < 0) growthTrend = 'decreasing';
  }
  
  // Simple projection based on recent trend
  let projectedNextMonth = 0;
  if (monthly_earnings.length >= 2) {
    const recent = monthly_earnings.slice(-2);
    const growth = recent[1].amount - recent[0].amount;
    projectedNextMonth = Math.max(0, recent[1].amount + growth);
  }
  
  return {
    totalEarnings,
    averageMonthlyEarnings,
    bestMonth,
    worstMonth,
    growthTrend,
    projectedNextMonth,
  };
};

/**
 * Format currency amount for display
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Format percentage for display
 * @param percentage - The percentage to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Get growth indicator (positive/negative/neutral)
 * @param growthRate - The growth rate percentage
 * @returns Growth indicator string
 */
export const getGrowthIndicator = (growthRate: number): string => {
  if (growthRate > 0) return 'positive';
  if (growthRate < 0) return 'negative';
  return 'neutral';
};

/**
 * Calculate month-over-month growth
 * @param currentMonth - Current month earnings
 * @param previousMonth - Previous month earnings
 * @returns Growth percentage
 */
export const calculateGrowthRate = (currentMonth: number, previousMonth: number): number => {
  if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
  return ((currentMonth - previousMonth) / previousMonth) * 100;
};
