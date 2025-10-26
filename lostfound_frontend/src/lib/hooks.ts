import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { IItemCreate } from '../types/IItem';
import { fetchItems, fetchItemById, createItem, updateStatus, updateItem, deleteItem, login as apiLogin, type AuthResponse } from './api';
import { fetchFlaggedItems, approveItem, rejectItem, flagItem } from './api';

export function useItems(filters?: { status?: 'LOST' | 'FOUND'; category?: string; sortBy?: 'newest' | 'oldest'; query?: string; is_flagged?: boolean; page?: number; page_size?: number; reporter_id?: string }) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: async () => {
      const items = await fetchItems(filters);
      // Apply sorting on client side (mock)
      if (filters?.sortBy === 'oldest') {
        return [...items].reverse();
      }
      return items;
    },
    staleTime: 30_000,
  });
}

// Admin moderation hooks
export function useFlaggedItems() {
  return useQuery({ queryKey: ['flaggedItems'], queryFn: fetchFlaggedItems, staleTime: 30_000 });
}

export function useApproveItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedItems'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useRejectItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedItems'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useFlagItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => flagItem(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedItems'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });
}

export function useItemById(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItemById(id),
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
    mutationFn: ({ id, status }: { id: string; status: 'LOST' | 'FOUND' }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IItemCreate> }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// Authentication Hook
const AUTH_STORAGE_KEY = 'lostfound_auth';

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: string | null;
  userEmail: string | null;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthResponse;
        return {
          isLoggedIn: true,
          isAdmin: parsed.role === 'ADMIN',
          userId: parsed.userId,
          userEmail: parsed.email,
          token: parsed.token || null,
        };
      } catch {
        return {
          isLoggedIn: false,
          isAdmin: false,
          userId: null,
          userEmail: null,
          token: null,
        };
      }
    }
    return {
      isLoggedIn: false,
      isAdmin: false,
      userId: null,
      userEmail: null,
      token: null,
    };
  });

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiLogin(email, password);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    setAuthState({
      isLoggedIn: true,
      isAdmin: response.role === 'ADMIN',
      userId: response.userId,
      userEmail: response.email,
      token: response.token || null,
    });
  };

  const loginWithResponse = (response: AuthResponse): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    setAuthState({
      isLoggedIn: true,
      isAdmin: response.role === 'ADMIN',
      userId: response.userId,
      userEmail: response.email,
      token: response.token || null,
    });
  };

  const logout = (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      userId: null,
      userEmail: null,
      token: null,
    });
  };

  return {
    ...authState,
    login,
    loginWithResponse,
    logout,
  };
}


