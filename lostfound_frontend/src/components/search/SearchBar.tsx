import { useEffect, useState } from 'react';
import { ITEM_CATEGORIES } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: 'lost' | 'found' | 'all') => void;
}

export default function SearchBar({ onSearch, onCategoryChange, onStatusChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'lost' | 'found' | 'all'>('all');

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    onCategoryChange(category);
  }, [category, onCategoryChange]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  function handleReset() {
    setQuery('');
    setCategory('');
    setStatus('all');
    onSearch('');
    onCategoryChange('');
    onStatusChange('all');
  }

  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as 'lost' | 'found' | 'all')}>
          <option value="all">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </Select>

        <div className="flex items-end">
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}


