import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onAddToCart(product);
      setLoading(false);
    }, 500);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-3xl mb-4 transition-transform duration-500 hover:shadow-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isSale && (
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-black rounded-full">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button (Mobile: Always Visible, Desktop: Hover) */}
        <button className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 hover:bg-black hover:text-white text-black lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <Heart size={18} />
        </button>

        {/* Image Swap on Hover (Desktop) */}
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && product.secondaryImage ? 'lg:opacity-0' : 'opacity-100'}`}
        />
        {product.secondaryImage && (
          <img 
            src={product.secondaryImage} 
            alt={`${product.name} back`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 hidden lg:block ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Mobile: Quick Add Button (Bottom Right) */}
        <button 
          onClick={handleAddToCart}
          className="lg:hidden absolute bottom-3 right-3 bg-black text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform z-20"
          aria-label="Add to cart"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ShoppingBag size={18} />
          )}
        </button>

        {/* Desktop: Quick View & Add to Cart Overlay */}
        <div className={`hidden lg:flex absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex-col gap-3 items-center justify-end h-2/3 rounded-b-3xl`}>
           <button className="w-full bg-white text-black font-bold py-3 uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors rounded-full">
            Quick View
          </button>
          <div className="flex w-full gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white font-bold py-3 uppercase text-xs tracking-widest hover:bg-gray-900 transition-colors border border-white/20 flex items-center justify-center gap-2 rounded-full"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-xs lg:text-sm font-medium uppercase tracking-wide truncate text-gray-900">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through decoration-black/40">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        
        {/* Color swatches (Monochrome/Neutral focus) */}
        <div className="flex gap-1.5 mt-2">
          <div className="w-4 h-4 rounded-full bg-black border border-gray-200 cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-4 h-4 rounded-full bg-white border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-4 h-4 rounded-full bg-gray-500 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;