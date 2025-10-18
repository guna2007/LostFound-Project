import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IItemCreate } from '../types/IItem';
import { fetchItems, createItem, updateStatus, updateItem, deleteItem } from './api';

export function useItems(filters?: { status?: 'LOST' | 'FOUND'; category?: string }) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => fetchItems(filters),
    staleTime: 30_000,
  });
}

export function useAddItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IItemCreate) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'LOST' | 'FOUND' }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IItemCreate> }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}


