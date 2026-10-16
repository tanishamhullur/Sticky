import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Slim Top Announcement Banner */}
      {bannerVisible && (
        <div className="relative bg-[#242320] text-[#EFECE6] px-4 py-2 text-xs font-normal tracking-wide text-center flex items-center justify-center gap-2">
          <span>Thoughtfully made from 100% fast-growth bamboo · Free shipping on orders over ₹999</span>
          <button
            onClick={() => setBannerVisible(false)}
            aria-label="Dismiss banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A49A] hover:text-white p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Top Bar: Strictly 3 zones adhering to the Top Bar Contract */}
      <div
        className={`w-full transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#EAE6DD]'
            : 'bg-[#FBF9F5] border-b border-[#EAE6DD]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* ZONE 1: Brand Wordmark with signature sparkling light sweep */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#"
              className="group relative inline-flex items-center gap-2.5 text-[#242320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B3A2C]"
            >
              {/* Minimal Bamboo Icon */}
              <div className="w-6 h-6 flex items-center justify-center text-[#3D4F3E] transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {/* Bamboo stalks mark */}
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="5" y1="8" x2="9" y2="8" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                  <line x1="15" y1="9" x2="19" y2="9" />
                </svg>
              </div>

              {/* STICKS Wordmark with ambient sweep and delicate sparkles */}
              <div className="relative flex items-center select-none">
                <span className="text-xl sm:text-2xl font-bold tracking-[0.22em] uppercase text-sweep font-sans">
                  STICKS
                </span>

                {/* Sparkling particles */}
                <span
                  className="animate-sparkle-1 absolute -top-1 right-1 text-[#C2A676] pointer-events-none"
                  aria-hidden="true"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
                <span
                  className="animate-sparkle-2 absolute -bottom-1 -left-2 text-[#8FA587] pointer-events-none"
                  aria-hidden="true"
                >
                  <Sparkles className="w-2 h-2" />
                </span>
                <span
                  className="animate-sparkle-3 absolute -top-1.5 left-7 text-[#C2A676] pointer-events-none"
                  aria-hidden="true"
                >
                  <Sparkles className="w-2 h-2" />
                </span>
              </div>
            </a>
          </div>

          {/* ZONE 2: Clean 4–5 single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#595752]"
          >
            <button
              onClick={() => scrollToSection('shop')}
              className="hover:text-[#242320] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#242320] hover:after:w-full after:transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="hover:text-[#242320] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#242320] hover:after:w-full after:transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection('sustainability')}
              className="hover:text-[#242320] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#242320] hover:after:w-full after:transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sustainability
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#242320] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#242320] hover:after:w-full after:transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* ZONE 3: 1 Primary Action Area (Search + Shopping Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search collection"
              className="p-2 text-[#4A4843] hover:text-[#242320] hover:bg-[#F2EFE9] rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Shopping Bag Button with Live Cart Counter */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="group relative flex items-center gap-2 py-2 px-3.5 bg-[#242320] text-[#FBF9F5] rounded-full hover:bg-[#34332F] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#242320]"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span className="text-xs font-semibold tracking-wider font-mono tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-[#4A4843] hover:text-[#242320] rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F5] border-b border-[#EAE6DD] px-6 py-6 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#242320]">
            <button
              onClick={() => scrollToSection('shop')}
              className="text-left py-2 border-b border-[#F2EFE9] hover:text-[#3D4F3E] transition-colors"
            >
              Shop Collection
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="text-left py-2 border-b border-[#F2EFE9] hover:text-[#3D4F3E] transition-colors"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection('sustainability')}
              className="text-left py-2 border-b border-[#F2EFE9] hover:text-[#3D4F3E] transition-colors"
            >
              Sustainability Mission
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left py-2 border-b border-[#F2EFE9] hover:text-[#3D4F3E] transition-colors"
            >
              Contact & Support
            </button>
            
            <div className="pt-2 flex items-center justify-between text-xs text-[#73716A]">
              <span>Free delivery across India &gt; ₹999</span>
              <span className="font-mono tabular-nums">INR (₹)</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
