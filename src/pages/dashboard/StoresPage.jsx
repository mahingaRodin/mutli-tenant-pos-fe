import React from 'react';
import {
    Building2,
    MapPin,
    Users,
    Activity,
    Plus
} from 'lucide-react';
import { Button } from '../../components/ui/button';

// Mock Data representing backend Branch/Store entity
const MOCK_BRANCHES = [
    { id: 1, name: 'Downtown Headquarters', location: '123 Main St, Metro City', manager: 'Alice Smith', employees: 14, status: 'Online', revenue: '$14,500' },
    { id: 2, name: 'Westside Station', location: '450 West Blvd, Metro City', manager: 'Bob Jones', employees: 8, status: 'Online', revenue: '$8,200' },
    { id: 3, name: 'Airport Kiosk', location: 'Terminal C, International', manager: 'Charlie Brown', employees: 4, status: 'Offline', revenue: '$3,100' },
];

const StoresPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stores & Branches</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your multi-location network and view high-level performance.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Branch
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {MOCK_BRANCHES.map((branch) => (
                    <div key={branch.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{branch.name}</h3>
                                    <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <MapPin className="w-3.5 h-3.5 mr-1" />
                                        {branch.location}
                                    </div>
                                </div>
                            </div>
                            <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${branch.status === 'Online'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                {branch.status === 'Online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                                {branch.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4 border-y border-slate-100 my-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Store Manager</p>
                                <p className="text-sm font-medium text-slate-800">{branch.manager}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1 flex items-center"><Users className="w-3 h-3 mr-1" /> Staff</p>
                                <p className="text-sm font-medium text-slate-800">{branch.employees} Active</p>
                            </div>
                            <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">
                                <p className="text-xs text-slate-500 mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> Today's Rev</p>
                                <p className="text-sm font-bold text-indigo-600">{branch.revenue}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">Manage Inventory</Button>
                            <Button variant="outline" className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">View Analytics</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoresPage;
