import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useHospitalSettings } from '../../hooks/useContent';

interface MinimalHeaderProps {
  rightSlot?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function MinimalHeader({
  rightSlot,
  backTo = '/',
  backLabel = 'Back to Website',
}: MinimalHeaderProps) {
  const { settings } = useHospitalSettings();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-heading leading-tight">
                {settings.name}
              </h1>
              <p className="text-xs text-muted hidden sm:block leading-tight">
                {settings.local_name}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {rightSlot}
            <Link
              to={backTo}
              className="hidden sm:inline-flex items-center text-sm font-medium text-body hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
