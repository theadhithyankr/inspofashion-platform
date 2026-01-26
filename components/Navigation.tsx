import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User, Heart, X } from 'lucide-react';

interface NavigationProps {
  onCartOpen: () => void;
  cartCount: number;
  user?: any;
  onUserClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCartOpen, cartCount, user, onUserClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Container */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-black/95 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
          }`}
      >
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex items-center justify-between">

            {/* Mobile Left: Menu & Search */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Desktop Left: Logo */}
            <div className="flex items-center gap-8">
              <div className="text-2xl lg:text-3xl font-bold tracking-tighter text-white font-display cursor-pointer select-none">
                INSPO<span className="font-light">FASHIONS</span>
              </div>

              {/* Desktop Menu Links */}
              <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-white/90">
                <a href="#" className="hover:text-white hover:underline decoration-white underline-offset-4 transition-all">WOMEN</a>
                <a href="#" className="hover:text-white hover:underline decoration-white underline-offset-4 transition-all">MEN</a>
                <a href="#" className="hover:text-white hover:underline decoration-white underline-offset-4 transition-all font-bold">SALE</a>
                <a href="#" className="hover:text-white hover:underline decoration-white underline-offset-4 transition-all">NEW IN</a>
              </div>
            </div>

            {/* Center (Desktop): Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <div className={`relative transition-all duration-300 ${isScrolled ? 'bg-white/10' : 'bg-black/30'} rounded-full`}>
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="w-full bg-transparent text-white placeholder-white/50 px-6 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-white/30 text-sm"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
              <button className="text-white hover:text-gray-300 transition-colors lg:hidden">
                <Search size={24} />
              </button>

              <div className="hidden lg:flex items-center gap-6">
                <button
                  onClick={onUserClick}
                  className="text-white hover:text-gray-300 transition-colors flex flex-col items-center group"
                >
                  <User size={20} className={`group-hover:scale-110 transition-transform ${user ? 'fill-white' : ''}`} />
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">
                    {user ? 'Profile' : 'Sign In'}
                  </span>
                </button>
                <button className="text-white hover:text-gray-300 transition-colors flex flex-col items-center group">
                  <Heart size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">Wishlist</span>
                </button>
              </div>

              <button
                onClick={onCartOpen}
                className="text-white hover:text-gray-300 transition-colors relative p-1"
                aria-label="Cart"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col animate-fade-in lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-display font-bold text-2xl tracking-tighter">MENU</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4 text-2xl font-bold font-display tracking-wider">
              <a href="#" className="block py-2 border-b border-white/10">WOMEN</a>
              <a href="#" className="block py-2 border-b border-white/10">MEN</a>
              <a href="#" className="block py-2 border-b border-white/10 font-bold">SALE</a>
              <a href="#" className="block py-2 border-b border-white/10">NEW ARRIVALS</a>
              <a href="#" className="block py-2 border-b border-white/10">CURVE + PLUS</a>
            </div>

            <div className="pt-6 space-y-4">
              <button
                onClick={() => {
                  onUserClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-2xl"
              >
                <User size={20} className={user ? 'fill-white' : ''} />
                <span>{user ? 'My Account' : 'Sign In / Register'}</span>
              </button>
              <button className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-2xl">
                <Heart size={20} />
                <span>Wishlist</span>
              </button>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mt-4">
                <span className="text-sm text-gray-400">Currency</span>
                <span className="font-bold">INR (₹)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;