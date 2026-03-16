import { Bell, Search, Menu, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-40 text-white">

            {/* Mobile Toggle Placeholder */}
            <div className="flex items-center md:hidden">
                <button className="text-gray-400 hover:text-white transition-colors p-2 -ml-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Page Title */}
            <div className="hidden md:flex items-center">
                <h2 className="text-xl font-bold">Dashboard Overview</h2>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
                <div className="relative w-full group">
                    <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search orders, customers, products..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Right Actions: Notifications & Admin User */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                </button>

                {/* Admin User Name */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-700 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium leading-none mb-1">Admin User</p>
                        <p className="text-xs text-gray-400">admin@smartmilk.com</p>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;
