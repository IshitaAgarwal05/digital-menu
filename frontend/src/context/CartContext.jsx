import React, { createContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = (open) => {
        if (typeof open === 'boolean') {
            setIsCartOpen(open);
        } else {
            setIsCartOpen(!isCartOpen);
        }
    };

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#1e40af', '#ffffff']
        });
        setCart((prev) => {
            const existing = prev[product.name];
            if (existing) {
                return {
                    ...prev,
                    [product.name]: { ...existing, qty: existing.qty + 1 }
                };
            } else {
                return {
                    ...prev,
                    [product.name]: {
                        price: product.price,
                        qty: 1,
                        brand: product.brand,
                        image: product.image
                    }
                };
            }
        });
    };

    const changeQty = (name, delta) => {
        setCart((prev) => {
            const existing = prev[name];
            if (!existing) return prev;

            const newQty = existing.qty + delta;
            if (newQty <= 0) {
                const newCart = { ...prev };
                delete newCart[name];
                return newCart;
            }

            return {
                ...prev,
                [name]: { ...existing, qty: newQty }
            };
        });
    };

    const clearCart = () => {
        setCart({});
    };

    const totalQty = Object.values(cart).reduce((acc, curr) => acc + curr.qty, 0);
    const totalPrice = Object.values(cart).reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, changeQty, clearCart, totalQty, totalPrice,
            isCartOpen, toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
