import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS, PARTNER_LOGOS } from '../data/products';

export const TestimonialsAndMarquee: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F2EFE9] border-t border-[#EAE6DD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#69665E] font-medium mb-2.5">
            <span>Community Impressions</span>
            <span aria-hidden="true">·</span>
            <span>Early Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#242320]">
            Good Things Get Shared.
          </h2>
          <p className="mt-2 text-sm text-[#66635C]">
            Early impressions from everyday people switching to natural bamboo essentials.
          </p>
          <span className="mt-1 block text-[11px] text-[#8C887E] italic">
            (Curated feedback from pre-launch sample testers)
          </span>
        </div>

        {/* 3 Polished Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#FBF9F5] p-6 sm:p-7 rounded-xl border border-[#E5DFD3] shadow-xs flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-[#C2A676] mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[#42403B] leading-relaxed italic mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-4 border-t border-[#EFEBE1] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#242320]">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-[#78756E]">{testimonial.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#595752] font-medium block">
                    {testimonial.product}
                  </span>
                  <span className="text-[10px] text-[#8C887E]">
                    Verified Sample
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Logo Marquee Section */}
        <div className="pt-8 border-t border-[#E2DDD2]">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.22em] text-[#78756E] font-medium">
              Featured Concepts & Curated Stockists
            </span>
            <p className="text-[11px] text-[#8C887E] mt-1">
              Sample partner marks for initial showcase rollout
            </p>
          </div>

          {/* Marquee Track with pause on hover & reduced motion */}
          <div className="relative w-full overflow-hidden marquee-container py-4">
            {/* Edge fades for seamless presentation */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F2EFE9] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F2EFE9] to-transparent z-10" />

            <div className="marquee-track flex items-center gap-12 sm:gap-16">
              {/* Duplicate array once to produce seamless infinite loop */}
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity px-4 select-none shrink-0"
                >
                  <span className="text-base sm:text-lg font-bold tracking-[0.25em] text-[#33312C] uppercase font-sans">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-[#737068] tracking-widest uppercase mt-0.5">
                    {partner.tagline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
