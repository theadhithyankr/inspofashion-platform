import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import CategoryModal from '../../components/admin/categories/CategoryModal';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete?')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const filtered = categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button
                    onClick={() => { setSelectedCategory(undefined); setIsModalOpen(true); }}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Slug</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    {cat.image && <img src={cat.image} className="w-10 h-10 rounded object-cover" />}
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(cat)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
                onSuccess={fetchCategories}
            />
        </div>
    );
}