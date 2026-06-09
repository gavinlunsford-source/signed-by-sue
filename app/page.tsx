import Hero from '@/components/sections/Hero';
import FeaturedWork from '@/components/sections/FeaturedWork';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import Services from '@/components/sections/Services';
import FinalCTA from '@/components/sections/FinalCTA';
import { getHomePage, getFeaturedProjects, getTestimonials } from '@/sanity/queries';

export const revalidate = 60;

export default async function HomePage() {
  const [homePage, featured, testimonials] = await Promise.allSettled([
    getHomePage(),
    getFeaturedProjects(),
    getTestimonials(true),
  ]);

  const homeData = homePage.status === 'fulfilled' ? homePage.value : null;
  const featuredData = featured.status === 'fulfilled' ? featured.value : [];
  const testimonialsData = testimonials.status === 'fulfilled' ? testimonials.value : [];

  return (
    <>
      <Hero
        headline={homeData?.heroHeadline}
        subheadline={homeData?.heroSubheadline}
        cta={homeData?.heroCTA}
      />
      <FeaturedWork projects={homeData?.featuredPortfolioItems ?? featuredData} />
      <HowItWorks steps={homeData?.howItWorksSteps} />
      <Services headline={homeData?.sectionServicesHeadline} />
      <Testimonials
        testimonials={testimonialsData}
        headline={homeData?.sectionTestimonialsHeadline}
      />
      <FinalCTA
        headline={homeData?.finalCTAHeadline}
        subtext={homeData?.finalCTASubtext}
      />
    </>
  );
}
