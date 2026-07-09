import { Star, Quote } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { useInView } from '../../hooks/useAnimation';
import { useTable } from '../../hooks/useContent';
import { FALLBACK_TESTIMONIALS } from '../../data/fallbackContent';

function TestimonialCard({
  name,
  location,
  rating,
  text,
  avatar,
  index,
}: {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
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
      <div className="bg-white rounded-xl shadow-sm border border-border p-8 h-full flex flex-col">
        <Quote className="w-8 h-8 text-primary/20 mb-4" />
        <p className="text-body leading-relaxed mb-6 flex-grow">{text}</p>
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-heading">{name}</h4>
            <p className="text-sm text-muted">{location}</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { data: testimonials } = useTable('testimonials', FALLBACK_TESTIMONIALS);

  return (
    <Section id="testimonials">
      <SectionHeader
        title="What Our Patients Say"
        subtitle="Real experiences from real patients who trusted us with their healthcare needs."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            name={testimonial.name}
            location={testimonial.location}
            rating={testimonial.rating}
            text={testimonial.text}
            avatar={testimonial.avatar}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
}
