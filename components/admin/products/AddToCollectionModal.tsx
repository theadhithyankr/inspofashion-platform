import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Collection } from '../../../types';

interface AddToCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    productIds: string[];
    onSuccess: () => void;
}

export default function AddToCollectionModal({ isOpen, onClose, productIds, onSuccess }: AddToCollectionModalProps) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCollections();
            setSelectedCollectionId('');
            setError(null);
        }
    }, [isOpen]);

    const fetchCollections = async () => {
        const { data } = await supabase.from('collections').select('*').order('title');
        setCollections(data || []);
    };

    const handleSave = async () => {
        if (!selectedCollectionId) return;
        setLoading(true);
        setError(null);

        try {
            // Prepare batch insert
            const insertData = productIds.map(pid => ({
                product_id: pid,
                collection_id: selectedCollectionId
            }));

            const { error } = await supabase
                .from('product_collections')
                .upsert(insertData, { onConflict: 'product_id, collection_id', ignoreDuplicates: true });

            if (error) throw error;
            
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error adding to collection:', err);
            setError('Failed to add products to collection.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Add to Collection</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Adding {productIds.length} product{productIds.length > 1 ? 's' : ''} to:
                </p>

                <div className="space-y-4">
                    <select
                        className="w-full p-2 border rounded-lg bg-gray-50 font-medium focus:ring-2 focus:ring-black outline-none"
                        value={selectedCollectionId}
                        onChange={(e) => setSelectedCollectionId(e.target.value)}
                    >
                        <option value="" disabled>Select a collection</option>
                        {collections.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.title}
                            </option>
                        ))}
                    </select>

                    {error && <p className="text-xs text-red-500">{error}</p>}
                    
                    {collections.length === 0 && (
                        <p className="text-xs text-gray-500">No collections found. Create one first.</p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedCollectionId || loading}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : 'Add Products'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
