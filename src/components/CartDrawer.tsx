import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, variant?: string) => void;
  onRemoveItem: (productId: string, variant?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col border-l border-[#EAE6DD]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EAE6DD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#242320]" />
              <h2 className="text-lg font-bold text-[#242320]">Your Bag</h2>
              <span className="text-xs text-[#73716A] font-mono tabular-nums">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 text-[#73716A] hover:text-[#242320] rounded-full hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-[#F2EFE9] border-b border-[#E8E3D8]">
            <div className="flex items-center justify-between text-xs text-[#4A4843] mb-1.5">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="font-mono tabular-nums font-semibold text-[#242320]">₹{amountNeeded}</strong> more for free carbon-neutral shipping
                </span>
              ) : (
                <span className="font-semibold text-[#2E472F] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  You&apos;ve unlocked Free Carbon-Neutral Shipping!
                </span>
              )}
              <span className="font-mono text-[11px]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#DDD7C9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3D523C] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F2EFE9] flex items-center justify-center text-[#8C887E] mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-[#242320] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#73716A] max-w-xs mb-6">
                  Explore our launch collection of bamboo straws, kitchenware, and breathable apparel.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-[#EAE6DD] shadow-2xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md bg-[#F2EFE9] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#242320] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.selectedVariant)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#9C988F] hover:text-[#B33924] p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#73716A] capitalize mt-0.5">
                          Variant: {item.selectedVariant}
                        </p>
                      )}

                      <span className="text-xs font-semibold text-[#242320] font-mono tabular-nums block mt-1">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#DDD8CC] rounded-md bg-[#FBF9F5]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedVariant)}
                          aria-label="Decrease quantity"
                          className="p-1 text-[#595752] hover:text-[#242320] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums font-medium text-[#242320]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedVariant)}
                          aria-label="Increase quantity"
                          className="p-1 text-[#595752] hover:text-[#242320] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EAE6DD] bg-[#FBF9F5] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#73716A]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#242320]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#73716A]">
                  <span>Estimated Delivery</span>
                  <span className="text-[#242320]">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE6DD] flex justify-between text-sm font-bold text-[#242320]">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums">
                    ₹{(subtotal >= freeShippingThreshold ? subtotal : subtotal + 99).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#242320] text-[#FBF9F5] text-sm font-semibold rounded-md hover:bg-[#383733] transition-all cursor-pointer shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-[#8C887E]">
                <span>Zero-plastic unbleached recycled packaging</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
