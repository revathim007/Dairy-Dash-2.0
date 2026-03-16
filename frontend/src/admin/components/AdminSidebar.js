import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Repeat, ShoppingCart, Receipt, LogOut } from 'lucide-react';
import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: Repeat },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Billing', path: '/admin/billing', icon: Receipt },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">

            {/* Logo */}
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-highlight flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">🥛</span>
                </div>
                <h1 className="text-xl font-bold text-black">Dairy Dash</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">

                {menuItems.map((item) => {

                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'text-black hover:bg-gray-100 hover:text-brand-primary opacity-100'
                                }`}
                        >

                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-black opacity-100'}`} />
                            <span className={`font-bold ${isActive ? 'text-white' : 'text-black opacity-100'}`}>{item.name}</span>

                        </Link>
                    );
                })}

            </nav>

            {/* Admin profile & Logout */}
            <div className="p-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center space-x-3">

                    <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-white">AD</span>
                    </div>

                    <div>
                        <p className="text-sm text-black font-bold">Admin User</p>
                        <p className="text-xs text-gray-500">System Admin</p>
                    </div>

                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    );


};

export default Sidebar;
