import React, { useState } from 'react';
import { ArrowRight, Leaf, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onShopClick: () => void;
  onStoryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onStoryClick }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] pt-6 sm:pt-10 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column: Headline, subhead, and CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* Quiet 1-line text kicker without pill encapsulation */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#69665E] font-medium mb-4">
              <span>Thoughtfully Made</span>
              <span aria-hidden="true">·</span>
              <span>Everyday Essentials</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-bold tracking-tight text-[#242320] text-balance mb-6">
              Less Plastic. <br />
              <span className="font-serif italic font-normal text-[#384A39]">More Purpose.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#5E5B53] leading-relaxed max-w-xl mb-8">
              Thoughtfully designed bamboo essentials for a lighter, more conscious everyday. From morning sips to mindful cooking, crafted to fit seamlessly into modern life.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                type="button"
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#242320] text-[#FBF9F5] text-sm font-semibold tracking-wide rounded-md hover:bg-[#383733] active:scale-[0.99] transition-all cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#242320]"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={onStoryClick}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent hover:bg-[#F2EFE9] text-[#242320] text-sm font-medium tracking-wide rounded-md border border-[#D5D0C5] transition-all cursor-pointer"
              >
                Our Sustainability Story
              </button>
            </div>

            {/* Micro Credibility Notes */}
            <div className="pt-6 border-t border-[#EAE6DD] flex items-center gap-6 text-xs text-[#73716A]">
              <div>
                <span className="font-semibold text-[#242320]">6 Launch SKUs</span>
                <p className="text-[11px] text-[#8C887E]">Straws · Kitchen · Fiber</p>
              </div>
              <div className="w-[1px] h-7 bg-[#EAE6DD]" />
              <div>
                <span className="font-semibold text-[#242320]">100% Moso Bamboo</span>
                <p className="text-[11px] text-[#8C887E]">Pesticide-free growth</p>
              </div>
              <div className="w-[1px] h-7 bg-[#EAE6DD]" />
              <div>
                <span className="font-semibold text-[#242320]">Plastic-Free Post</span>
                <p className="text-[11px] text-[#8C887E]">Recycled kraft packaging</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xl overflow-hidden bg-[#EAE5D9] shadow-sm aspect-4/3 sm:aspect-16/10 lg:aspect-16/10">
              {/* Fallback container with domain graphic */}
              <div
                className={`absolute inset-0 bg-[#E8E2D5] flex items-center justify-center transition-opacity duration-500 ${
                  imgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="text-center p-6 text-[#73716A]">
                  <Leaf className="w-8 h-8 mx-auto mb-2 text-[#687B65] animate-pulse" />
                  <p className="text-xs uppercase tracking-widest font-mono">STICKS Studio Campaign</p>
                </div>
              </div>

              {/* High-fidelity Generated Lifestyle Image */}
              <img
                src={HERO_IMAGE}
                alt="STICKS natural bamboo drinking straws and kitchen essentials in a sunlit architectural setting"
                referrerPolicy="no-referrer"
                loading="eager"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02] ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Subtle organic caption pill in corner */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#FBF9F5]/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-[#EAE6DD] text-xs text-[#242320] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#526B54]" />
                <span className="font-medium">Organic Moso Bamboo Essentials</span>
                <span className="text-[#73716A] hidden sm:inline">· Studio Collection 01</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
