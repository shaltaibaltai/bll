import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { S3Service } from '@/services/s3Service';
import { Tournament } from '@/types';
import { useAppSelector } from '@/store/hooks';

export const useTournaments = () => {
  const token = useAppSelector(state => state.auth.token);

  return useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const s3 = new S3Service(token || undefined);
      return await s3.getTournaments();
    },
  });
};

export const useAddTournament = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector(state => state.auth.token);

  return useMutation({
    mutationFn: async (tournament: Tournament) => {
      if (!token) throw new Error('Not authenticated');
      const s3 = new S3Service(token);
      await s3.addTournament(tournament);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector(state => state.auth.token);

  return useMutation({
    mutationFn: async (tournament: Tournament) => {
      if (!token) throw new Error('Not authenticated');
      const s3 = new S3Service(token);
      await s3.updateTournament(tournament);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  const token = useAppSelector(state => state.auth.token);

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      const s3 = new S3Service(token);
      await s3.deleteTournament(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });
};
