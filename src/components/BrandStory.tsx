import React, { useState } from 'react';
import { ArrowRight, Compass, Feather, Recycle, X } from 'lucide-react';
import { STORY_IMAGE } from '../data/products';

export const BrandStory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="story" className="py-16 sm:py-24 bg-[#FBF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              {/* Main Editorial Image */}
              <div className="relative rounded-2xl overflow-hidden bg-[#EAE5D9] shadow-sm aspect-4/3 sm:aspect-1/1">
                <img
                  src={STORY_IMAGE}
                  alt="Raw harvested natural bamboo stalks and organic spun fibers"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Editorial Material Note Card */}
              <div className="mt-4 sm:absolute sm:-bottom-6 sm:-right-6 bg-[#242320] text-[#FBF9F5] p-5 sm:p-6 rounded-xl sm:max-w-xs shadow-lg">
                <span className="text-[11px] font-mono tracking-widest text-[#C2A676] uppercase block mb-1">
                  Material Truth
                </span>
                <p className="text-xs leading-relaxed text-[#D5D0C5]">
                  Bamboo is technically a giant grass, capable of regenerating from its own roots without replanting or toxic chemical pesticides.
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#69665E] font-medium mb-3">
              <span>Our Philosophy</span>
              <span aria-hidden="true">·</span>
              <span>Mindful Materiality</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#242320] leading-tight mb-6">
              A Small Switch. <br />
              <span className="font-serif italic font-normal text-[#384A39]">
                A Better Everyday.
              </span>
            </h2>

            <p className="text-base text-[#52504A] leading-relaxed mb-4">
              We believe better everyday choices should feel effortless. STICKS brings together thoughtfully designed essentials that encourage a more conscious approach to daily living — from your morning coffee and kitchen rituals to the clothes you wear.
            </p>

            <p className="text-base text-[#52504A] leading-relaxed mb-8">
              We focus on useful design, considered materials, and products made to fit naturally into your life. Because sustainability isn't just a big idea. It's built through the little things we choose, every day.
            </p>

            {/* Three Brand Principles */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#F2EFE9] text-[#3D4F3E] rounded-md shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#242320]">
                    Designed for Everyday
                  </h4>
                  <p className="text-xs text-[#66635C] mt-0.5">
                    Practical products made to fit naturally into daily routines without feeling fragile or precious.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#F2EFE9] text-[#3D4F3E] rounded-md shrink-0 mt-0.5">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#242320]">
                    Thoughtful Materials
                  </h4>
                  <p className="text-xs text-[#66635C] mt-0.5">
                    Exploring bamboo-based alternatives with care, structural honesty, and complete material transparency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#F2EFE9] text-[#3D4F3E] rounded-md shrink-0 mt-0.5">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#242320]">
                    Less Waste, More Intention
                  </h4>
                  <p className="text-xs text-[#66635C] mt-0.5">
                    Encouraging mindful choices through durable, reusable essentials delivered in plastic-free packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#242320] hover:text-[#384A39] transition-colors py-2 border-b-2 border-[#242320] hover:border-[#384A39] cursor-pointer"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Brand Story Detailed Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FBF9F5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#EAE6DD]">
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 text-[#73716A] hover:text-[#242320] rounded-full hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-widest text-[#73716A] font-medium block mb-2">
              Our Journey & Material Truth
            </span>
            <h3 className="text-2xl font-bold text-[#242320] mb-4">
              Why Bamboo? The Honest Perspective
            </h3>

            <div className="space-y-4 text-sm text-[#52504A] leading-relaxed">
              <p>
                At STICKS, we didn't start with slogans — we started with the sheer absurdity of single-use petroleum plastics in modern life: straws used for 10 minutes that linger in landfills for 500 years.
              </p>
              <p>
                We turned to <strong>Moso Bamboo (Phyllostachys edulis)</strong> because it is one of the planet&apos;s fastest-renewing woody plants. It requires zero synthetic fertilizers, absorbs significant atmospheric CO₂, and re-sprouts vigorously after harvesting without uprooting soil mycorrhizal networks.
              </p>
              
              <div className="p-4 bg-[#F2EFE9] rounded-xl border border-[#E5DFD3] space-y-2">
                <h4 className="font-semibold text-xs text-[#242320] uppercase tracking-wider">
                  Our Transparency Promise:
                </h4>
                <ul className="text-xs space-y-1.5 text-[#595752] list-disc list-inside">
                  <li>Zero microplastic additives or synthetic coating resins in our straws.</li>
                  <li>Our kitchen utensils are hand-carved and seasoned solely with food-grade plant oils.</li>
                  <li>Our apparel uses closed-loop spinning with 100% recycled processing water.</li>
                  <li>Shipped in 100% unbleached recycled post-consumer kraft mailers.</li>
                </ul>
              </div>

              <p>
                We do not claim our products will save the planet alone. But we know that every bamboo straw packed in your bag, every wooden spatula on your stove, and every breathable shirt you reach for is a conscious step toward a cleaner home.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAE6DD] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-colors cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
