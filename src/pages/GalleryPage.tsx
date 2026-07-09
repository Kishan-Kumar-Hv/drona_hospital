import { useState } from 'react';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Footer } from '../components/sections/Footer';
import { useTable } from '../hooks/useContent';
import { FALLBACK_FACILITIES } from '../data/fallbackContent';
import { X, ZoomIn } from 'lucide-react';

interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
}

export function GalleryPage() {
  const { data: facilities } = useTable<Facility>('facilities', FALLBACK_FACILITIES);
  const [activeImage, setActiveImage] = useState<Facility | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <MinimalHeader backLabel="Back to Homepage" />

      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading mb-4">Clinic Gallery & Facilities</h1>
            <p className="text-muted leading-relaxed">
              Take a virtual tour of Drona Healthcare Services. Discover our modern clinical setups, advanced medical equipment, and patient care suites.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setActiveImage(fac)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-heading mb-1">{fac.title}</h3>
                  <p className="text-muted text-xs leading-relaxed line-clamp-2">{fac.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col justify-center items-center bg-white/5 rounded-3xl p-2 border border-white/10 shadow-2xl">
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <div className="text-center text-white mt-4 p-3 max-w-xl">
              <h2 className="text-xl font-bold mb-1">{activeImage.title}</h2>
              <p className="text-white/70 text-sm">{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
