import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/sections/Navbar';
import { Hero } from '../components/sections/Hero';
import { Stats } from '../components/sections/Stats';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { Services } from '../components/sections/Services';
import { Doctors } from '../components/sections/Doctors';
import { Facilities } from '../components/sections/Facilities';
import { PatientJourney } from '../components/sections/PatientJourney';
import { CallbackForm } from '../components/sections/CallbackForm';
import { Testimonials } from '../components/sections/Testimonials';
import { FAQ } from '../components/sections/FAQ';
import { BlogSection } from '../components/sections/BlogSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/sections/Footer';

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    // Purge old local storage data that contains old branding (Aditi) or old placeholder images (pexels)
    const keys = ['db_facilities', 'db_doctors', 'db_testimonials', 'db_hospital_settings', 'db_services', 'db_blog_posts'];
    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val && (val.includes('pexels.com') || val.includes('Aditi') || val.includes('aditi'))) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }, 150);
      }
    }
  }, [hash]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <WhyChooseUs />
        <Services />
        <Doctors />
        <Facilities />
        <PatientJourney />
        <CallbackForm />
        <Testimonials />
        <FAQ />
        <BlogSection />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
