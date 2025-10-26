import { useFlaggedItems, useApproveItem, useRejectItem } from '@/lib/hooks';
import AdminItemTable from '../components/admin/AdminItemTable';

export default function AdminDashboard() {
  const { data: flaggedItems = [], isLoading } = useFlaggedItems();
  const approveMutation = useApproveItem();
  const rejectMutation = useRejectItem();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage flagged items and moderate content</p>
      </div>

      <AdminItemTable
        items={flaggedItems}
        isLoading={isLoading}
        onApprove={id => approveMutation.mutate(id)}
        onReject={id => rejectMutation.mutate(id)}
      />
    </div>
  );
}
