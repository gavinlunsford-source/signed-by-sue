import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'quoteRequest',
  title: 'Quote Requests',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'eventType', title: 'Event Type', type: 'string' }),
    defineField({ name: 'eventDate', title: 'Event Date', type: 'string' }),
    defineField({ name: 'size', title: 'Size', type: 'string' }),
    defineField({ name: 'complexity', title: 'Complexity', type: 'string' }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'rush', title: 'Rush', type: 'string' }),
    defineField({ name: 'estimatedTotal', title: 'Estimated Total', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'inspirationLinks', title: 'Inspiration Links', type: 'text' }),
    defineField({ name: 'photoCount', title: 'Photos Attached', type: 'number' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🆕 New', value: 'new' },
          { title: '💬 In Discussion', value: 'in-discussion' },
          { title: '✅ Quoted', value: 'quoted' },
          { title: '🎨 In Progress', value: 'in-progress' },
          { title: '✓ Complete', value: 'complete' },
          { title: '✗ Declined', value: 'declined' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({ name: 'notes', title: 'Your Notes', type: 'text', description: 'Private notes — not visible to the client' }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'eventType',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, status, date }) {
      const statusEmoji: Record<string, string> = {
        new: '🆕', 'in-discussion': '💬', quoted: '✅', 'in-progress': '🎨', complete: '✓', declined: '✗',
      };
      const d = date ? new Date(date).toLocaleDateString() : '';
      return {
        title: `${statusEmoji[status] ?? '🆕'} ${title}`,
        subtitle: `${subtitle ?? ''}${d ? ` · ${d}` : ''}`,
      };
    },
  },
  orderings: [
    { title: 'Newest First', name: 'dateDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
});
