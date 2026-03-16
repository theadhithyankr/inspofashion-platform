import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Collection } from '../../../types';

interface CollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection?: Collection | null;
    onSuccess: () => void;
}

export default function CollectionModal({ isOpen, onClose, collection, onSuccess }: CollectionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        status: 'active',
        image: ''
    });

    useEffect(() => {
        if (collection) {
            setFormData({
                title: collection.title,
                slug: collection.slug,
                description: collection.description || '',
                status: collection.status,
                image: collection.image || ''
            });
        } else {
            // Reset form
            setFormData({
                title: '',
                slug: '',
                description: '',
                status: 'active',
                image: ''
            });
        }
    }, [collection, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSave = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                description: formData.description,
                status: formData.status,
                image: formData.image
            };

            if (collection?.id) {
                const { error } = await supabase
                    .from('collections')
                    .update(dataToSave)
                    .eq('id', collection.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('collections')
                    .insert([dataToSave]);
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving collection:', error);
            alert('Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{collection ? 'Edit Collection' : 'New Collection'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}