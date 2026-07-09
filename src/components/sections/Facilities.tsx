import { useState } from 'react';
import { X } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { useInView } from '../../hooks/useAnimation';
import { useTable } from '../../hooks/useContent';
import { FALLBACK_FACILITIES } from '../../data/fallbackContent';

function FacilityCard({
  title,
  image,
  index,
  onClick,
}: {
  title: string;
  image: string;
  index: number;
  onClick: () => void;
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
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div
        className="group cursor-pointer overflow-hidden rounded-xl shadow-sm border border-border bg-white"
        onClick={onClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacilityModal({
  title,
  description,
  image,
  isOpen,
  onClose,
}: {
  title: string;
  description: string;
  image: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-72 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-heading mb-4">{title}</h2>
          <p className="text-body leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function Facilities() {
  const { data: facilities } = useTable('facilities', FALLBACK_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  return (
    <Section id="facilities">
      <SectionHeader
        title="Our Facilities"
        subtitle="Modern, well-equipped facilities designed for patient comfort and quality healthcare delivery."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {facilities.map((facility, index) => (
          <FacilityCard
            key={facility.id}
            title={facility.title}
            image={facility.image}
            index={index}
            onClick={() => setSelectedFacility(facility)}
          />
        ))}
      </div>
      <FacilityModal
        title={selectedFacility?.title || ''}
        description={selectedFacility?.description || ''}
        image={selectedFacility?.image || ''}
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </Section>
  );
}
