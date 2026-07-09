import { Check } from 'lucide-react';

export const BOOKING_STEPS = [
  'Your Details',
  'Choose Doctor',
  'Date & Time',
  'Visit Details',
  'Confirm',
] as const;

interface BookingStepperProps {
  currentStep: number; // 0-based index, matches BOOKING_STEPS
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {BOOKING_STEPS.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : isActive
                        ? 'border-primary text-primary bg-white'
                        : 'border-border text-muted bg-white'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                    isActive || isCompleted ? 'text-heading' : 'text-muted'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < BOOKING_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
