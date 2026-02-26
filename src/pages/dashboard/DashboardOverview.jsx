import React from 'react';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Users
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' && 'rotate-180'}`} />
                <span>{change}</span>
                <span className="text-slate-400 ml-1">vs last month</span>
            </div>
        </div>
        <div className={`p-3 rounded-xl ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const DashboardOverview = () => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
                </div>
                {/* Date picker or branch selector could go here */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$45,231.89"
                    change="+20.1%"
                    icon={DollarSign}
                    trend="up"
                />
                <StatCard
                    title="Total Orders"
                    value="356"
                    change="+12.5%"
                    icon={ShoppingCart}
                    trend="up"
                />
                <StatCard
                    title="Active Customers"
                    value="2,420"
                    change="+4.3%"
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Avg. Order Value"
                    value="$127.05"
                    change="-2.1%"
                    icon={TrendingUp}
                    trend="down"
                />
            </div>

            {/* Charts & Recent Activity Placeholders */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center text-slate-400">
                        <p className="mb-2">Revenue Chart Placeholder</p>
                        <p className="text-sm">(Integrate Chart.js or Recharts here)</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Order #{1000 + i}</p>
                                        <p className="text-xs text-slate-500">2 mins ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">${(Math.random() * 100).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
