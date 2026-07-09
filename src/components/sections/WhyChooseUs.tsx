import { whyChooseUs } from '../../data/hospitalData';
import { Section, SectionHeader } from '../ui/Section';
import { Card } from '../ui/Card';
import { useInView } from '../../hooks/useAnimation';

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card hover className="h-full text-center p-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-heading mb-3">{title}</h3>
        <p className="text-muted leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <Section background="white" id="why-us">
      <SectionHeader
        title="Why Choose Us"
        subtitle="Experience healthcare that puts you first with our commitment to excellence, modern facilities, and patient-centered approach."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {whyChooseUs.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
