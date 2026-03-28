import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});

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
                        brand: product.brand
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
        <CartContext.Provider value={{ cart, addToCart, changeQty, clearCart, totalQty, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
