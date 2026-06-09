import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'portfolio',
  title: 'Portfolio Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Weddings', value: 'weddings' },
          { title: 'Graduations', value: 'graduations' },
          { title: 'Missionary Farewells', value: 'missionary-farewells' },
          { title: 'Showers', value: 'showers' },
          { title: 'Birthdays', value: 'birthdays' },
          { title: 'Mirrors & Glass', value: 'mirrors-glass' },
          { title: 'Custom Artwork', value: 'custom-artwork' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Short description of the image for accessibility',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      description: 'Show this piece in the Featured Work section on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name (optional)',
      type: 'string',
      description: 'Displayed as "For [Name]" — leave blank to keep private',
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'images.0',
    },
    prepare({ title, category, media }) {
      const labels: Record<string, string> = {
        weddings: 'Wedding',
        graduations: 'Graduation',
        'missionary-farewells': 'Missionary Farewell',
        showers: 'Shower',
        birthdays: 'Birthday',
        'mirrors-glass': 'Mirror & Glass',
        'custom-artwork': 'Custom Artwork',
      };
      return {
        title,
        subtitle: labels[category] ?? category,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
});
