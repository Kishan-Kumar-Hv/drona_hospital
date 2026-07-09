import { MapPin, Phone, Mail, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { Section, SectionHeader } from '../ui/Section';
import { useInView } from '../../hooks/useAnimation';
import { useHospitalSettings } from '../../hooks/useContent';

export function Contact() {
  const { ref, isInView } = useInView(0.1);
  const { settings } = useHospitalSettings();
  const addressFull = `${settings.address_street}, ${settings.address_city}, ${settings.address_state} ${settings.address_pincode}`;

  return (
    <Section id="contact" background="white">
      <SectionHeader
        title="Contact Us"
        subtitle="We're here to help. Reach out to us for appointments, inquiries, or emergency care."
      />

      <div
        ref={ref}
        className={`grid lg:grid-cols-2 gap-8 lg:gap-12 transition-all duration-700 ${
          isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Contact Information */}
        <div className="space-y-8">
          {/* Hospital Name */}
          <div>
            <h3 className="text-2xl font-bold text-heading mb-2">
              {settings.name}
            </h3>
            <p className="text-lg text-muted">{settings.local_name}</p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-heading mb-1">Address</h4>
              <p className="text-muted">{addressFull}</p>
              <a
                href={settings.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-hover mt-2 transition-colors"
              >
                View on Google Maps
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-heading mb-1">Phone</h4>
              <a
                href={`tel:${settings.phone}`}
                className="text-primary hover:text-primary-hover transition-colors block"
              >
                {settings.phone}
              </a>
              <p className="text-muted text-sm mt-1">
                Call for appointments and general inquiries
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-heading mb-1">
                Emergency Contact
              </h4>
              <a
                href={`tel:${settings.emergency_phone}`}
                className="text-red-600 hover:text-red-700 transition-colors block font-medium"
              >
                {settings.emergency_phone}
              </a>
              <p className="text-muted text-sm mt-1">24/7 Emergency Services</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-heading mb-1">Email</h4>
              <a
                href={`mailto:${settings.email}`}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                {settings.email}
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-heading mb-1">Working Hours</h4>
              <p className="text-muted">
                <span className="text-secondary font-medium">
                  {settings.working_hours}
                </span>
              </p>
              <p className="text-muted text-sm">
                We're open round the clock for your healthcare needs
              </p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-lg border border-border h-full min-h-[400px]">
            <iframe
              src={settings.map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${settings.name} Location`}
            />
          </div>
          <a
            href={settings.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 text-sm font-medium text-heading"
          >
            <MapPin className="w-4 h-4 text-primary" />
            Get Directions
          </a>
        </div>
      </div>
    </Section>
  );
}
