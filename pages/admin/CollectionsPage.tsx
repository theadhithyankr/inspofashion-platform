import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Collection } from '../../types';
import CollectionModal from '../../components/admin/collections/CollectionModal';

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCollections(data || []);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        try {
            const { error } = await supabase
                .from('collections')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    const handleEdit = (collection: Collection) => {
        setSelectedCollection(collection);
        setIsModalOpen(true);
    };

    const filteredCollections = collections.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Collections</h1>
                <button
                    onClick={() => { setSelectedCollection(undefined); setIsModalOpen(true); }}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Collection
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Slug</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCollections.map((collection) => (
                                <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {collection.image && (
                                                <img 
                                                    src={collection.image} 
                                                    alt={collection.title} 
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                            )}
                                            <span className="font-medium text-gray-900">{collection.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{collection.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            collection.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {collection.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(collection)}
                                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(collection.id)}
                                                className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredCollections.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No collections found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                collection={selectedCollection}
                onSuccess={fetchCollections}
            />
        </div>
    );
}
