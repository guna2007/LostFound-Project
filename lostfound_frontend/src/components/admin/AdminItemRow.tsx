import { IItem } from '@/types/IItem';
import { STATUS_COLORS, getCategoryColor, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface AdminItemRowProps {
  item: IItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isLoading?: boolean;
}

export default function AdminItemRow({ item, onApprove, onReject, isLoading }: AdminItemRowProps) {
  const statusColor = STATUS_COLORS[item.status];

  const postedDate = item.date ? new Date(item.date) : undefined;
  const postedLabel = postedDate
    ? postedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <img src={item.image_url} alt={item.title} className="h-12 w-12 rounded object-cover" />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
      <td className="px-4 py-3 text-sm">
        <span className={cn('rounded px-2 py-1 text-xs font-medium', statusColor)}>{item.status}</span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={cn('rounded px-2 py-1 text-xs font-medium', getCategoryColor(item.ai_category))}>{item.ai_category}</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{postedLabel}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{item.flagged_reason || '-'}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button
            aria-label="Approve item"
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => onApprove(item.id)}
            disabled={isLoading}
          >
            Approve
          </Button>
          <Button
            aria-label="Reject item"
            variant="outline"
            className="border-red-600 text-red-700 hover:bg-red-50"
            onClick={() => onReject(item.id)}
            disabled={isLoading}
          >
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
}


