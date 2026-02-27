import React, { useState } from 'react';
import {
    Package,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Mock Data representing backend Product entity
const MOCK_PRODUCTS = [
    { id: 1, name: 'Premium Coffee Beans', sku: 'CF-PR-01', category: 'Beverages', price: 18.99, stock: 124, status: 'Active' },
    { id: 2, name: 'Ceramic Mug (Black)', sku: 'MG-CB-02', category: 'Merchandise', price: 12.50, stock: 45, status: 'Active' },
    { id: 3, name: 'Matcha Green Tea', sku: 'TE-MT-03', category: 'Beverages', price: 14.00, stock: 89, status: 'Active' },
    { id: 4, name: 'Artisan Sandwich', sku: 'FD-SW-04', category: 'Food', price: 8.50, stock: 12, status: 'Low Stock' },
    { id: 5, name: 'Espresso Machine', sku: 'EQ-ES-05', category: 'Equipment', price: 1250.00, stock: 2, status: 'Active' },
];

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your inventory, pricing, and product details.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                        placeholder="Search products by name or SKU..."
                        className="pl-10 bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-600 bg-white hover:bg-slate-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Category
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-600 bg-white hover:bg-slate-50">
                        Status
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Product Infomation</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_PRODUCTS.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <button className="p-1 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination mock */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1 to 5 of 24 entries</span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 border-slate-200">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 border-slate-200">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
