import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useAnimation';
import { useHospitalSettings } from '../../hooks/useContent';

export function Hero() {
  const { ref, isInView } = useInView(0.1);
  const { settings } = useHospitalSettings();
  const heroImage = settings.hero_image;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
  }, [heroImage]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70 z-10" />
        <img
          src={heroImage}
          alt="Modern healthcare facility"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-20">
        <div
          className={`max-w-3xl transition-all duration-700 ${
            isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 transition-all duration-500 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse" />
            Trusted Healthcare in Bengaluru
          </div>

          {/* Headline */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight mb-6 transition-all duration-700 delay-200 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Your Health,{' '}
            <span className="text-primary">Our Utmost Priority</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-body leading-relaxed mb-8 max-w-2xl transition-all duration-700 delay-300 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Providing premium dental care, general health consultations, wellness therapies,
            and professional ortho-physiotherapy for the Bengaluru community.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              variant="primary"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
              onClick={() => scrollToSection('#callback')}
            >
              Request Callback
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
              onClick={() => scrollToSection('#contact')}
            >
              Contact Us
            </Button>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mt-12 pt-8 border-t border-border/50 transition-all duration-700 delay-500 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center text-muted">
                <svg
                  className="w-5 h-5 text-secondary mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">15+ Years Experience</span>
              </div>
              <div className="flex items-center text-muted">
                <svg
                  className="w-5 h-5 text-secondary mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">25,000+ Patients</span>
              </div>
              <div className="flex items-center text-muted">
                <svg
                  className="w-5 h-5 text-secondary mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">24/7 Emergency Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
