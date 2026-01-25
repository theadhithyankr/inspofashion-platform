import React from 'react';
import { X, Minus, Plus, Trash2, Lock } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity,
  onRemoveItem 
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 2000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const remainingForFreeShipping = shippingThreshold - subtotal;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className={`fixed z-[60] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col
        /* Mobile: Bottom Sheet */
        bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        /* Desktop: Right Sidebar */
        lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:h-full lg:w-[450px] lg:rounded-l-3xl lg:rounded-r-none lg:${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-display font-bold">BAG</h2>
            <span className="text-gray-500 text-sm">({items.length} items)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-gray-50 text-black p-4 text-center text-xs font-medium tracking-wide border-b border-gray-100">
          {isFreeShipping ? (
             <span className="flex items-center justify-center gap-2 text-black font-bold">
               ✨ YOU'VE UNLOCKED FREE SHIPPING
             </span>
          ) : (
            <span>Add <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span> for FREE Shipping</span>
          )}
          <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
              <ShoppingBagIcon size={48} className="opacity-20" />
              <p>Your bag is empty.</p>
              <button 
                onClick={onClose}
                className="text-black font-bold border-b-2 border-black pb-1 uppercase tracking-widest text-sm hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 animate-fade-in">
                <div className="w-24 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm line-clamp-2 pr-4">{item.name}</h3>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize || 'M'}</p>
                    <p className="font-bold mt-2">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white pb-safe">
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{isFreeShipping ? 'FREE' : '₹99'}</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-bold mb-6 font-display border-t border-gray-100 pt-4">
              <span>TOTAL</span>
              <span>{formatPrice(isFreeShipping ? subtotal : subtotal + 99)}</span>
            </div>

            <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-[0.99] rounded-full shadow-lg">
              <Lock size={16} />
              Checkout Securely
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider">
              Easy Returns • Secure Payment
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const ShoppingBagIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default CartDrawer;