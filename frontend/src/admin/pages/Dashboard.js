import React, { useEffect, useState } from "react";
import API from "../../services/api";

import {
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import {
    Users,
    Repeat,
    ShoppingCart,
    DollarSign,
    Truck
} from "lucide-react";

import StatCard from "../../components/StatCard";

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    StatusBadge
} from "../../components/ui/Table";

function Dashboard() {

    const [orders, setOrders] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    const [stats, setStats] = useState({
        total_customers: 0,
        active_subscriptions: 0,
        todays_orders: 0,
        tomorrows_deliveries: 0,
        monthly_revenue: 0
    });

    useEffect(() => {
        fetchOrders();
        fetchDashboardStats();
    }, []);

    /* -------------------------
       FETCH DASHBOARD STATS
    --------------------------*/

    const fetchDashboardStats = async () => {

        try {

            const res = await API.get("dashboard-stats/");
            setStats(res.data);

        } catch (error) {

            console.error("Error fetching dashboard stats:", error);

        }

    };

    /* -------------------------
       FETCH ORDERS
    --------------------------*/

    const fetchOrders = async () => {

        try {

            const res = await API.get("orders/");
            const fetchedOrders = res.data;

            setOrders(fetchedOrders);

            const ordersPerDay = {};
            const revenuePerDay = {};

            fetchedOrders.forEach((order) => {

                const date = order.delivery_date;

                ordersPerDay[date] = (ordersPerDay[date] || 0) + 1;

                if (order.status === "Delivered") {

                    const price = parseFloat(order.product_price_per_litre || 50);
                    const quantity = parseFloat(order.quantity_litres) || 0;

                    revenuePerDay[date] =
                        (revenuePerDay[date] || 0) + price * quantity;

                }

            });

            const ordersChart = Object.keys(ordersPerDay)
                .sort()
                .map((date) => ({
                    date,
                    orders: ordersPerDay[date]
                }));

            const revenueChart = Object.keys(revenuePerDay)
                .sort()
                .map((date) => ({
                    date,
                    revenue: revenuePerDay[date]
                }));

            setOrdersData(ordersChart);
            setRevenueData(revenueChart);

        } catch (error) {

            console.error("Error fetching orders:", error);

        }

    };

    const totalCustomers = stats.total_customers || 0;
    const activeSubscriptions = stats.active_subscriptions || 0;
    const todaysOrders = stats.todays_orders || 0;
    const tomorrowsDeliveries = stats.tomorrows_deliveries || 0;
    const monthlyRevenue = stats.monthly_revenue || 0;

    const recentOrders = orders.slice(-5).reverse();

    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold text-black tracking-tight">
                    Dashboard Overview
                </h1>

            </div>

            {/* KPI CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                <StatCard
                    title="Total Customers"
                    value={totalCustomers}
                    icon={Users}
                />

                <StatCard
                    title="Active Subscriptions"
                    value={activeSubscriptions}
                    icon={Repeat}
                />

                <StatCard
                    title="Today's Orders"
                    value={todaysOrders}
                    icon={ShoppingCart}
                />

                <StatCard
                    title="Tomorrow Deliveries"
                    value={tomorrowsDeliveries}
                    icon={Truck}
                />

                <StatCard
                    title="Monthly Revenue"
                    value={`₹${monthlyRevenue.toFixed(2)}`}
                    icon={DollarSign}
                />

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* ORDERS TREND */}

                <div className="glass-card p-6">

                    <h3 className="text-lg font-medium text-black mb-4">
                        Orders Trend
                    </h3>

                    <div className="h-[300px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={ordersData}>

                                <defs>
                                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#007BFF" />
                                        <stop offset="100%" stopColor="#00A8E8" />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(0,0,0,0.05)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(0,0,0,0.4)"
                                    tick={{ fill: "rgba(0,0,0,0.4)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    stroke="rgba(0,0,0,0.4)"
                                    tick={{ fill: "rgba(0,0,0,0.4)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#f5f3e9",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        borderRadius: "10px",
                                        color: "#000"
                                    }}
                                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                                />

                                <Bar
                                    dataKey="orders"
                                    fill="url(#orderGrad)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={1200}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* REVENUE TREND */}

                <div className="glass-card p-6">

                    <h3 className="text-lg font-medium text-black mb-4">
                        Revenue Trend
                    </h3>

                    <div className="h-[300px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart data={revenueData}>

                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00A8E8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(0,0,0,0.05)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(0,0,0,0.4)"
                                    tick={{ fill: "rgba(0,0,0,0.4)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    stroke="rgba(0,0,0,0.4)"
                                    tick={{ fill: "rgba(0,0,0,0.4)" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    contentStyle={{
                                        background: "#f5f3e9",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        borderRadius: "10px",
                                        color: "#000"
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#DCA06D"
                                    strokeWidth={3}
                                    fill="url(#revenueGrad)"
                                    animationDuration={1200}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

            {/* RECENT ORDERS */}

            <div className="mt-8">

                <h3 className="text-xl font-bold text-black mb-4">
                    Recent Orders
                </h3>

                <Table>

                    <Thead>

                        <Tr>
                            <Th>Customer</Th>
                            <Th>Product</Th>
                            <Th>Quantity (L)</Th>
                            <Th>Status</Th>
                        </Tr>

                    </Thead>

                    <Tbody>

                        {recentOrders.length > 0 ? (

                            recentOrders.map((order, idx) => (

                                <Tr key={idx}>

                                    <Td className="font-bold text-black">
                                        {order.customer_name || `Customer ${order.customer}`}
                                    </Td>

                                    <Td>
                                        {order.product_name || `Product ${order.product}`}
                                    </Td>

                                    <Td>
                                        {order.quantity_litres}
                                    </Td>

                                    <Td>
                                        <StatusBadge status={order.status} />
                                    </Td>

                                </Tr>

                            ))

                        ) : (

                            <Tr>

                                <Td colSpan="4" className="text-center py-8 text-gray-400">
                                    No recent orders found.
                                </Td>

                            </Tr>

                        )}

                    </Tbody>

                </Table>

            </div>

        </div>

    );

}

export default Dashboard;