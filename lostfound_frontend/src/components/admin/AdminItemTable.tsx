import type { IItem } from '@/types/IItem';
import AdminItemRow from './AdminItemRow';
// Removed internal hooks and toast; actions are now passed as props

export interface AdminItemTableProps {
  items: IItem[];
  isLoading?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AdminItemTable({ items, isLoading, onApprove, onReject }: AdminItemTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded border bg-white" />
        ))}
      </div>
    );
  }

  // Always display all items passed as props, no additional filtering
  if (!items || items.length === 0) {
    return <div className="rounded border bg-white p-6 text-center text-gray-600">No flagged items</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <AdminItemRow
              key={item.id}
              item={item}
              onApprove={onApprove}
              onReject={onReject}
              isLoading={isLoading}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


