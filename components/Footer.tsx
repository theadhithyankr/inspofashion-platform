import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-24 lg:pb-16 border-t border-gray-900 rounded-t-[3rem]">
      <div className="container mx-auto px-6 max-w-[1400px]">
        
        {/* Newsletter - Mobile optimized */}
        <div className="mb-16 text-center max-w-xl mx-auto">
          <h3 className="font-display font-bold text-2xl mb-4 uppercase tracking-wider">Join The Movement</h3>
          <p className="text-gray-400 mb-8 text-sm">Sign up for exclusive access to drops, events and sales.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-sm rounded-full"
            />
            <button className="bg-white text-black font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-200 transition-colors whitespace-nowrap rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 border-t border-gray-900 pt-16">
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-200">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Women</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Men</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Curve</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Kids</a></li>
              <li><a href="#" className="hover:text-white transition-colors font-bold text-white hover:underline">Sale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-200">Help</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Order Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Delivery Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-200">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors hover:underline">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-gray-200">Connect</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              © 2024 INSPOFASHIONS. All rights reserved. <br/>
              Mumbai • Delhi • Bangalore
            </p>
          </div>
        </div>
        
        {/* Payment Icons */}
        <div className="border-t border-gray-900 pt-10 flex flex-wrap justify-center gap-6 opacity-30 grayscale">
            <div className="h-8 w-14 bg-white/20 rounded-md"></div>
            <div className="h-8 w-14 bg-white/20 rounded-md"></div>
            <div className="h-8 w-14 bg-white/20 rounded-md"></div>
            <div className="h-8 w-14 bg-white/20 rounded-md"></div>
            <div className="h-8 w-14 bg-white/20 rounded-md"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;