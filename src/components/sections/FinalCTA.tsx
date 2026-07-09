import { Phone } from 'lucide-react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useAnimation';

export function FinalCTA() {
  const { ref, isInView } = useInView(0.1);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <Section background="gray" className="relative overflow-hidden" id="cta">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-700 ${
          isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-6">
          Ready to Schedule Your Visit?
        </h2>
        <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto">
          Take the first step towards better health. Our team is ready to provide you with exceptional care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<Phone className="w-5 h-5" />}
            onClick={() => scrollToSection('#callback')}
          >
            Request Callback
          </Button>
        </div>
      </div>
    </Section>
  );
}
