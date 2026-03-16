import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../../services/api';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';

export default function Cart() {

    const navigate = useNavigate();

    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryFee;


    // ⭐ Checkout Function
    const handleCheckout = async () => {

        try {

            const payload = {
                items: cartItems.map(item => ({
                    product_id: item.productId,
                    quantity_litres: item.quantity
                }))
            };

            await API.post("place-order/", payload);

            clearCart();

            navigate("/order-success");

        } catch (error) {
            console.error("Checkout error", error);
            const msg = error.response?.data?.error || "Something went wrong during checkout";
            alert(msg);
        }

    };


    if (cartItems.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-[#4F1C51]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,160,109,0.1)]">
                    <ShoppingBag className="w-16 h-16 text-[#DCA06D]" />
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Your Cart is Empty</h2>
                <p className="text-gray-400 max-w-md text-center mb-8">
                    Looks like you haven't added any dairy products yet. Let's fix that!
                </p>
                <Link
                    to="/"
                    className="px-8 py-3.5 bg-gradient-to-r from-[#DCA06D] to-[#A55B4B] text-white font-bold rounded-lg flex items-center gap-2"
                >
                    Start Shopping
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }


    return (
        <div className="w-full pb-12">

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-[#DCA06D]" />
                    Your Cart
                </h1>
                <button
                    onClick={clearCart}
                    className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="flex-1 space-y-4">

                    {cartItems.map((item) => (

                        <div
                            key={item.productId}
                            className="bg-[#2A0E30] border border-[#4F1C51] rounded-2xl p-6 flex items-center gap-6"
                        >

                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />

                            <div className="flex-1">
                                <h3 className="text-white font-bold">{item.name}</h3>
                                <p className="text-[#DCA06D] font-bold">₹{item.price}</p>
                            </div>

                            <div className="flex items-center gap-3">

                                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                    <Minus />
                                </button>

                                <span className="text-white">{item.quantity}</span>

                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                    <Plus />
                                </button>

                            </div>

                            <button onClick={() => removeFromCart(item.productId)}>
                                <Trash2 className="text-red-400" />
                            </button>

                        </div>

                    ))}

                </div>


                <div className="w-full lg:w-[380px]">

                    <div className="bg-[#2A0E30] rounded-2xl border border-[#DCA06D]/30 p-8">

                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>

                        <div className="flex justify-between text-white text-lg font-bold mt-4">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full mt-6 py-4 bg-gradient-to-r from-[#DCA06D] to-[#A55B4B] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Checkout Securely
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}