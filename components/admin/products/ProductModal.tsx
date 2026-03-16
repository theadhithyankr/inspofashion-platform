import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Plus, Trash2, Loader } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null; // If provided, we are editing
    onSuccess: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<ProductInsert>>({
        title: '',
        slug: '',
        sku: '',
        description: '',
        price: 0,
        category: '',
        stock_quantity: 0,
        status: 'active',
        images: [],
        sizes: ['S','M','L','XL'] // Default sizes, or empty
    });

    const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    // Image URL input state
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name').order('name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                slug: product.slug,
                sku: product.sku,
                description: product.description,
                price: product.price,
                category: product.category,
                stock_quantity: product.stock_quantity,
                status: product.status,
                images: product.images || [],
                sizes: product.sizes || ['S','M','L','XL']
            });
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                slug: '',
                sku: '',
                description: '',
                price: 0,
                category: '',
                stock_quantity: 0,
                status: 'active',
                images: []
            });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Auto-generate slug if missing or empty
        const generatedSlug = formData.title 
            ? formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            : 'product-' + Date.now();
        
        // Auto-generate SKU if missing
        const generatedSku = formData.sku || 'SKU-' + Date.now().toString(36).toUpperCase();
            
        const dataToSave = { 
            ...formData, 
            slug: formData.slug || generatedSlug,
            sku: generatedSku
        };

        try {
            if (product?.id) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(dataToSave)
                    .eq('id', product.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert([dataToSave as ProductInsert]);
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error saving product:', err);
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = () => {
        if (!imageUrl) return;
        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), imageUrl]
        }));
        setImageUrl('');
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        setError(null);
        
        try {
            const uploadedUrls: string[] = [];
            const files = Array.from(e.target.files);

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                if (data) {
                    uploadedUrls.push(data.publicUrl);
                }
            }

            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedUrls]
            }));

        } catch (err: any) {
            console.error('Error uploading images:', err);
            setError(err.message || 'Failed to upload images. Check storage bucket "products" exists.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Product Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                    placeholder="e.g. Classic White Tee"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">SKU</label>
                                    <input 
                                        type="text"
                                        value={formData.sku || ''}
                                        onChange={e => setFormData({...formData, sku: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category</label>
                                    {categories.length > 0 ? (
                                        <select
                                            value={formData.category || ''}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all appearance-none"
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input 
                                            type="text"
                                            value={formData.category || ''}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                            placeholder="e.g. Men, Women"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Description</label>
                            <textarea 
                                rows={4}
                                value={formData.description || ''}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all resize-none"
                                placeholder="Describe your product..."
                            />
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                                <input 
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Stock</label>
                                <input 
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.stock_quantity}
                                    onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Status</label>
                                <select 
                                    value={formData.status || 'active'}
                                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SIZES.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            const currentSizes = formData.sizes || [];
                                            const newSizes = currentSizes.includes(size)
                                                ? currentSizes.filter(s => s !== size)
                                                : [...currentSizes, size];
                                            setFormData({...formData, sizes: newSizes});
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                            (formData.sizes || []).includes(size)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Product Images</label>
                            
                            {/* Current Images */}
                            {formData.images && formData.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
                                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Image Input */}
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="url"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    placeholder="Enter image URL (https://...)"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all"
                                />
                                <button 
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors font-bold"
                                    title="Add URL"
                                >
                                    <Plus size={20} />
                                </button>
                                
                                <span className="text-gray-400 font-bold px-2">OR</span>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-3 bg-black text-white hover:bg-gray-800 rounded-xl transition-colors font-bold flex items-center gap-2 whitespace-nowrap"
                                >
                                    {uploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                                    <span className="hidden sm:inline">Upload Files</span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">Paste an image URL or upload from your device.</p>
                        </div>

                        {/* Actions */}
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading || uploading ? <Loader className="animate-spin" /> : <><Save size={20} /> <span>Save Product</span></>}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}