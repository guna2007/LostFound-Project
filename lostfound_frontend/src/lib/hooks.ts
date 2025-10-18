import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { IItemCreate } from '../types/IItem';
import { fetchItems, fetchItemById, createItem, updateStatus, updateItem, deleteItem, login as apiLogin, type AuthResponse } from './api';

export function useItems(filters?: { status?: 'LOST' | 'FOUND'; category?: string; sortBy?: 'newest' | 'oldest' }) {
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

export function useItemById(id: number) {
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
          token: parsed.token,
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
      token: response.token,
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
    logout,
  };
}


