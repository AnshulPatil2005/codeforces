export interface Problem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
  solved_count?: number;
}

export interface ProblemFilters {
  tags?: string;
  min_rating?: number;
  max_rating?: number;
  search?: string;
  sort_by?: string;
  limit?: number;
  offset?: number;
}

export interface ProblemsResponse {
  problems: Problem[];
  total: number;
  limit: number;
  offset: number;
}
