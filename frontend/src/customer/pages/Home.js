import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Droplets, ShoppingBag, Package, Star, Calendar } from 'lucide-react';
import API from '../../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
    { id: 'All', name: 'All Products', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'Milk', name: 'Fresh Milk', icon: <Droplets className="w-5 h-5" /> },
    { id: 'Paneer', name: 'Paneer & Tofu', icon: <Package className="w-5 h-5" /> },
    { id: 'Curd', name: 'Curd & Yogurt', icon: <Star className="w-5 h-5" /> },
    { id: 'Butter', name: 'Butter & Cheese', icon: <Calendar className="w-5 h-5" /> },
];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const productsRef = useRef(null);

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await API.get('products/');
                setProducts(response.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products by selected category
    // If the category field exists in your Django model, this will work. If not, 'All' shows everything.
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory || p.name.includes(selectedCategory));

    return (
        <div className="w-full flex flex-col gap-8 pb-12">

            {/* Hero Section */}
            <section className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary via-brand-highlight to-blue-900 border border-blue-100 p-8 md:p-12 shadow-2xl flex items-center justify-between text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold mb-4 tracking-wide uppercase">
                        Delivery Before 7 AM
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                        Dairy Dash 🥛 <br />
                        <span className="text-white">
                            Delivered Daily
                        </span>
                    </h1>
                    <p className="text-lg text-blue-100 mb-8 max-w-lg">
                        Subscribe to daily milk deliveries or order fresh farm dairy products instantly directly to your doorstep.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={scrollToProducts}
                            className="px-8 py-3.5 bg-white text-brand-primary hover:bg-blue-50 font-bold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            Start Subscription
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={scrollToProducts}
                            className="px-8 py-3.5 bg-transparent hover:bg-white/10 border border-white/50 text-white font-bold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            Explore Products
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex relative z-10 w-64 h-64 border-4 border-white/20 rounded-full items-center justify-center p-4 bg-white/10 backdrop-blur-sm shadow-[0_0_60px_rgba(255,255,255,0.1)]">
                    <Droplets className="w-32 h-32 text-white animate-pulse" />
                    <div className="absolute -bottom-4 -right-4 bg-white border-2 border-brand-primary p-3 rounded-2xl flex items-center gap-2 shadow-xl">
                        <Star className="text-yellow-400 w-5 h-5 fill-current" />
                        <span className="text-brand-primary font-bold">100% Pure</span>
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section className="w-full mt-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                        Categories
                        <span className="block w-12 h-1 bg-brand-primary rounded-full ml-2"></span>
                    </h2>
                </div>

                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${selectedCategory === cat.id
                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-brand-primary/30 hover:bg-gray-50 font-bold'
                                }`}
                        >
                            <span className={`${selectedCategory === cat.id ? 'text-white' : 'text-brand-primary'}`}>
                                {cat.icon}
                            </span>
                            <span className="font-bold whitespace-nowrap">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Product Grid */}
            <section ref={productsRef} className="w-full mt-4">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-6">
                    {selectedCategory === 'All' ? 'Must-Have Essentials' : `${selectedCategory} Products`}
                    <span className="block w-12 h-1 bg-brand-primary rounded-full ml-2"></span>
                </h2>

                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center text-brand-primary">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
                    </div>
                ) : error ? (
                    <div className="w-full p-6 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center">
                        {error}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="w-full p-12 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Package className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-black mb-2">No Products Found</h3>
                        <p className="text-gray-400">We couldn't find any products in the "{selectedCategory}" category.</p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-highlight transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
