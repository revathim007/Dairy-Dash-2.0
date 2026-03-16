import { useEffect, useState } from "react";
import API from "../../services/api";
import { Receipt, Droplets, ShoppingCart } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import StatCard from "../../components/StatCard";

function Billing() {
    const [orders, setOrders] = useState([]);
    const [billingData, setBillingData] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("orders/");
            setOrders(res.data);
            calculateBilling(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    const calculateBilling = (ordersData) => {
        const deliveredOrders = ordersData.filter(
            order => order.status === "Delivered"
        );

        const grouped = {};

        deliveredOrders.forEach(order => {
            const customer = order.customer_name || order.customer;
            const quantity = parseFloat(order.quantity_litres);
            let price = 0;

            if (order.product_name?.toLowerCase().includes("buffalo")) {
                price = 60;
            } else {
                price = 50;
            }

            const amount = quantity * price;

            if (!grouped[customer]) {
                grouped[customer] = {
                    orders: 0,
                    litres: 0,
                    amount: 0
                };
            }

            grouped[customer].orders += 1;
            grouped[customer].litres += quantity;
            grouped[customer].amount += amount;
        });

        const result = Object.keys(grouped).map(customer => ({
            customer,
            ...grouped[customer]
        }));

        setBillingData(result);
    };

    // Calculate Summary Stats
    const totalOrders = billingData.reduce((acc, row) => acc + row.orders, 0);
    const totalLitres = billingData.reduce((acc, row) => acc + row.litres, 0);
    const totalAmount = billingData.reduce((acc, row) => acc + row.amount, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black tracking-tight mb-6">Monthly Billing Summary</h1>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Total Litres Delivered"
                    value={`${totalLitres} L`}
                    icon={Droplets}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹ ${totalAmount.toLocaleString()}`}
                    icon={Receipt}
                />
            </div>

            {/* Billing Table */}
            <div>
                <h3 className="text-xl font-bold text-black mb-4">Customer Breakdown</h3>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Customer</Th>
                            <Th className="text-right">Total Orders</Th>
                            <Th className="text-right">Total Litres</Th>
                            <Th className="text-right">Total Amount (₹)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {billingData.length > 0 ? billingData.map((row, index) => (
                            <Tr key={index}>
                                <Td className="font-bold text-black">{row.customer}</Td>
                                <Td className="text-right text-black font-medium">{row.orders}</Td>
                                <Td className="text-right">
                                    <span className="text-brand-primary font-bold">{row.litres}</span>
                                    <span className="text-gray-500 text-xs ml-1 font-bold">L</span>
                                </Td>
                                <Td className="text-right font-bold text-emerald-600">
                                    ₹ {row.amount.toLocaleString()}
                                </Td>
                            </Tr>
                        )) : (
                            <Tr>
                                <Td colSpan="4" className="text-center py-10 text-black font-bold">
                                    No delivered orders available for billing.
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
}

export default Billing;