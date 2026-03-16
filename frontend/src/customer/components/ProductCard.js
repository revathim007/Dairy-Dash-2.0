import React from 'react';
import { ShoppingCart, Calendar, Star, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import API from '../../services/api';

const ProductCard = ({ product }) => {
    const { addToCart } = React.useContext(CartContext);
    const [added, setAdded] = React.useState(false);

    const imageUrl = product.image_url || 'https://via.placeholder.com/300?text=No+Image';
    const price = product.price ? Number(product.price) : 0;
    const name = product.name || "Unknown Product";
    const quantity = product.quantity || 0;
    const description = product.description || "Fresh dairy product delivered daily.";

    const handleAddToCart = () => {
        if (quantity <= 0) {
            alert("Product out of stock!");
            return;
        }

        const cartItem = {
            id: product.id,
            name: name,
            price: price,
            quantity: 1,
            image: imageUrl
        };

        addToCart(cartItem);

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // -----------------------------
    // SUBSCRIBE DAILY
    // -----------------------------
    const handleSubscribe = async () => {

        const quantity = prompt("Enter quantity in litres:");

        if (!quantity) return;

        const deliveryTime = prompt("Enter delivery time (Morning / Evening):");

        if (!deliveryTime) return;

        try {
            await API.post("subscriptions/", {
                product: product.id,
                quantity_litres: quantity,
                delivery_time: deliveryTime,
                start_date: new Date().toISOString().split("T")[0],

            });

            alert("Subscription created successfully!");

        } catch (error) {
            console.error(error);
            alert("Failed to create subscription.");
        }
    };

    return (
        <div className="glass-card overflow-hidden hover:border-brand-primary/50 transition-all duration-300 group shadow-lg flex flex-col h-full">

            {/* Product Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    4.9
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">

                {/* Title + Price */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-black leading-tight truncate mr-2">
                        {name}
                    </h3>

                    <span className="text-brand-primary font-black text-lg whitespace-nowrap">
                        ₹{price.toFixed(2)}
                    </span>
                </div>

                <p className="text-sm text-gray-600 font-medium mb-2 line-clamp-2 min-h-[40px]">
                    {description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {quantity > 0 ? `${quantity} L Available` : 'Out of Stock'}
                    </span>
                </div>

                {/* Buttons */}
                <div className="mt-auto flex flex-col gap-2">

                    {/* Add To Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={quantity <= 0}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold rounded-xl shadow-md transform active:scale-95 transition-all text-sm ${quantity <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : added
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'btn-primary'
                            }`}
                    >
                        {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        {quantity <= 0 ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
                    </button>

                    {/* Subscribe */}
                    <button
                        onClick={handleSubscribe}
                        disabled={quantity <= 0}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold rounded-xl transition-all text-sm shadow-sm ${quantity <= 0
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 border border-brand-primary/30 text-black hover:border-brand-primary'
                            }`}
                    >
                        <Calendar className={`w-4 h-4 ${quantity <= 0 ? 'text-gray-300' : 'text-brand-primary'}`} />
                        Subscribe Daily
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;