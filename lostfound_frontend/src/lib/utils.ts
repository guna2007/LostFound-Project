export function cn(...args: string[]): string {
  return args.filter(Boolean).join(' ');
}

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


