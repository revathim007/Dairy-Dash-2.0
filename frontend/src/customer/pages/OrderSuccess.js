import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">

            <CheckCircle className="w-20 h-20 text-green-400 mb-6" />

            <h1 className="text-3xl font-bold text-white mb-2">
                Order Confirmed!
            </h1>

            <p className="text-gray-400 mb-8 max-w-md">
                Your order has been placed successfully. It will appear in your orders
                history and will be delivered soon.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/orders"
                    className="px-6 py-3 bg-gradient-to-r from-[#DCA06D] to-[#A55B4B] text-white font-semibold rounded-lg"
                >
                    View Orders
                </Link>

                <Link
                    to="/"
                    className="px-6 py-3 border border-[#DCA06D] text-[#DCA06D] rounded-lg"
                >
                    Continue Shopping
                </Link>
            </div>

        </div>
    );
}