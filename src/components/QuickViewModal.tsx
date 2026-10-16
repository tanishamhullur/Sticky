import React, { useState } from 'react';
import { X, ShoppingBag, Check, Shield, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: string, quantity?: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.options[0]?.value || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F5] rounded-2xl max-w-3xl w-full border border-[#EAE6DD] shadow-2xl overflow-hidden relative my-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-10 p-2 text-[#73716A] hover:text-[#242320] rounded-full bg-[#FBF9F5]/80 hover:bg-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Stage */}
          <div className="bg-[#EAE5D9] aspect-4/3 md:aspect-auto h-full relative overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#73716A] font-medium mb-1.5">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.material}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#242320] leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#242320] font-mono tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8C887E] line-through font-mono tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#3D523C] bg-[#E8EFE8] px-2 py-0.5 rounded font-medium">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="mt-4 text-xs text-[#52504A] leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Key Features List */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#242320]">
                  Craft Details:
                </span>
                <ul className="text-xs space-y-1.5 text-[#595752]">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#3D4F3E] shrink-0 font-bold">·</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Variant Selector */}
              {product.variants && (
                <div className="mt-6 pt-4 border-t border-[#EAE6DD]">
                  <label className="text-xs font-semibold text-[#242320] block mb-2">
                    {product.variants.label}:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedVariant(opt.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                          selectedVariant === opt.value
                            ? 'bg-[#242320] text-[#FBF9F5] border-[#242320]'
                            : 'bg-white text-[#4A4843] border-[#DDD8CC] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Tips */}
              <div className="mt-4 p-3 bg-[#F2EFE9] rounded-lg text-[11px] text-[#615E56] border border-[#E5DFD3]">
                <strong>Care Note:</strong> {product.care}
              </div>
            </div>

            {/* Actions: Quantity + Add */}
            <div className="mt-8 pt-4 border-t border-[#EAE6DD] flex items-center gap-3">
              <div className="flex items-center border border-[#DDD8CC] rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="px-2.5 py-2 text-xs font-semibold text-[#595752] hover:text-[#242320] cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 text-xs font-mono font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="px-2.5 py-2 text-xs font-semibold text-[#595752] hover:text-[#242320] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-[#3D523C] text-white'
                    : 'bg-[#242320] text-[#FBF9F5] hover:bg-[#383733] shadow-xs active:scale-[0.99]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
