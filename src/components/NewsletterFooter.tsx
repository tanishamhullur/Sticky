import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Instagram, Twitter, Mail, ShieldCheck, X } from 'lucide-react';

export const NewsletterFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-[#1C1B19] text-[#EDE8DE] pt-16 sm:pt-20 pb-12 border-t border-[#33312C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#C2A676] font-medium mb-3">
            <span>STICKS Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Mindful Living</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FBF9F5] mb-3">
            A Little More Conscious, <br />
            <span className="font-serif italic font-normal text-[#E2DAC8]">
              In Your Inbox.
            </span>
          </h2>

          <p className="text-sm text-[#A8A49A] max-w-lg mx-auto mb-8 leading-relaxed">
            Get first access to new drops, thoughtful living ideas, and updates from STICKS.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="p-4 bg-[#2A3528] rounded-xl border border-[#3D523C] text-xs text-[#C5DEC3] flex items-center justify-center gap-2 max-w-md mx-auto">
              <Check className="w-4 h-4 text-[#8FA587]" />
              <span>
                <strong>Simulated Subscription Complete!</strong> Welcome to the STICKS community dispatch (Demo).
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 bg-[#2A2926] rounded-md text-xs text-[#FBF9F5] placeholder-[#8C887E] border border-[#3E3C37] focus:outline-none focus:border-[#C2A676]"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-6 py-3 bg-[#EAE5D9] text-[#242320] text-xs font-semibold rounded-md hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  {status === 'submitting' ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-[11px] text-[#E57373] text-left">{errorMessage}</p>
              )}

              <p className="text-[11px] text-[#737068] text-center pt-2">
                By subscribing, you agree to receive prototype updates. No spam, ever.
              </p>
            </form>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#2E2D29] mb-12" />

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14 text-xs text-[#A8A49A]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-5 h-5 flex items-center justify-center text-[#C2A676]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="5" y1="8" x2="9" y2="8" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-[0.2em] uppercase text-white font-sans">
                STICKS
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8C887E]">
              Sustainable essentials. Thoughtfully made. Designed for everyday living from rapid-renewable bamboo.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#C2A676]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@sticks-bamboo.com"
                aria-label="Email STICKS"
                className="hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collection Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Launch Collection
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Reusable Bamboo Straws
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kitchen Utensil Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bamboo-Fiber Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  On-the-Go Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Brand Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Our Craft
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('story')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Sustainability Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('story')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Material Transparency
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Packaging Lifecycle
                </button>
              </li>
              <li>
                <span className="text-[#66635C]">ISO FSC Sourced (Audit Stage)</span>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Care & Help
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy & Data
                </button>
              </li>
              <li>
                <span className="text-[#8C887E]">Shipping: Pan-India (Delhivery/BlueDart)</span>
              </li>
              <li>
                <span className="text-[#8C887E]">Returns: 14 Days Mindful Return</span>
              </li>
              <li>
                <span className="text-[#8C887E]">Inquiries: care@sticks-bamboo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#262522] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737068] gap-4">
          <p>© {new Date().getFullYear()} STICKS Living Essentials. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>India (INR ₹)</span>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FBF9F5] text-[#242320] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-[#EAE6DD]">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#73716A] hover:text-[#242320] rounded-full hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-3">STICKS Privacy & Packaging Commitment</h3>
            <div className="text-xs text-[#52504A] space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
              <p>
                <strong>Zero Tracking Clutter:</strong> We respect your digital privacy just like your home. We do not sell your personal data or store un-tokenized payment information.
              </p>
              <p>
                <strong>Plastic-Free Packaging:</strong> All orders are dispatched in water-activated reinforced paper tape and recycled unbleached corrugated boxes. No bubble wrap or plastic air pillows.
              </p>
              <p>
                <strong>Demo Notice:</strong> In this prototype deployment, newsletter submissions and checkouts simulate successful workflows without triggering actual recurring billing.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#EAE6DD] flex justify-end">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-2 bg-[#242320] text-white text-xs font-semibold rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
