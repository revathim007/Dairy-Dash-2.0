import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../../auth/AuthContext';

const CustomerNavbar = () => {


    const { cartItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-highlight rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🥛</span>
                            </div>
                            <span className="text-xl font-bold text-black">
                                Dairy<span className="text-brand-primary">Dash</span>
                            </span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 text-gray-700">

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:text-brand-primary transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 text-xs bg-brand-primary text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Username */}
                        <Link to="/profile" className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                            <User className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Hi, {user?.name || user?.username}
                            </span>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>

                    </div>

                </div>
            </div>
        </nav>
    );


};

export default CustomerNavbar;
