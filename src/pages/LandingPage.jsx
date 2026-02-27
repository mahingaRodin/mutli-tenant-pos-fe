import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
    Store,
    ShoppingCart,
    LineChart,
    Users,
    Zap,
    ShieldCheck,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white/60 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300 group">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                                TenantPOS
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
                            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Log in
                            </Link>
                            <Link to="/register">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-full px-6 transition-all active:scale-95">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[600px] h-[600px] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 left-0 -ml-48 mt-48 w-[600px] h-[600px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="text-sm font-medium text-slate-600">SaaS Platform v2.0 is Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                        The Ultimate POS for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                            Modern Retailers
                        </span>
                    </h1>

                    <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                        Manage multiple branches, track inventory in real-time, and process transactions seamlessly. Built for scale, explicitly designed for your growth.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1">
                                Start your free trial <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 text-slate-700 bg-white/50 backdrop-blur-sm hover:bg-white transition-all">
                            Book a Demo
                        </Button>
                    </div>

                    {/* Hero Image Mockup */}
                    <div className="mt-20 relative px-4 lg:px-0 mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 hidden lg:block"></div>
                        <div className="relative bg-white border border-slate-200/50 rounded-[2rem] shadow-2xl overflow-hidden shadow-slate-200/50">
                            {/* Mockup Top Bar */}
                            <div className="h-12 bg-slate-100/80 backdrop-blur-sm border-b border-slate-200/60 flex items-center px-6 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            {/* Mockup Content - Abstract representation */}
                            <div className="p-8 bg-slate-50 flex gap-6">
                                {/* Sidebar Mock */}
                                <div className="w-64 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hidden md:flex flex-col gap-3">
                                    <div className="h-10 bg-slate-100 rounded-lg w-full mb-4"></div>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`h-10 rounded-lg ${i === 1 ? 'bg-indigo-50/50 w-full' : 'bg-slate-100/50 w-3/4'}`}></div>
                                    ))}
                                </div>
                                {/* Main Content Mock */}
                                <div className="flex-1 space-y-6">
                                    {/* Header Mock */}
                                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="h-6 w-48 bg-slate-100 rounded-md"></div>
                                            <div className="h-4 w-32 bg-slate-50 rounded-md"></div>
                                        </div>
                                    </div>
                                    {/* Grid Mock */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col justify-end">
                                                <div className="h-4 w-1/2 bg-slate-100 rounded-md mb-2"></div>
                                                <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Core Features</h2>
                        <h2 className="text-4xl font-black text-slate-900 mb-6">Everything you need to run your business</h2>
                        <p className="text-lg text-slate-600">
                            TenantPOS provides a complete suite of tools to manage your products, process sales, and analyze performance across all your locations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={ShoppingCart}
                            title="Lightning Fast POS"
                            description="An intuitive, touch-friendly terminal designed for speed. Process transactions in seconds with our optimized cashier interface."
                        />
                        <FeatureCard
                            icon={Store}
                            title="Multi-Branch Ready"
                            description="Manage multiple store locations from a single dashboard. Synchronize inventory, prices, and settings instantly."
                        />
                        <FeatureCard
                            icon={LineChart}
                            title="Real-time Analytics"
                            description="Make data-driven decisions with interactive dashboards. Track revenue, identify best sellers, and monitor cash flow."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Inventory Management"
                            description="Never run out of stock again. Get automated low-stock alerts and manage supplier orders precisely."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Employee & Shifts"
                            description="Track employee performance, manage permissions, and maintain secure cash drawer handovers between shifts."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Enterprise Security"
                            description="Your data is safe with us. We use bank-level encryption, regular backups, and role-based access control."
                        />
                    </div>
                </div>
            </section>

            {/* Trust & CTA Section */}
            <section className="py-24 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/20 to-purple-900/20"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to transform your retail experience?</h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of businesses that trust TenantPOS to power their daily operations. Setup takes less than 5 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-slate-200">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-slate-200">14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-slate-200">Cancel anytime</span>
                        </div>
                    </div>

                    <Link to="/register">
                        <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]">
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">TenantPOS</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 TenantPOS Systems. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
