import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      initialValue: "Custom Hand-Painted Signs for Life's Biggest Moments",
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      initialValue:
        'Custom artwork for weddings, graduations, missionary farewells, showers, birthdays, and celebrations of every kind.',
    }),
    defineField({
      name: 'heroCTA',
      title: 'Hero Button Text',
      type: 'string',
      initialValue: 'Get a Custom Quote',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'How It Works — Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Step Number', type: 'number' }),
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'stepNumber' },
            prepare: ({ title, subtitle }) => ({ title, subtitle: `Step ${subtitle}` }),
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredPortfolioItems',
      title: 'Featured Portfolio Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'portfolio' }] }],
      description: 'Choose up to 6 pieces to highlight on the homepage',
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'sectionServicesHeadline',
      title: 'Services Section Headline',
      type: 'string',
      initialValue: 'Something Beautiful for Every Occasion',
    }),
    defineField({
      name: 'sectionTestimonialsHeadline',
      title: 'Testimonials Section Headline',
      type: 'string',
      initialValue: 'Words from Clients',
    }),
    defineField({
      name: 'finalCTAHeadline',
      title: 'Final CTA Headline',
      type: 'string',
      initialValue: 'Ready to Create Something Unforgettable?',
    }),
    defineField({
      name: 'finalCTASubtext',
      title: 'Final CTA Subtext',
      type: 'text',
      rows: 2,
      initialValue:
        "Every sign starts with a conversation. Tell me about your event and I'll bring your vision to life.",
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage Content' }),
  },
});
