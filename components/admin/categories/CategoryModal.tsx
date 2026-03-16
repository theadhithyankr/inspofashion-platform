import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Category } from '../../../types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | undefined;
    onSuccess: () => void;
}

export default function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                image: category.image || ''
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                image: ''
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSave = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                description: formData.description,
                image: formData.image
            };

            if (category?.id) {
                const { error } = await supabase.from('categories').update(dataToSave).eq('id', category.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([dataToSave]);
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{category ? 'Edit Category' : 'New Category'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            placeholder="Auto-generated if empty"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}