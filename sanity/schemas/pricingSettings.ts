import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricingSettings',
  title: 'Pricing Settings',
  type: 'document',
  initialValue: {
    basePrice: 40,
    sizes: [
      { _key: 'sz1', label: 'Small (up to 24" × 36")', adder: 0 },
      { _key: 'sz2', label: 'Medium (up to 36" × 48")', adder: 10 },
      { _key: 'sz3', label: "Large (up to 5' × 3')", adder: 20 },
    ],
    complexityOptions: [
      { _key: 'cx1', label: 'Basic Lettering', description: 'Clean text only', adder: 0 },
      { _key: 'cx2', label: 'Decorative Elements', description: 'Simple florals or accents', adder: 10 },
      { _key: 'cx3', label: 'Detailed Artwork', description: 'More involved illustrations', adder: 20 },
      { _key: 'cx4', label: 'Custom Illustration', description: 'Fully custom drawn design', adder: 30 },
    ],
    materialOptions: [
      { _key: 'mt1', label: 'Paper', adder: 0, requiresCustomQuote: false },
      { _key: 'mt2', label: 'Customer-Provided Material', adder: 0, requiresCustomQuote: false },
      { _key: 'mt3', label: 'Mirror', adder: 20, requiresCustomQuote: false },
      { _key: 'mt4', label: 'Glass', adder: 20, requiresCustomQuote: false },
      { _key: 'mt5', label: 'Special Materials', adder: 0, requiresCustomQuote: true },
    ],
    rushOptions: [
      { _key: 'ru1', label: 'No rush — standard timeline', adder: 0 },
      { _key: 'ru2', label: 'Needed within 7 days', adder: 15 },
      { _key: 'ru3', label: 'Needed within 3 days', adder: 25 },
    ],
    startingPrices: [
      { _key: 'sp1', label: 'Wedding Signs', price: '$40' },
      { _key: 'sp2', label: 'Graduation Signs', price: '$40' },
      { _key: 'sp3', label: 'Missionary Farewell', price: '$40' },
      { _key: 'sp4', label: 'Bridal & Baby Showers', price: '$40' },
      { _key: 'sp5', label: 'Birthday & Event Signs', price: '$40' },
      { _key: 'sp6', label: 'Mirror Signs', price: '$60' },
      { _key: 'sp7', label: 'Custom Artwork', price: 'Quote' },
    ],
    exampleQuotes: [
      { _key: 'eq1', label: 'Graduation sign', note: 'Small + decorative elements', total: 50 },
      { _key: 'eq2', label: 'Large wedding sign', note: 'Large + decorative elements', total: 70 },
      { _key: 'eq3', label: 'Mirror welcome sign', note: 'Small + mirror + decorative', total: 70 },
      { _key: 'eq4', label: 'Detailed wedding sign', note: 'Large + detailed artwork', total: 80 },
      { _key: 'eq5', label: 'Large mirror w/ artwork', note: 'Large + mirror + detailed artwork', total: 100 },
    ],
  },
  fields: [
    defineField({
      name: 'basePrice',
      title: 'Base Price ($)',
      type: 'number',
      description: 'The starting price for every order before any add-ons.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'sizes',
      title: 'Size Options',
      type: 'array',
      description: 'Size choices shown in the estimator and quote form.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'adder', title: 'Price Add-On ($)', type: 'number', initialValue: 0, validation: (Rule) => Rule.required().min(0) }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'adder' },
          prepare: ({ title, subtitle }) => ({ title, subtitle: `+$${subtitle ?? 0}` }),
        },
      }],
    }),
    defineField({
      name: 'complexityOptions',
      title: 'Complexity Options',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'description', title: 'Short Description', type: 'string', description: 'Shown as a subtitle under the label' }),
          defineField({ name: 'adder', title: 'Price Add-On ($)', type: 'number', initialValue: 0, validation: (Rule) => Rule.required().min(0) }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'adder' },
          prepare: ({ title, subtitle }) => ({ title, subtitle: `+$${subtitle ?? 0}` }),
        },
      }],
    }),
    defineField({
      name: 'materialOptions',
      title: 'Material Options',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'adder', title: 'Price Add-On ($)', type: 'number', initialValue: 0, validation: (Rule) => Rule.min(0) }),
          defineField({
            name: 'requiresCustomQuote',
            title: 'Requires Custom Quote',
            type: 'boolean',
            description: 'If checked, no fixed add-on — the cost is determined when you respond to the request.',
            initialValue: false,
          }),
        ],
        preview: {
          select: { title: 'label', adder: 'adder', custom: 'requiresCustomQuote' },
          prepare: ({ title, adder, custom }) => ({
            title,
            subtitle: custom ? '+ custom cost' : `+$${adder ?? 0}`,
          }),
        },
      }],
    }),
    defineField({
      name: 'rushOptions',
      title: 'Rush Order Options',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'adder', title: 'Price Add-On ($)', type: 'number', initialValue: 0, validation: (Rule) => Rule.required().min(0) }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'adder' },
          prepare: ({ title, subtitle }) => ({ title, subtitle: (subtitle ?? 0) > 0 ? `+$${subtitle}` : 'No fee' }),
        },
      }],
    }),
    defineField({
      name: 'startingPrices',
      title: 'Starting Prices Strip',
      type: 'array',
      description: 'The row of prices shown at the top of the Pricing page.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Service Name', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "$40" or "Quote"', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'label', subtitle: 'price' } },
      }],
    }),
    defineField({
      name: 'exampleQuotes',
      title: 'Example Quotes',
      type: 'array',
      description: 'Sample quotes shown in the estimator sidebar.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Sign Description', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'note', title: 'Details', type: 'string', description: 'e.g. "Small + decorative elements"' }),
          defineField({ name: 'total', title: 'Total ($)', type: 'number', validation: (Rule) => Rule.required().min(0) }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'total' },
          prepare: ({ title, subtitle }) => ({ title, subtitle: `$${subtitle}` }),
        },
      }],
    }),
  ],
});
