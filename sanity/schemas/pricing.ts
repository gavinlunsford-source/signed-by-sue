import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricing',
  title: 'Pricing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'string',
      description: 'e.g. "Wedding Signs"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price ($)',
      type: 'number',
      description: 'Leave blank if this is a custom-quote-only service',
    }),
    defineField({
      name: 'isCustomQuote',
      title: 'Custom Quote Only',
      type: 'boolean',
      description: 'If checked, no starting price will be shown',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown on the pricing card',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startingPrice: 'startingPrice',
      isCustomQuote: 'isCustomQuote',
    },
    prepare({ title, startingPrice, isCustomQuote }) {
      return {
        title,
        subtitle: isCustomQuote ? 'Custom Quote' : startingPrice ? `Starting at $${startingPrice}` : 'No price set',
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
});
