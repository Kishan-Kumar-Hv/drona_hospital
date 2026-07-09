import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface BookingData {
  department: string;
  preferredTime: string;
}

interface BookingContextType {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingData, setBookingDataState] = useState<BookingData>(() => {
    // Initialize from session storage if available
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('bookingData');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return { department: '', preferredTime: '' };
        }
      }
    }
    return { department: '', preferredTime: '' };
  });

  const setBookingData = useCallback((data: BookingData) => {
    setBookingDataState(data);
    sessionStorage.setItem('bookingData', JSON.stringify(data));
  }, []);

  const clearBookingData = useCallback(() => {
    setBookingDataState({ department: '', preferredTime: '' });
    sessionStorage.removeItem('bookingData');
  }, []);

  // Listen for custom event from other components
  useEffect(() => {
    const handleBookingRequest = ((e: CustomEvent<BookingData>) => {
      setBookingData(e.detail);
    }) as EventListener;

    window.addEventListener('bookingRequest', handleBookingRequest);
    return () => window.removeEventListener('bookingRequest', handleBookingRequest);
  }, [setBookingData]);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

// Helper function to dispatch booking request from outside context
export function dispatchBookingRequest(data: BookingData) {
  const event = new CustomEvent('bookingRequest', { detail: data });
  window.dispatchEvent(event);
}
