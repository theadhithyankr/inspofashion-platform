import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Plus, Search, Filter, Edit, Trash2, CheckSquare, ListPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import ProductModal from '../../components/admin/products/ProductModal';
import AddToCollectionModal from '../../components/admin/products/AddToCollectionModal';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Selection state
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddClick = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleModalSuccess = () => {
        fetchProducts();
        setIsModalOpen(false);
    };

    const handleCollectionSuccess = () => {
        setIsCollectionModalOpen(false);
        setSelectedProductIds([]); // Clear selection after successful add
    };

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleSelect = (id: string) => {
        setSelectedProductIds(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedProductIds.length === filteredProducts.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(filteredProducts.map(p => p.id));
        }
    };

    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Products" />

            <main className="p-8 max-w-7xl mx-auto space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                   <div className="flex gap-2">
                        {selectedProductIds.length > 0 && (
                            <button 
                                onClick={() => setIsCollectionModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                            >
                                <ListPlus size={20} />
                                <span>Add to Collection ({selectedProductIds.length})</span>
                            </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                            <Filter size={20} />
                            <span>Filter</span>
                        </button>
                        <button 
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Product</span>
                        </button>
                   </div>
                </div>

                {/* Products Table */}
                 <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="w-10 px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-black focus:ring-black"
                                            checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Inventory</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">Loading products...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">No products found.</td></tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedProductIds.includes(product.id) ? 'bg-gray-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-black focus:ring-black"
                                                    checked={selectedProductIds.includes(product.id)}
                                                    onChange={() => toggleSelect(product.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                        {product.images && product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-sm">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{product.category || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-medium">₹{product.price}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{product.stock_quantity}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${product.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                                    {product.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(product.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </main>

            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSuccess={handleModalSuccess}
            />

            <AddToCollectionModal
                isOpen={isCollectionModalOpen}
                onClose={() => setIsCollectionModalOpen(false)}
                productIds={selectedProductIds}
                onSuccess={handleCollectionSuccess}
            />
        </div>
    );
}
