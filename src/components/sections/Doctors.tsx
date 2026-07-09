import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, Award, Phone, Calendar } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useAnimation';
import { useDoctors } from '../../hooks/useContent';
import { formatAvailability } from '../../data/bookingData';
import type { Doctor } from '../../types';

function DoctorCard({
  doctor,
  onClick,
  index,
}: {
  doctor: Doctor;
  onClick: () => void;
  index: number;
}) {
  const navigate = useNavigate();
  const { ref, isInView } = useInView(0.1);

  const handleCallbackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById('callback');
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    } else {
      navigate('/#callback');
    }
  };

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
      <div
        className="bg-white rounded-xl shadow-sm border border-border overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/20"
        onClick={onClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-heading mb-1">
            {doctor.name}
          </h3>
          <p className="text-primary font-medium mb-3">{doctor.specialty}</p>
          <p className="text-muted text-sm mb-4">{doctor.qualifications}</p>
          <div className="flex items-center text-sm text-muted mb-4">
            <Award className="w-4 h-4 mr-2 text-secondary" />
            {doctor.experience}
          </div>
          <Button
            variant="primary"
            className="w-full"
            icon={<Phone className="w-4 h-4" />}
            onClick={handleCallbackClick}
          >
            Request Callback
          </Button>
        </div>
      </div>
    </div>
  );
}

function DoctorModal({
  doctor,
  isOpen,
  onClose,
}: {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  if (!isOpen || !doctor) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCallbackClick = () => {
    onClose();
    const element = document.getElementById('callback');
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    } else {
      navigate('/#callback');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={doctor.image}
            alt={doctor.name}
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
          <h2 className="text-2xl font-bold text-heading mb-2">
            {doctor.name}
          </h2>
          <p className="text-primary font-medium text-lg mb-4">
            {doctor.specialty}
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <Award className="w-5 h-5 text-secondary mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted">Qualifications</p>
                <p className="text-body font-medium">{doctor.qualifications}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-secondary mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted">Experience</p>
                <p className="text-body font-medium">{doctor.experience}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-secondary mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted">Availability</p>
                <p className="text-body font-medium">{formatAvailability(doctor)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="primary"
              className="flex-1"
              icon={<Phone className="w-4 h-4" />}
              onClick={handleCallbackClick}
            >
              Request Callback
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Doctors() {
  const { data: doctors } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <Section background="white" id="doctors">
      <SectionHeader
        title="Meet Our Doctors"
        subtitle="Our team of experienced specialists is dedicated to providing exceptional healthcare with compassion and expertise."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            index={index}
            onClick={() => setSelectedDoctor(doctor)}
          />
        ))}
      </div>
      <DoctorModal
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />
    </Section>
  );
}
