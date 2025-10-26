import type { IItem } from '@/types/IItem';
import { STATUS_COLORS, getCategoryColor, cn } from '@/lib/utils';

export interface ItemCardProps {
  item: IItem;
  onClick?: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const statusColor = STATUS_COLORS[item.status];
  const categoryColor = getCategoryColor(item.ai_category);

  const postedDate = item.date ? new Date(item.date) : undefined;
  const postedLabel = postedDate
    ? `Posted on ${postedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`
    : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      className="relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      {item.is_flagged && (
        <div className="absolute right-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Flagged
        </div>
      )}

      <div className="aspect-square w-full bg-gray-100">
        <img
          src={item.image_url || 'https://via.placeholder.com/400?text=No+Image'}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900" title={item.title}>
            {item.title}
          </h3>
          <span className={cn('whitespace-nowrap rounded px-2 py-1 text-xs font-medium', statusColor)}>
            {item.status}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-gray-600" title={item.description}>
          {item.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className={cn('rounded px-2 py-1 text-xs font-medium', categoryColor)}>
            {item.ai_category}
          </span>
          {item.location && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{item.location}</span>
          )}
          {postedLabel && <span className="text-xs text-gray-500">{postedLabel}</span>}
        </div>
      </div>
    </div>
  );
}


