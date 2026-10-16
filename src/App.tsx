import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { BrandStory } from './components/BrandStory';
import { TestimonialsAndMarquee } from './components/TestimonialsAndMarquee';
import { NewsletterFooter } from './components/NewsletterFooter';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { StickyChatbot } from './components/StickyChatbot';
import { CartItem, Product } from './types';
import { PRODUCTS } from './data/products';
import { ShoppingBag, Check } from 'lucide-react';

export default function App() {
  // Initialize cart with 1 sample item so user can immediately experience the cart drawer
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sticks_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    // Default starter item for instant interactivity
    return [
      {
        product: PRODUCTS[0],
        quantity: 1,
        selectedVariant: 'standard',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sticks_cart', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (product: Product, variant?: string, quantity: number = 1) => {
    const activeVariant = variant || (product.variants?.options[0]?.value ?? undefined);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === activeVariant
      );

      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedVariant: activeVariant,
          },
        ];
      }
    });

    showToast(`Added ${quantity} × ${product.name} to your bag`);
  };

  const handleUpdateQuantity = (productId: string, delta: number, variant?: string) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedVariant === variant) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, variant?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === variant)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('story');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#242320]">
      {/* Sticky Navigation with Sparkling STICKS Wordmark */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onShopClick={scrollToShop} onStoryClick={scrollToStory} />

        {/* Product Showcase: The First 6 SKUs with Functional Filter */}
        <ProductShowcase
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Brand Story & Sustainability Mission */}
        <BrandStory />

        {/* Customer Testimonials & Animated Partner Logo Marquee */}
        <TestimonialsAndMarquee />
      </main>

      {/* Newsletter Footer */}
      <NewsletterFooter />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onClearCart={handleClearCart}
      />

      {/* Quick View Product Details Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Sticky AI Chatbot Mascot with Live Face and Nudges */}
      <StickyChatbot
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#242320] text-[#FBF9F5] px-4 py-3 rounded-lg shadow-xl border border-[#3E3C37] text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#3D523C] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-[#C2A676] hover:underline font-semibold cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
