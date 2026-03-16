import React, { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../auth/AuthContext';
import { Calendar, Package, Clock, Activity, CheckCircle, Truck, RefreshCw } from 'lucide-react';

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            const [ordersRes, subsRes, upcomingRes] = await Promise.all([
                API.get("orders/"),
                API.get("subscriptions/"),
                API.get("upcoming-deliveries/")
            ]);

            setOrders(ordersRes.data);
            setSubscriptions(subsRes.data);
            setUpcomingDeliveries(upcomingRes.data);

        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Skip delivery
    const skipDelivery = async (orderId) => {
        try {
            await API.post(`skip-delivery/${orderId}/`);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to skip delivery", error);
        }
    };

    // ⭐ Pause / Resume subscription
    const toggleSubscription = async (subId) => {
        try {
            await API.post(`toggle-subscription/${subId}/`);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to toggle subscription", error);
        }
    };

    const todayStr = new Date().toISOString().split("T")[0];

    const todaysDeliveries = orders.filter(
        o => o.delivery_date === todayStr && o.status !== "Delivered"
    );

    const activeSubscriptions = subscriptions;

    const orderHistory = orders
        .filter(o => o.status === "Delivered")
        .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-[#DCA06D] animate-spin mb-4" />
                <p className="text-gray-400">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 pb-12">

            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">

                <div>
                    <h1 className="text-3xl font-extrabold text-black mb-1 tracking-tight">
                        Hello, {user?.name || user?.username || 'Customer'}! 👋
                    </h1>

                    <p className="text-gray-500">
                        Here's the summary of your dairy deliveries and subscriptions.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-brand-primary bg-white px-4 py-2 border border-gray-100 rounded-xl shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>

            </div>


            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* LEFT COLUMN */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Today's Deliveries */}
                    <section>

                        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <Truck className="w-6 h-6 text-brand-primary" />
                            Today's Deliveries
                        </h2>

                        {todaysDeliveries.length === 0 ? (

                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">
                                    No deliveries scheduled for today.
                                </p>
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {todaysDeliveries.map(order => (

                                    <div
                                        key={order.id}
                                        className="glass-card p-5"
                                    >

                                        <h3 className="text-lg font-bold text-black mb-2">
                                            {order.product_name}
                                        </h3>

                                        <p className="text-brand-primary font-bold mb-2">
                                            {order.quantity_litres} Litres
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>Expected before 8:00 AM</span>
                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* Upcoming Deliveries */}
                    <section>

                        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-brand-primary" />
                            Upcoming Deliveries
                        </h2>

                        {upcomingDeliveries.length === 0 ? (

                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                                <p className="text-gray-400 font-medium">
                                    No upcoming deliveries found.
                                </p>
                            </div>

                        ) : (

                            <div className="space-y-3">

                                {upcomingDeliveries.slice(0, 5).map(order => (

                                    <div
                                        key={order.id}
                                        className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm"
                                    >

                                        <div>
                                            <p className="font-bold text-black">
                                                {order.product_name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {order.quantity_litres} Litres
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => skipDelivery(order.id)}
                                            className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded border border-red-400/30 hover:bg-red-500/40 transition"
                                        >
                                            Skip
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>


                {/* RIGHT COLUMN */}
                <div className="space-y-8">

                    {/* Subscriptions */}
                    <section>

                        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-brand-primary" />
                            Live Subscriptions
                        </h2>

                        {subscriptions.length === 0 ? (

                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                                <p className="text-gray-400 font-medium text-sm">
                                    You have no subscriptions.
                                </p>
                            </div>

                        ) : (

                            <div className="glass-card overflow-hidden">

                                {subscriptions.map((sub, idx) => (

                                    <div
                                        key={sub.id}
                                        className={`p-5 ${idx !== subscriptions.length - 1 ? 'border-b border-black/5' : ''}`}
                                    >

                                        <h3 className="font-bold text-black mb-1">
                                            {sub.product_name}
                                        </h3>

                                        <p className="text-sm text-brand-primary font-bold mb-3">
                                            {sub.quantity_litres} Litres / {sub.delivery_time}
                                        </p>

                                        <button
                                            onClick={() => toggleSubscription(sub.id)}
                                            className={`text-xs font-bold px-3 py-1 rounded border transition ${sub.active
                                                ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                                                : "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                }`}
                                        >
                                            {sub.active ? "Pause" : "Resume"}
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* Order History */}
                    <section>

                        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            Recent History
                        </h2>

                        <div className="space-y-3">

                            {orderHistory.slice(0, 4).map(order => (

                                <div
                                    key={order.id}
                                    className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm"
                                >

                                    <div>

                                        <p className="font-bold text-black text-sm">
                                            {order.product_name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {order.quantity_litres}L • {order.delivery_date}
                                        </p>

                                    </div>

                                    <div className="text-green-700 text-xs font-bold px-2 py-1 bg-green-100 rounded border border-green-200">
                                        Delivered
                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                </div>

            </div>

        </div>
    );
}