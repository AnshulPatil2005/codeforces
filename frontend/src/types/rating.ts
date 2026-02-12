export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
  rating_change: number;
}

export interface MonthlyGrowth {
  month: string;
  change: number;
  contests: number;
}

export interface PerformanceMetrics {
  total_contests: number;
  average_rank: number;
  positive_contests: number;
  negative_contests: number;
  average_change: number;
  best_rank: number;
}

export interface DashboardStats {
  current_rating: number;
  max_rating: number;
  last_change: number;
  total_contests: number;
  current_rank?: string;
  max_rank?: string;
}

export interface Streaks {
  current_streak: number;
  best_streak: number;
}

export interface PeakRating {
  rating: number;
  contest: string;
  date: string;
  contest_id: number;
}

export interface Insights {
  volatility: number;
  streaks: Streaks;
  peak_rating: PeakRating;
}
