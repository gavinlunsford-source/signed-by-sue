import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Page Headline',
      type: 'string',
      initialValue: 'The Artist Behind the Signs',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
    }),
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      initialValue: 'Hallie',
    }),
    defineField({
      name: 'photo',
      title: 'Artist Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'story',
      title: 'Story (Rich Text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'values',
      title: 'What Drives Me (short phrases)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Handmade with love", "Every piece is one-of-a-kind"',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Process / Studio Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
});
