import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductShowcaseProps {
  onAddToCart: (product: Product, variant?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onAddToCart,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    'bamboo-straw-set': 'standard',
    'straw-kit-travel': 'canvas',
    'kitchen-utensils-set': 'natural',
    'bamboo-serving-boat': 'linear',
    'bamboo-tee-everyday': 'oatmeal',
    'bamboo-lounge-top': 'moss',
  });
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: ProductCategory[] = ['All', 'Kitchen', 'On the Go', 'Clothing'];

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleVariantChange = (productId: string, variantValue: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantValue,
    }));
  };

  const handleQuickAdd = (product: Product) => {
    const activeVariant = selectedVariants[product.id];
    onAddToCart(product, activeVariant);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1600);
  };

  return (
    <section id="shop" className="py-16 sm:py-24 bg-[#F5F2EB] border-y border-[#EAE6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#69665E] font-medium mb-2.5">
              <span>The Launch Collection</span>
              <span aria-hidden="true">·</span>
              <span>6 Thoughtful SKUs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#242320]">
              Everyday, Reimagined.
            </h2>
            <p className="mt-2 text-base text-[#615E56] max-w-xl">
              Six thoughtful essentials. A better way to do the everyday.
            </p>
          </div>

          {/* Interactive Filter Controls: Clean segmented control with functional click handlers */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#EAE5D9] rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#242320] text-[#FBF9F5] shadow-xs'
                      : 'text-[#595752] hover:text-[#242320] hover:bg-[#F2EFE9]'
                  }`}
                >
                  {cat}
                  <span className={`ml-1.5 text-[11px] font-mono ${isActive ? 'text-[#C7C2B6]' : 'text-[#87847B]'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 SKUs Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-10">
          {filteredProducts.map((product) => {
            const isJustAdded = recentlyAddedId === product.id;
            const currentVariant = selectedVariants[product.id];

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-[#FBF9F5] rounded-xl border border-[#E5E0D5] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Product Image Stage (65-70% visual prominence) */}
                <div className="relative aspect-4/3 w-full bg-[#EAE5D9] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges / Metadata */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-medium tracking-wide bg-[#FBF9F5]/90 backdrop-blur-xs text-[#242320] px-2.5 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  {/* Quick View Floating Action */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => onQuickView(product)}
                      aria-label={`Quick view details for ${product.name}`}
                      className="p-2 bg-[#FBF9F5] text-[#242320] rounded-full shadow-md hover:bg-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Material line without pill enclosing */}
                    <div className="text-xs text-[#73716A] mb-1.5 flex items-center gap-1.5">
                      <span>{product.material}</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="text-base font-semibold text-[#242320] hover:text-[#3D4F3E] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-1.5 text-xs text-[#615E56] line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Variants: Swatches or Buttons */}
                    {product.variants && (
                      <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#78756D] font-medium">
                          {product.variants.label}:
                        </span>
                        
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {product.variants.type === 'color' ? (
                            product.variants.options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleVariantChange(product.id, opt.value)}
                                title={opt.name}
                                className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                                  currentVariant === opt.value
                                    ? 'ring-2 ring-offset-1 ring-[#242320] scale-110'
                                    : 'border-black/20 hover:scale-105'
                                }`}
                                style={{ backgroundColor: opt.colorHex || '#ccc' }}
                                aria-label={`Select ${opt.name}`}
                              />
                            ))
                          ) : (
                            product.variants.options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleVariantChange(product.id, opt.value)}
                                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                                  currentVariant === opt.value
                                    ? 'bg-[#242320] text-[#FBF9F5]'
                                    : 'bg-[#EAE5D9] text-[#4A4843] hover:bg-[#DDD8CC]'
                                }`}
                              >
                                {opt.name.split(' ')[0]}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Quick Add Button */}
                  <div className="mt-5 pt-4 border-t border-[#EAE6DD] flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#242320] font-mono tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#8C887E] line-through font-mono tabular-nums">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      disabled={isJustAdded}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#3D523C] text-white'
                          : 'bg-[#242320] hover:bg-[#383733] text-[#FBF9F5] active:scale-95'
                      }`}
                      aria-label={`Add ${product.name} to bag`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro reassurance strip */}
        <div className="mt-12 p-4 bg-[#FBF9F5] rounded-xl border border-[#EAE6DD] flex flex-wrap items-center justify-around gap-4 text-xs text-[#595752] text-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#242320]">100% Food-Grade</span>
            <span>· Zero synthetic lacquers</span>
          </div>
          <div className="hidden sm:block text-[#D1CCC2]">|</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#242320]">Natural Strength</span>
            <span>· Stronger tensile strength than steel</span>
          </div>
          <div className="hidden sm:block text-[#D1CCC2]">|</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#242320]">Hassle-Free Returns</span>
            <span>· 14-day mindful guarantee</span>
          </div>
        </div>

      </div>
    </section>
  );
};
