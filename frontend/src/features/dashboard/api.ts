// src/features/dashboard/api.ts
import api from '../../lib/axios';

export interface StatusCounts {
  Applied: number;
  Interview: number;
  Offer: number;
  Rejected: number;
  [key: string]: number; // Index signature
}

export interface TrendData {
  _id: string; // Date like "2024-07"
  count: number;
}

export const getStatusCounts = async (): Promise<StatusCounts> => {
  const response = await api.get('/analytics/status');
  return response.data;
};

export const getTrends = async (): Promise<TrendData[]> => {
  const response = await api.get('/analytics/trends');
  return response.data;
};