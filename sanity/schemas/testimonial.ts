import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Event',
      type: 'string',
      description: 'e.g. "Bride, June 2024" or "Graduation Party"',
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      options: {
        list: [
          { title: '⭐⭐⭐⭐⭐ — 5 Stars', value: 5 },
          { title: '⭐⭐⭐⭐ — 4 Stars', value: 4 },
          { title: '⭐⭐⭐ — 3 Stars', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 5,
    }),
    defineField({
      name: 'photo',
      title: 'Client Photo (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
});
