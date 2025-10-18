import type { IItem, IItemCreate } from '../types/IItem';
import { MOCK_USER_ID, MOCK_ADMIN_ID } from './utils';

const NETWORK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock items with reporter_id assigned
const items: IItem[] = [
  {
    id: 1,
    title: 'Black Wallet',
    description: 'Leather wallet with several cards inside.',
    image_url: 'https://placedog.net/400/400?id=1',
    status: 'LOST',
    is_flagged: true,
    ai_category: 'Accessories',
    reporter_id: MOCK_USER_ID, // User's item
  },
  {
    id: 2,
    title: 'Silver Keys',
    description: 'Set of house and car keys on a red keychain.',
    image_url: 'https://placedog.net/400/400?id=2',
    status: 'FOUND',
    is_flagged: false,
    ai_category: 'Keys',
    reporter_id: 'user-789', // Other user's item
  },
  {
    id: 3,
    title: 'Blue Backpack',
    description: 'Blue backpack with laptop sleeve, slightly worn.',
    image_url: 'https://placedog.net/400/400?id=3',
    status: 'LOST',
    is_flagged: false,
    ai_category: 'Accessories',
    reporter_id: MOCK_USER_ID, // User's item
  },
  {
    id: 4,
    title: 'Kindle Reader',
    description: 'E-reader with a few sci-fi books.',
    image_url: 'https://placedog.net/400/400?id=4',
    status: 'FOUND',
    is_flagged: true,
    ai_category: 'Electronics',
    reporter_id: 'user-555', // Other user's item
  },
  {
    id: 5,
    title: 'University ID Card',
    description: 'Student ID with name blurred out.',
    image_url: 'https://placedog.net/400/400?id=5',
    status: 'LOST',
    is_flagged: false,
    ai_category: 'Documents',
    reporter_id: MOCK_USER_ID, // User's item
  },
  {
    id: 6,
    title: 'Black Headphones',
    description: 'Over-ear noise-cancelling headphones.',
    image_url: 'https://placedog.net/400/400?id=6',
    status: 'FOUND',
    is_flagged: false,
    ai_category: 'Electronics',
    reporter_id: 'user-999', // Other user's item
  },
  {
    id: 7,
    title: 'Paperback Book - Dune',
    description: 'Sci-fi classic paperback edition.',
    image_url: 'https://placedog.net/400/400?id=7',
    status: 'LOST',
    is_flagged: false,
    ai_category: 'Books',
    reporter_id: 'user-333', // Other user's item
  },
  {
    id: 8,
    title: 'Fitness Watch',
    description: 'Black strap, screen has a small scratch.',
    image_url: 'https://placedog.net/400/400?id=8',
    status: 'FOUND',
    is_flagged: true,
    ai_category: 'Wearables',
    reporter_id: MOCK_USER_ID, // User's item
  },
  {
    id: 9,
    title: 'Sunglasses',
    description: 'Brown frame aviator sunglasses.',
    image_url: 'https://placedog.net/400/400?id=9',
    status: 'LOST',
    is_flagged: false,
    ai_category: 'Accessories',
    reporter_id: 'user-222', // Other user's item
  },
  {
    id: 10,
    title: 'Notebook',
    description: 'Small ruled notebook with project sketches.',
    image_url: 'https://placedog.net/400/400?id=10',
    status: 'FOUND',
    is_flagged: false,
    ai_category: 'Documents',
    reporter_id: MOCK_USER_ID, // User's item
  },
];

export async function fetchItems(filters?: {
  status?: 'LOST' | 'FOUND';
  category?: string;
}): Promise<IItem[]> {
  await delay(NETWORK_DELAY_MS);
  let result = items.slice();
  if (filters?.status) {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters?.category) {
    result = result.filter((i) => i.ai_category === filters.category);
  }
  return result;
}

export async function fetchItemById(id: number): Promise<IItem> {
  await delay(NETWORK_DELAY_MS);
  const item = items.find((i) => i.id === id);
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
}

export async function createItem(data: IItemCreate): Promise<IItem> {
  await delay(NETWORK_DELAY_MS);
  const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem: IItem = { id: nextId, is_flagged: false, ...data };
  items.push(newItem);
  return newItem;
}

export async function updateStatus(
  id: number,
  status: 'LOST' | 'FOUND'
): Promise<IItem> {
  await delay(NETWORK_DELAY_MS);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    throw new Error('Item not found');
  }
  items[idx] = { ...items[idx], status };
  return items[idx];
}

export async function updateItem(id: number, data: Partial<IItemCreate>): Promise<IItem> {
  await delay(NETWORK_DELAY_MS);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  items[idx] = { ...items[idx], ...data } as IItem;
  return items[idx];
}

export async function deleteItem(id: number): Promise<{ id: number }> {
  await delay(NETWORK_DELAY_MS);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  items.splice(idx, 1);
  return { id };
}

// Authentication API (Mock)
export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  await delay(NETWORK_DELAY_MS);
  
  // Mock credentials
  if (email === 'admin@lostfound.com' && password === 'admin123') {
    return {
      token: 'mock-admin-token-' + Date.now(),
      userId: MOCK_ADMIN_ID,
      email: 'admin@lostfound.com',
      role: 'ADMIN',
    };
  }
  
  if (email === 'user@lostfound.com' && password === 'user123') {
    return {
      token: 'mock-user-token-' + Date.now(),
      userId: MOCK_USER_ID,
      email: 'user@lostfound.com',
      role: 'USER',
    };
  }
  
  throw new Error('Invalid email or password');
}

export async function register(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
  await delay(NETWORK_DELAY_MS);
  
  // Mock registration - always succeeds
  return {
    success: true,
    message: 'Registration successful! Please login with your credentials.',
  };
}


