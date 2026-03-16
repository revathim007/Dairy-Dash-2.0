import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Check, RefreshCw } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td, StatusBadge } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem("access");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await API.get("orders/");
            setOrders(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const markDelivered = async (id) => {
        try {
            await API.patch(`orders/${id}/`, { status: "Delivered" });

            fetchOrders();

            setMessage({
                type: "success",
                text: "Order marked as delivered.",
            });

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Update error:", error);

            setMessage({
                type: "error",
                text: "Failed to update order status.",
            });

            setTimeout(() => setMessage(null), 3000);
        }
    };

    const generateTodayOrders = async () => {
        try {
            setIsGenerating(true);
            setMessage(null);

            const response = await API.post("generate-orders/");

            console.log("Orders generated:", response.data);

            setMessage({
                type: "success",
                text: "Today's orders generated successfully!",
            });

            fetchOrders();

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Generate Orders Error:", error.response || error);

            setMessage({
                type: "error",
                text: "Failed to generate orders. Check console for details.",
            });

            setTimeout(() => setMessage(null), 3000);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-black tracking-tight">
                    Today's Orders
                </h1>

                <div className="flex items-center gap-4">
                    {message && (
                        <div
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${message.type === "success"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <Button
                        onClick={generateTodayOrders}
                        disabled={isGenerating}
                        className="shadow-[0_0_15px_rgba(165,91,75,0.4)]"
                    >
                        <RefreshCw
                            className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""
                                }`}
                        />

                        {isGenerating
                            ? "Generating..."
                            : "Generate Today's Orders"}
                    </Button>
                </div>
            </div>

            <Table>
                <Thead>
                    <Tr>
                        <Th>Customer</Th>
                        <Th>Product</Th>
                        <Th>Quantity</Th>
                        <Th>Delivery Date</Th>
                        <Th>Status</Th>
                        <Th className="text-right">Actions</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Tr key={order.id}>
                                <Td className="font-bold text-black">
                                    {order.customer_name}
                                </Td>

                                <Td>{order.product_name}</Td>

                                <Td>
                                    <span className="text-brand-highlight font-medium">
                                        {order.quantity_litres}
                                    </span>
                                    <span className="text-xs ml-1">L</span>
                                </Td>

                                <Td>{order.delivery_date}</Td>

                                <Td>
                                    <StatusBadge status={order.status} />
                                </Td>

                                <Td>
                                    <div className="flex justify-end gap-2">
                                        {order.status !== "Delivered" && (
                                            <button
                                                onClick={() =>
                                                    markDelivered(order.id)
                                                }
                                                className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-xl"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan="6"
                                className="text-center py-10 text-gray-400"
                            >
                                No orders found.
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </div>
    );
}

export default Orders;