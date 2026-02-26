import React from 'react';
import { Search, ListFilter, CreditCard, Banknote, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';

// Mock Data
const MOCK_CATEGORIES = ['All', 'Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Merch'];
const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 10 + 2).toFixed(2),
    category: MOCK_CATEGORIES[Math.floor(Math.random() * 5) + 1],
    stock: Math.floor(Math.random() * 50),
}));

const PosTerminal = () => {
    return (
        <div className="flex-1 flex overflow-hidden w-full h-full">
            {/* Left Area: Product Grid */}
            <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
                {/* Categories / Filter Bar */}
                <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                        {MOCK_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${cat === 'All'
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="ml-4 pl-4 border-l border-slate-200 hidden sm:flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600">
                            <ListFilter className="w-4 h-4 mr-2" />
                            Sort
                        </Button>
                    </div>
                </div>

                {/* Products Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {MOCK_PRODUCTS.map(product => (
                            <button
                                key={product.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-left hover:shadow-md hover:border-indigo-300 transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className="aspect-square bg-slate-100 rounded-xl mb-3 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                    <Package className="w-10 h-10 text-slate-400 group-hover:text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-slate-900 truncate leading-tight">{product.name}</h3>
                                <p className="text-xs text-slate-500 mb-2 truncate">{product.category}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-bold text-indigo-700">${product.price}</span>
                                    <span className="text-[10px] font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Area: Cart Panel */}
            <div className="w-[320px] lg:w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0 relative z-10 shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)]">

                {/* Cart Header */}
                <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Current Order</h2>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Clear
                    </Button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                        <ShoppingCart className="w-12 h-12 mb-3 text-slate-200" />
                        <p>Cart is empty</p>
                        <p className="text-sm">Select products to add</p>
                    </div>
                    {/* Example item if there were any */}
                    {/* 
            <div className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
               <div className="flex-1">
                 <h4 className="font-medium text-slate-900 text-sm">Product 1</h4>
                 <div className="text-xs text-slate-500 mt-1">$12.99 x 2</div>
               </div>
               <div className="font-bold text-slate-900">$25.98</div>
            </div>
            */}
                </div>

                {/* Totals & Checkout Panel */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">$0.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Tax (8%)</span>
                            <span className="font-medium text-slate-900">$0.00</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                            <span className="font-medium text-slate-900">Total</span>
                            <span className="text-3xl font-bold text-indigo-600">$0.00</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <Button variant="outline" className="h-14 w-full bg-white border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 flex flex-col items-center justify-center gap-1">
                            <Banknote className="w-5 h-5" />
                            <span className="text-xs">Cash</span>
                        </Button>
                        <Button variant="outline" className="h-14 w-full bg-white border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 flex flex-col items-center justify-center gap-1">
                            <CreditCard className="w-5 h-5" />
                            <span className="text-xs">Card</span>
                        </Button>
                    </div>

                    <Button className="w-full h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                        Charge $0.00
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default PosTerminal;
