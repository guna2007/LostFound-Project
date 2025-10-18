import { IItem } from '@/types/IItem';
import AdminItemRow from './AdminItemRow';
import { useDeleteItem, useItems, useUpdateItem } from '@/lib/hooks';
import toast from 'react-hot-toast';

export interface AdminItemTableProps {
  items?: IItem[];
  isLoading?: boolean;
}

export default function AdminItemTable({ items, isLoading }: AdminItemTableProps) {
  const { data, isLoading: isFetching } = useItems();
  const flagged = (items ?? data ?? []).filter((i) => i.is_flagged);
  const loading = isLoading || isFetching;

  const { mutateAsync: updateItem, isPending: approving } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: rejecting } = useDeleteItem();

  async function handleApprove(id: number) {
    try {
      await updateItem({ id, data: { is_flagged: false } });
      toast.success('Item approved');
    } catch {
      toast.error('Failed to approve item');
    }
  }

  async function handleReject(id: number) {
    const confirmed = window.confirm('Are you sure you want to reject and remove this item?');
    if (!confirmed) return;
    try {
      await deleteItem({ id });
      toast.success('Item rejected and removed');
    } catch {
      toast.error('Failed to reject item');
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded border bg-white" />
        ))}
      </div>
    );
  }

  if (flagged.length === 0) {
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
          {flagged.map((item) => (
            <AdminItemRow
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={approving || rejecting}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


