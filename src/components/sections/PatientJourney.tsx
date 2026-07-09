import { patientJourney } from '../../data/hospitalData';
import { Section, SectionHeader } from '../ui/Section';
import { useInView } from '../../hooks/useAnimation';

function JourneyStep({
  step,
  title,
  description,
  icon: Icon,
  index,
  isLast,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  isLast: boolean;
}) {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-center transition-all duration-500 ${
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step Number and Icon */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="mt-4 px-4 py-1 bg-primary/10 rounded-full">
          <span className="text-primary font-semibold">Step {step}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
        <h3 className="text-xl font-semibold text-heading mb-2">{title}</h3>
        <p className="text-muted max-w-xs">{description}</p>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div className="hidden md:block absolute left-8 top-20 w-full h-0.5 bg-border" />
      )}
    </div>
  );
}

export function PatientJourney() {
  return (
    <Section background="white">
      <SectionHeader
        title="Your Patient Journey"
        subtitle="A simple, streamlined process designed for your convenience and peace of mind."
      />
      <div className="grid md:grid-cols-4 gap-8 md:gap-4">
        {patientJourney.map((step, index) => (
          <JourneyStep
            key={step.step}
            step={step.step}
            title={step.title}
            description={step.description}
            icon={step.icon}
            index={index}
            isLast={index === patientJourney.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}
