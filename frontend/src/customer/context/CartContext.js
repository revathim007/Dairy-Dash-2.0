import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {


    const { user } = useContext(AuthContext);

    const getCartKey = () => {
        if (!user) return "smartMilk_cart_guest";
        return `smartMilk_cart_${user.username}`;
    };

    const [cartItems, setCartItems] = useState([]);

    // Load cart when user changes
    useEffect(() => {

        const key = getCartKey();

        try {
            const savedCart = localStorage.getItem(key);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch {
            setCartItems([]);
        }

    }, [user]);

    // Save cart
    useEffect(() => {

        const key = getCartKey();
        localStorage.setItem(key, JSON.stringify(cartItems));

    }, [cartItems, user]);

    const addToCart = (product) => {

        setCartItems(prev => {

            const existingItem = prev.find(item => item.productId === product.id);

            if (existingItem) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    quantity: 1
                }
            ];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {

        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );


};
