import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const singletonTypes = new Set(['homePage', 'aboutPage', 'siteSettings']);

export default defineConfig({
  name: 'signed-by-sue',
  title: 'Signed by Sue — Content Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('About Page')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('quoteRequest').title('Quote Requests').child(
              S.documentList().title('Quote Requests').filter('_type == "quoteRequest"').schemaType('quoteRequest')
            ),
            S.divider(),
            S.documentTypeListItem('portfolio').title('Portfolio').child(
              S.documentList().title('Portfolio Projects').filter('_type == "portfolio"').schemaType('portfolio')
            ),
            S.documentTypeListItem('pricing').title('Pricing').child(
              S.documentList().title('Pricing').filter('_type == "pricing"').schemaType('pricing')
            ),
            S.documentTypeListItem('testimonial').title('Testimonials').child(
              S.documentList().title('Testimonials').filter('_type == "testimonial"').schemaType('testimonial')
            ),
            S.documentTypeListItem('faq').title('FAQs').child(
              S.documentList().title('FAQs').filter('_type == "faq"').schemaType('faq')
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !singletonTypes.has(item.templateId));
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete');
      }
      return prev;
    },
  },
});
