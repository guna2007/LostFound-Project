import type { IItem, IItemCreate } from '../types/IItem';
import axios from 'axios';
import { getApiErrorMessage } from './utils';

// Config
export const BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8000';
const api = axios.create({ baseURL: BASE_URL, withCredentials: false });

// Adapter: Backend ItemResponse -> Frontend IItem
function adaptItem(item: any): IItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url ?? '',
    status: item.status,
    is_flagged: !!(item.is_flagged || item.flagged || item.flagged_reason),
    ai_category: item.category ?? item.ai_category_prediction ?? 'Other',
    reporter_id: String(item.reporter_id),
    location: item.location ?? undefined,
    date: item.date ? new Date(item.date).toISOString() : undefined,
    contact_info: item.contact_info ?? undefined,
    flagged_reason: item.flagged_reason ?? item.flag_reason ?? '',
  } as IItem;
}

function toISODateTime(value?: string): string | undefined {
  if (!value) return undefined;
  // If already looks like ISO datetime
  if (value.includes('T')) return new Date(value).toISOString();
  // Interpret as local date and convert to UTC ISO
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function isUuidLike(v?: string): boolean {
  if (!v) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

// Read-only endpoints integrated first (Module 1)
export async function fetchUsers(): Promise<Array<{ id: string; email: string; name: string }>> {
  try {
    const { data } = await api.get('/users');
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
}
export async function fetchItems(filters?: {
  status?: 'LOST' | 'FOUND';
  category?: string;
  query?: string;
  is_flagged?: boolean;
  page?: number;
  page_size?: number;
  reporter_id?: string;
}): Promise<IItem[]> {
  const params: Record<string, any> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.category) params.category = filters.category;
  if (filters?.query) params.query = filters.query;
  if (typeof filters?.is_flagged === 'boolean') params.is_flagged = filters.is_flagged;
  if (filters?.page) params.page = filters.page;
  if (filters?.page_size) params.page_size = filters.page_size;
  if (filters?.reporter_id) params.reporter_id = filters.reporter_id;

  try {
    const { data } = await api.get('/items', { params });
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : [];
    return items.map(adaptItem);
  } catch (err) {
    // Return empty array for safe fallback (list endpoints should not break UI)
    console.warn('Failed to fetch items:', getApiErrorMessage(err));
    return [];
  }
}

export async function fetchItemById(id: string): Promise<IItem> {
  if (!isUuidLike(id)) {
    throw new Error('Invalid item ID');
  }
  try {
    const { data } = await api.get(`/items/${id}`);
    return adaptItem(data);
  } catch (e) {
    const msg = getApiErrorMessage(e);
    throw new Error(msg || 'Item not found');
  }
}

// Mutations
export async function createItem(data: IItemCreate): Promise<IItem> {
  try {
    const backendPayload = {
      title: data.title,
      description: data.description,
      category: data.ai_category || 'Others',
      status: data.status,
      location: data.location || 'Unknown',
      date: toISODateTime(data.date) || new Date().toISOString(),
      image_url: data.image_url || null,
      contact_info: data.contact_info || null,
      reporter_id: data.reporter_id,
    };
    if (!isUuidLike(backendPayload.reporter_id)) {
      const users = await fetchUsers();
      if (users.length > 0) {
        backendPayload.reporter_id = users[0].id;
      }
    }
    const { data: created } = await api.post('/items', backendPayload);
    return adaptItem(created);
  } catch (e) {
    // Provide normalized error to callers; fallback to mock item for offline/demo flows
    const msg = getApiErrorMessage(e);
    try {
      const tempUuid = crypto?.randomUUID?.() ?? `${Date.now()}-tmp`;
      return adaptItem({ id: tempUuid, ...data, is_flagged: false });
    } finally {
      // still throw so UI can show the error if desired
      throw new Error(msg || 'Failed to create item');
    }
  }
}

export async function fetchFlaggedItems(): Promise<IItem[]> {
  try {
    const { data } = await api.get('/items', { params: { is_flagged: true } });
    
    // Handle both array and wrapped response formats
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : [];
    
    return items.map(adaptItem);
  } catch (err) {
    // Return empty array for safe fallback (list endpoints should not break UI)
    console.warn('Failed to fetch flagged items:', getApiErrorMessage(err));
    return [];
  }
}

export async function approveItem(id: string): Promise<IItem> {
  const { data } = await api.patch(`/admin/items/${id}/approve`);
  return adaptItem(data);
}

export async function rejectItem(id: string): Promise<void> {
  await api.delete(`/admin/items/${id}`);
}

export async function flagItem(id: string, reason?: string): Promise<IItem> {
  const { data } = await api.patch(`/items/${id}/flag`, {
    reason: reason || 'Inappropriate content reported by user',
  });
  return adaptItem(data);
}

export async function updateStatus(id: string, status: 'LOST' | 'FOUND'): Promise<IItem> {
  const { data } = await api.patch(`/items/${id}/status`, { status });
  return adaptItem(data);
}

export async function updateItem(id: string, data: Partial<IItemCreate>): Promise<IItem> {
  const { data: updated } = await api.patch(`/items/${id}`, data);
  return adaptItem(updated);
}

export async function deleteItem({ id }: { id: string }): Promise<void> {
  await api.delete(`/items/${id}`);
}

// (Removed duplicate deleteItem implementation)

// Authentication API
export interface AuthResponse {
  userId: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  token?: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return {
      userId: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      token: `session-${data.id}-${Date.now()}`, // Generate session token
    };
  } catch (error: any) {
    // Fallback to seed users for demo purposes
    if (email === 'admin@lostfound.com') {
      const users = await fetchUsers();
      const admin = users.find(u => u.email === 'admin@lostfound.com');
      if (admin) {
        return {
          userId: admin.id,
          email: admin.email,
          name: admin.name || 'Admin User',
          role: 'ADMIN',
          token: `session-${admin.id}-${Date.now()}`,
        };
      }
    }
    if (email === 'user@lostfound.com') {
      const users = await fetchUsers();
      const user = users.find(u => u.email === 'user@lostfound.com');
      if (user) {
        return {
          userId: user.id,
          email: user.email,
          name: user.name || 'Demo User',
          role: 'USER',
          token: `session-${user.id}-${Date.now()}`,
        };
      }
    }
    const msg = getApiErrorMessage(error);
    throw new Error(msg || 'Invalid email or password');
  }
}

export async function register(
  email: string,
  _password: string, // Not used in backend yet (demo mode)
  name: string
): Promise<{ success: boolean; message: string; user?: AuthResponse }> {
  try {
    const { data } = await api.post('/users', {
      email,
      name,
      role: 'USER',
    });
    
    return {
      success: true,
      message: 'Registration successful! Logging you in...',
      user: {
        userId: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        token: `session-${data.id}-${Date.now()}`,
      },
    };
  } catch (error: any) {
    const msg = getApiErrorMessage(error);
    if (error?.response?.status === 400) {
      throw new Error('Email already registered');
    }
    throw new Error(msg || 'Registration failed. Please try again.');
  }
}


