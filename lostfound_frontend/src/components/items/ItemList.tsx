import { IItem } from '@/types/IItem';
import ItemCard from './ItemCard';

export interface ItemListProps {
  items: IItem[];
  onItemClick: (id: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ItemList({ items, onItemClick, isLoading, emptyMessage = 'No items found.' }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-3 h-40 w-full rounded bg-gray-200" />
            <div className="mb-2 h-4 w-2/3 rounded bg-gray-200" />
            <div className="mb-2 h-3 w-full rounded bg-gray-200" />
            <div className="mb-2 h-3 w-5/6 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <div className="rounded border bg-white p-6 text-center text-gray-600">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />
      ))}
    </div>
  );
}


