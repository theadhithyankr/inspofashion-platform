import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      
      {/* Mobile Hero (Portrait) */}
      <div className="block lg:hidden h-[85vh] w-full relative">
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1287&auto=format&fit=crop" 
          alt="Mobile Fashion Hero" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        <div className="absolute bottom-24 left-0 right-0 p-6 flex flex-col items-center text-center">
          <span className="text-white border border-white/30 bg-black/50 px-3 py-1 rounded-full font-bold tracking-widest text-xs mb-4 backdrop-blur-sm animate-fade-in">NEW COLLECTION DROPPED</span>
          <h1 className="text-5xl font-display font-bold text-white mb-6 leading-none tracking-tighter shadow-black drop-shadow-lg">
            URBAN<br/>ELEGANCE
          </h1>
          <button className="bg-white text-black w-full py-4 text-lg font-bold tracking-wider uppercase hover:bg-gray-200 transition-colors active:scale-95 transform duration-100 rounded-full shadow-lg">
            Shop The Drop
          </button>
        </div>
      </div>

      {/* Desktop Hero (Landscape) */}
      <div className="hidden lg:block h-screen w-full relative">
        {/* Placeholder for video background or high-res landscape image */}
        <div className="absolute inset-0 bg-gray-900">
             <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop" 
            alt="Desktop Fashion Hero" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-24 max-w-2xl text-white">
          <div className="overflow-hidden mb-6">
            <span className="inline-block text-white border border-white px-4 py-1 rounded-full font-bold tracking-[0.2em] text-sm animate-slide-up bg-black/20 backdrop-blur-md">
              EXCLUSIVE ONLINE PREMIERE
            </span>
          </div>
          <h1 className="text-8xl font-display font-bold mb-6 leading-[0.9] tracking-tighter">
            REDEFINE<br/>YOUR<br/>STYLE
          </h1>
          <p className="text-xl text-gray-300 mb-10 font-light max-w-lg">
            Experience the new era of street fashion. Bold cuts, premium fabrics, and designs that speak louder than words.
          </p>
          <div className="flex gap-6">
             <button className="bg-white text-black px-12 py-4 text-lg font-bold tracking-widest uppercase hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 shadow-lg rounded-full">
              Shop Women
            </button>
            <button className="bg-transparent border-2 border-white text-white px-12 py-4 text-lg font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 rounded-full backdrop-blur-sm">
              Shop Men
            </button>
          </div>
        </div>

        {/* Desktop Scrolling Text/Ticker at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white text-black py-3 overflow-hidden whitespace-nowrap z-10 border-t border-gray-200">
          <div className="animate-marquee gap-12 font-bold tracking-widest uppercase text-sm">
             <span>Free Shipping on Orders Over ₹2000</span>
             <span>•</span>
             <span>New Styles Added Daily</span>
             <span>•</span>
             <span>Easy 7-Day Returns</span>
             <span>•</span>
             <span>COD Available Everywhere</span>
             <span>•</span>
             <span>Free Shipping on Orders Over ₹2000</span>
             <span>•</span>
             <span>New Styles Added Daily</span>
             <span>•</span>
             <span>Easy 7-Day Returns</span>
             <span>•</span>
             <span>COD Available Everywhere</span>
             <span>•</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;