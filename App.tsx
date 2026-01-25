import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import MobileBottomNav from './components/MobileBottomNav';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: 'M' }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation onCartOpen={() => setIsCartOpen(true)} cartCount={totalItems} />
      
      {/* Main Content */}
      <main>
        <Hero />

        {/* Categories Section */}
        <section className="py-12 lg:py-24 container mx-auto px-4 max-w-[1400px]">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-8 lg:mb-12 text-center uppercase tracking-tighter">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all"></div>
                <div className="absolute bottom-6 left-0 right-0 text-center p-4">
                  <h3 className="text-white text-xl lg:text-2xl font-bold font-display uppercase tracking-wider drop-shadow-md">
                    {cat.name}
                  </h3>
                  <span className="inline-block mt-3 bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Explore
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="py-16 bg-gray-50 rounded-t-[3rem]">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="flex justify-between items-end mb-10 lg:mb-14">
              <div>
                <span className="text-gray-500 font-bold tracking-widest text-xs uppercase mb-3 block">Don't Miss Out</span>
                <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter">
                  Trending Now
                </h2>
              </div>
              <a href="#" className="hidden lg:block text-black font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                View All Products
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
              {PRODUCTS.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>

            <div className="mt-16 text-center lg:hidden">
              <button className="bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-bold rounded-full w-full shadow-lg">
                View All Products
              </button>
            </div>
          </div>
        </section>

        {/* Brand Banner */}
        <section className="py-24 bg-black text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl lg:text-7xl font-display font-bold mb-8 tracking-tighter">
              #INSPOFASHIONS
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
              Join the movement. Tag us in your fit checks for a chance to be featured on our page.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 opacity-50">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Elements */}
      <MobileBottomNav onCartOpen={() => setIsCartOpen(true)} cartCount={totalItems} />
      
      {/* WhatsApp Button (Floating) */}
      <a 
        href="#"
        className="fixed bottom-24 right-4 lg:bottom-10 lg:right-10 bg-black text-white border border-white/20 p-4 rounded-full shadow-2xl z-30 hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}