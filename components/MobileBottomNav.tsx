import React from 'react';
import { Home, Grid, Search, User, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  onCartOpen: () => void;
  cartCount: number;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onCartOpen, cartCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 pb-safe z-40 lg:hidden rounded-t-3xl">
      <div className="flex justify-around items-center h-16">
        <button className="flex flex-col items-center justify-center w-full h-full text-white hover:text-gray-300 active:text-white transition-colors">
          <Home size={22} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-white transition-colors">
          <Grid size={22} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">Cats</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-white transition-colors">
          <Search size={22} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">Search</span>
        </button>
        <button 
          onClick={onCartOpen}
          className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-white transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Cart</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-white transition-colors">
          <User size={22} strokeWidth={1.5} />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;