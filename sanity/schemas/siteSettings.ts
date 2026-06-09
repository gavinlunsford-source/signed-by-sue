import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', title: 'Business Name', type: 'string', initialValue: 'Signed by Sue' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', initialValue: 'Made by Hand. Made for Memories.' }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram Handle (without @)', type: 'string' }),
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
