export function cn(...args: Array<string | false | undefined | null>): string {
  return args.filter(Boolean).join(' ');
}

// Mock user IDs for development/testing
export const MOCK_USER_ID = 'user-123';
export const MOCK_ADMIN_ID = 'admin-456';

export const ITEM_CATEGORIES: string[] = [
  'Electronics',
  'Documents',
  'Wearables',
  'Accessories',
  'Books',
  'Keys',
  'Others',
];

export const STATUS_COLORS: Record<'LOST' | 'FOUND', string> = {
  LOST: 'bg-orange-600 text-white',
  FOUND: 'bg-blue-600 text-white',
};

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Electronics':
      return 'bg-indigo-600 text-white';
    case 'Documents':
      return 'bg-amber-600 text-white';
    case 'Wearables':
      return 'bg-emerald-600 text-white';
    case 'Accessories':
      return 'bg-pink-600 text-white';
    case 'Books':
      return 'bg-purple-600 text-white';
    case 'Keys':
      return 'bg-slate-600 text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

// Normalize various error shapes (Axios, Error, unknown) into a user-friendly string
export function getApiErrorMessage(err: unknown): string {
  // Axios-style
  const anyErr = err as any;
  if (!err) return 'Unknown error';
  if (anyErr?.isAxiosError) {
    // Try response message
    const resp = anyErr.response;
    if (resp?.data?.message) return String(resp.data.message);
    if (resp?.data?.error) return String(resp.data.error);
    if (resp?.statusText) return `${resp.status} ${resp.statusText}`;
    return `Network error${resp?.status ? ` (${resp.status})` : ''}`;
  }
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}


