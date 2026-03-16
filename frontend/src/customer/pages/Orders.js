import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { CheckCircle, Clock } from "lucide-react";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("orders/");
            setOrders(res.data);
        } catch (error) {
            console.error("Error loading orders", error);
        }
    };

    const markDelivered = async (id) => {
        try {
            await API.patch(`orders/${id}/`, {
                status: "Delivered"
            });

            fetchOrders();
        } catch (error) {
            console.error("Error updating order", error);
        }
    };

    return (
        <div className="w-full">

            {/* Page Title */}
            <h1 className="text-3xl font-bold text-white mb-8">
                Orders Management
            </h1>

            {/* Orders List */}
            <div className="space-y-6">

                {orders.map(order => (

                    <div
                        key={order.id}
                        className="bg-[#2A0E30] border border-[#4F1C51] rounded-xl p-6 flex justify-between items-center shadow-md"
                    >

                        {/* Order Info */}
                        <div>

                            <p className="text-lg font-bold text-white">
                                {order.product_name}
                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                                Quantity: {order.quantity_litres} Litre
                            </p>

                            <p className="text-gray-400 text-sm">
                                Delivery Date: {order.delivery_date}
                            </p>

                        </div>

                        {/* Status / Action */}
                        <div>

                            {order.status === "Pending" ? (

                                <button
                                    onClick={() => markDelivered(order.id)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <CheckCircle size={18} />
                                    Mark Delivered
                                </button>

                            ) : (

                                <span className="flex items-center gap-2 text-green-400 font-semibold">
                                    <CheckCircle size={18} />
                                    Delivered
                                </span>

                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}