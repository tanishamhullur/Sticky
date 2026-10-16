import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-[#FBF9F5] rounded-2xl max-w-xl w-full border border-[#EAE6DD] shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6DD] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#73716A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search straws, kitchenware, lounge apparel..."
            className="w-full bg-transparent text-sm text-[#242320] placeholder-[#9C988F] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C887E] hover:text-[#242320] p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-[#73716A] hover:text-[#242320] rounded-full hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          <div className="text-[11px] text-[#73716A] uppercase tracking-wider font-semibold px-2 mb-2">
            {query.trim() ? `Search Results (${results.length})` : 'All 6 Essentials'}
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#73716A]">
              No essentials matching &ldquo;{query}&rdquo;. Try searching for &ldquo;straws&rdquo;, &ldquo;kitchen&rdquo;, or &ldquo;tee&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-[#EAE6DD] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded bg-[#F2EFE9]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#242320] group-hover:text-[#3D4F3E] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#73716A]">{product.category} · {product.material}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#242320] font-mono tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A8A49A] group-hover:text-[#242320] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Suggestions Footer */}
        <div className="px-5 py-3 bg-[#F2EFE9] border-t border-[#EAE6DD] flex items-center justify-between text-[11px] text-[#73716A]">
          <span>Press ESC to exit</span>
          <div className="flex gap-2">
            <button
              onClick={() => setQuery('straw')}
              className="hover:underline hover:text-[#242320] cursor-pointer"
            >
              Straws
            </button>
            <span>·</span>
            <button
              onClick={() => setQuery('kitchen')}
              className="hover:underline hover:text-[#242320] cursor-pointer"
            >
              Kitchen
            </button>
            <span>·</span>
            <button
              onClick={() => setQuery('clothing')}
              className="hover:underline hover:text-[#242320] cursor-pointer"
            >
              Apparel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
