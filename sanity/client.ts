import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = '2024-01-01';

export const isSanityConfigured = Boolean(projectId);

export const client = createClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
});

export const previewClient = createClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
