import axios from 'axios';
import type { User } from '../types/user';
import type { RatingChange, DashboardStats, MonthlyGrowth, PerformanceMetrics, Insights } from '../types/rating';
import type { ProblemsResponse, ProblemFilters } from '../types/problem';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export interface DashboardResponse {
  user: User;
  stats: DashboardStats;
  monthly_growth: MonthlyGrowth[];
  contest_history: RatingChange[];
  performance_metrics: PerformanceMetrics;
  insights: string[];
}

// User API
export const userApi = {
  getUser: async (handle: string): Promise<User> => {
    const response = await api.get<User>(`/users/${handle}`);
    return response.data;
  },

  getRatingHistory: async (handle: string): Promise<RatingChange[]> => {
    const response = await api.get<RatingChange[]>(`/users/${handle}/rating-history`);
    return response.data;
  },

  getDashboard: async (handle: string): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>(`/users/${handle}/dashboard`);
    return response.data;
  },

  getInsights: async (handle: string): Promise<Insights> => {
    const response = await api.get<Insights>(`/users/${handle}/insights`);
    return response.data;
  },

  getLeaderboard: async (): Promise<{ users: User[]; count: number }> => {
    const response = await api.get<{ users: User[]; count: number }>('/users/leaderboard');
    return response.data;
  },

  searchUsers: async (query: string): Promise<{ users: User[]; count: number }> => {
    const response = await api.get<{ users: User[]; count: number }>(`/users/search?q=${query}`);
    return response.data;
  },
};

// Problem API
export const problemApi = {
  getProblems: async (filters: ProblemFilters = {}): Promise<ProblemsResponse> => {
    const response = await api.get<ProblemsResponse>('/problems', { params: filters });
    return response.data;
  },
};
