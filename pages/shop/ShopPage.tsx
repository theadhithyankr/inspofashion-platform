import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import MobileBottomNav from '../../components/MobileBottomNav';
import Hero from '../../components/Hero';
import ProductCard from '../../components/ProductCard';
import CartDrawer from '../../components/CartDrawer';
import Footer from '../../components/Footer';
import AuthModal from '../../components/auth/AuthModal';
import { CATEGORIES } from '../../constants';
import { Product, CartItem } from '../../types';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ShopPageProps {
  user?: any;
}

export default function ShopPage({ user }: ShopPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    setSelectedCategory(category ? category.toLowerCase() : null);
  }, [location.search]);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedProducts: Product[] = data.map(dbProduct => ({
            id: dbProduct.id,
            name: dbProduct.title || dbProduct.name, // Fallback to name if title is missing
            price: Number(dbProduct.price),
            originalPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
            image: dbProduct.images && dbProduct.images[0] ? dbProduct.images[0] : 'https://placehold.co/600x800?text=No+Image',
            secondaryImage: dbProduct.images && dbProduct.images[1] ? dbProduct.images[1] : undefined,
            category: dbProduct.category || 'Uncategorized',
            isNew: (new Date().getTime() - new Date(dbProduct.created_at).getTime()) / (1000 * 3600 * 24) < 7, // New if < 7 days
             isSale: false,
             rating: 5,
             reviewCount: 0
           }));
           setProducts(mappedProducts);
         } else {
             setProducts([]); 
         }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isCartOpen || isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isAuthModalOpen]);

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

  const handleUserClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      // User requested redirect to login instead of modal
      navigate('/login');
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.toLowerCase().includes(selectedCategory))
    : products;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation
        onCartOpen={() => setIsCartOpen(true)}
        cartCount={totalItems}
        user={user}
        onUserClick={handleUserClick}
      />

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
              <div
                key={cat.id}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => {
                  setSelectedCategory(cat.name.toLowerCase());
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
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
        <section id="products-section" className="py-16 bg-gray-50 rounded-t-[3rem]">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="flex justify-between items-end mb-10 lg:mb-14">
              <div>
                <span className="text-gray-500 font-bold tracking-widest text-xs uppercase mb-3 block">Don't Miss Out</span>
                <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter">
                  Trending Now
                </h2>
              </div>
              <Link to="/" className="hidden lg:block text-black font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                {selectedCategory ? 'Clear Filter' : 'View All Products'}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                  No products found for this category.
                </div>
              )}
            </div>

            <div className="mt-16 text-center lg:hidden">
              <Link to="/" className="inline-block bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-bold rounded-full w-full shadow-lg">
                {selectedCategory ? 'Clear Filter' : 'View All Products'}
              </Link>
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
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
