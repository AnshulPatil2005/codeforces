import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/api';

export const useDashboard = (handle: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['dashboard', handle],
    queryFn: () => userApi.getDashboard(handle),
    enabled: enabled && !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
