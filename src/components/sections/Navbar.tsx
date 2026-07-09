import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { navLinks } from '../../data/hospitalData';
import { useScrollSpy } from '../../hooks/useAnimation';
import { useHospitalSettings } from '../../hooks/useContent';

export function Navbar() {
  const { settings } = useHospitalSettings();
  const [isOpen, setIsOpen] = useState(false);

  const sectionIds = navLinks
    .filter((link) => !link.href.startsWith('/'))
    .map((link) => link.href.replace('#', ''));
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) return;
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-sm leading-none transition-transform duration-300 group-hover:scale-105">
              +
            </div>
            <div>
              <h1 className="text-xl font-bold text-heading leading-tight group-hover:text-primary transition-colors">
                {settings.name}
              </h1>
              <p className="text-xs text-muted hidden sm:block leading-none mt-0.5">
                {settings.local_name}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isPage = link.href.startsWith('/');
              if (isPage) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-base font-medium text-body hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-base font-medium transition-colors duration-200 ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-primary'
                      : 'text-body hover:text-primary'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center text-primary hover:text-primary-hover transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">{settings.phone}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-body hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-[500px] opacity-100 visible'
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="container-custom pt-4 pb-4">
          <div className="bg-white rounded-xl border border-border p-4 shadow-lg space-y-2">
            {navLinks.map((link) => {
              const isPage = link.href.startsWith('/');
              if (isPage) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg font-medium text-body hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === link.href.replace('#', '')
                      ? 'bg-primary/10 text-primary'
                      : 'text-body hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 border-t border-border space-y-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center px-4 py-3 text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-4 h-4 mr-3" />
                {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
