import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bold, Italic, Link as LinkIcon, List, Heading, Image as ImageIcon } from 'lucide-react';

const schema = z.object({
  title: z.string().min(3).max(120),
  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  duration: z.number().int(),
  description: z.string().max(500).optional().or(z.literal('')),
});

const DURATIONS = [15, 30, 45, 60, 90, 120];

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^a-z0-9-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+|-+$/g, '');   // Trim - from start of text
}

function EventTypeForm({ defaultValues, onSubmit, isSubmitting, onCancel }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || '',
      slug: defaultValues?.slug || '',
      duration: defaultValues?.duration || 15,
      description: defaultValues?.description || '',
    },
  });

  const title = watch('title');
  const slug = watch('slug');
  const { dirtyFields } = formState;

  // Auto-fill slug from title ONLY if the user hasn't explicitly modified the slug field
  useEffect(() => {
    if (!defaultValues && title && !dirtyFields.slug) {
      setValue('slug', slugify(title));
    } else if (!defaultValues && !title && !dirtyFields.slug) {
      setValue('slug', '');
    }
  }, [title, setValue, defaultValues, dirtyFields.slug]);

  // If user types manually in the slug field, actively format it to prevent errors
  const handleSlugChange = (e) => {
     let val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
     // Using register's onChange internally, but overriding value
     setValue('slug', val, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="p-6 sm:p-8 pb-6 bg-[#18181B] rounded-2xl w-full max-w-[500px] border border-zinc-800 shadow-2xl mx-auto sm:mx-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">{defaultValues ? 'Edit event type' : 'Add a new event type'}</h2>
        <p className="text-sm text-zinc-400 font-medium">Set up event types to offer different types of meetings.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-white">Title</label>
          <input
            type="text"
            placeholder="Quick chat"
            className="w-full rounded-xl border border-zinc-700 bg-[#121212] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 shadow-sm transition-all focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-medium"
          {...register('title')}
          />
          {(formState.isSubmitted || formState.dirtyFields.title) && formState.errors.title && <p className="mt-1 text-xs text-red-500">{String(formState.errors.title.message)}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-white">URL</label>
          <div className="relative flex rounded-xl border border-zinc-700 bg-[#121212] shadow-sm overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
            <span className="inline-flex items-center pl-4 pr-1 text-sm text-zinc-500 bg-[#121212] font-medium whitespace-nowrap">
              https://cal.com/keshav-jha-kqpvdn/
            </span>
            <input
              type="text"
              className="w-full flex-1 bg-transparent px-0 py-2.5 text-sm text-white focus:outline-none font-medium"
              {...register('slug')}
              onChange={handleSlugChange}
            />
          </div>
          {(formState.isSubmitted || formState.dirtyFields.slug) && formState.errors.slug && <p className="mt-1 text-xs text-red-500">{String(formState.errors.slug.message)}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-white">Description</label>
          <div className="rounded-xl border border-zinc-700 bg-[#121212] shadow-sm overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
             <div className="flex items-center gap-1 border-b border-zinc-800 bg-[#1C1C1C] px-2 py-1.5">
                <button type="button" className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><Bold size={15} /></button>
                <button type="button" className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><Italic size={15} /></button>
                <div className="w-px h-4 bg-zinc-700 mx-1" />
                <button type="button" className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><LinkIcon size={15} /></button>
                <button type="button" className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"><List size={15} /></button>
             </div>
            <textarea
              rows={3}
              placeholder="A quick video meeting."
              className="w-full resize-none bg-transparent px-3 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
              {...register('description')}
            />
          </div>
          {(formState.isSubmitted || formState.dirtyFields.description) && formState.errors.description && <p className="mt-1 text-xs text-red-500">{String(formState.errors.description.message)}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-white">Duration</label>
          <div className="relative">
             <input
               type="number"
               className="w-full rounded-xl border border-zinc-700 bg-[#121212] pl-3.5 pr-16 py-2.5 text-sm text-white shadow-sm transition-all focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-medium"
               {...register('duration', { valueAsNumber: true })}
             />
             <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <span className="text-sm font-medium text-zinc-500">minutes</span>
             </div>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white transition-colors focus:outline-none"
            onClick={onCancel}
          >
            Close
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-white text-black px-5 py-2 rounded-[10px] text-sm font-extrabold hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventTypeForm;
