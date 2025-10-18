import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IItem } from '@/types/IItem';
import { ITEM_CATEGORIES } from '@/lib/utils';
import { useAddItem, useUpdateItem } from '@/lib/hooks';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['lost', 'found']),
  location: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  contact_info: z.string().optional(),
  image_url: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export interface ItemFormProps {
  item?: IItem;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultStatus?: 'lost' | 'found';
}

export default function ItemForm({ item, onSuccess, onCancel, defaultStatus = 'lost' }: ItemFormProps) {
  const isEdit = Boolean(item);
  const { mutateAsync: addItem, isPending: isCreating } = useAddItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: item?.title || '',
      description: item?.description || '',
      category: item?.ai_category || '',
      status: item?.status ? item.status.toLowerCase() as 'lost' | 'found' : defaultStatus,
      location: item?.location || '',
      date: item?.date || '',
      contact_info: item?.contact_info || '',
      image_url: item?.image_url || '',
    },
  });

  const isSubmitting = isCreating || isUpdating;

  async function onSubmit(values: ItemFormValues) {
    try {
      if (isEdit && item) {
        await updateItem({
          id: item.id,
          data: {
            title: values.title,
            description: values.description,
            image_url: values.image_url || 'https://via.placeholder.com/400?text=Item',
            status: values.status.toUpperCase() as 'LOST' | 'FOUND',
            ai_category: values.category,
            location: values.location,
            date: values.date,
            contact_info: values.contact_info,
          },
        });
        toast.success('Item updated');
      } else {
        await addItem({
          title: values.title,
          description: values.description,
          image_url: values.image_url || 'https://via.placeholder.com/400?text=Item',
          status: values.status.toUpperCase() as 'LOST' | 'FOUND',
          ai_category: values.category,
          location: values.location,
          date: values.date,
          contact_info: values.contact_info,
        });
        toast.success('Item created');
        form.reset();
      }
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Title" placeholder="Item title" {...form.register('title')} />
        <Select label="Category" {...form.register('category')}>
          <option value="">Select category</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select label="Status" {...form.register('status')}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </Select>
        <Input label="Date" type="date" {...form.register('date')} />

        <Input label="Location (optional)" placeholder="e.g., Library, Park" {...form.register('location')} />
        <Input label="Contact Info (optional)" placeholder="email or phone" {...form.register('contact_info')} />

        <Input label="Image URL (optional)" placeholder="https://..." {...form.register('image_url')} />
        <div />
      </div>

      <Textarea label="Description" placeholder="Describe the item..." {...form.register('description')} />

      <div className="flex items-center gap-3">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isEdit ? 'Update Item' : 'Create Item'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>

      {/* Field errors */}
      <div className="space-y-1 text-sm text-red-600">
        {Object.entries(form.formState.errors).map(([key, val]) => (
          <div key={key}>{val?.message as string}</div>
        ))}
      </div>
    </form>
  );
}


