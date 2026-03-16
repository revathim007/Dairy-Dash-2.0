import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Calendar, Milk, PauseCircle, PlayCircle } from "lucide-react";

export default function Subscriptions() {

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await API.get("subscriptions/");
            setSubscriptions(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load subscriptions.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-white text-center py-10">
                Loading subscriptions...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400 text-center py-10">
                {error}
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className="text-gray-400 text-center py-10">
                You don't have any subscriptions yet.
            </div>
        );
    }

    return (
        <div className="w-full pb-12">

            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Milk className="text-[#DCA06D]" />
                My Subscriptions
            </h1>

            <div className="grid gap-6">

                {subscriptions.map((sub) => (

                    <div
                        key={sub.id}
                        className="bg-[#2A0E30] border border-[#4F1C51] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >

                        {/* Subscription Info */}
                        <div className="flex flex-col gap-2">

                            <h3 className="text-xl font-bold text-white">
                                {sub.product_name}
                            </h3>

                            <p className="text-gray-400">
                                Quantity: {sub.quantity_litres} Litre
                            </p>

                            <p className="text-gray-400">
                                Delivery Time: {sub.delivery_time}
                            </p>

                            <p className="text-gray-400 flex items-center gap-2">
                                <Calendar size={16} />
                                Start Date: {sub.start_date}
                            </p>

                            <p className={`font-semibold ${sub.active ? "text-green-400" : "text-red-400"}`}>
                                {sub.active ? "Active Subscription" : "Paused"}
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">

                            {sub.active ? (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                                >
                                    <PauseCircle size={18} />
                                    Pause
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                                >
                                    <PlayCircle size={18} />
                                    Resume
                                </button>
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}