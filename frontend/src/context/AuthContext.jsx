import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/users/profile');
                    setUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (phone, otp) => {
        const { data } = await api.post('/auth/verify-otp', { phone, otp });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const addAddress = async (addressData) => {
        const { data } = await api.post('/users/address', addressData);
        setUser(prev => ({ ...prev, addresses: data }));
        return data;
    };

    const updateAddress = async (id, addressData) => {
        const { data } = await api.put(`/users/address/${id}`, addressData);
        setUser(prev => ({ ...prev, addresses: data }));
        return data;
    };

    const deleteAddress = async (id) => {
        await api.delete(`/users/address/${id}`);
        setUser(prev => ({
            ...prev,
            addresses: prev.addresses.filter(a => a._id !== id)
        }));
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, addAddress, updateAddress, deleteAddress }}>
            {children}
        </AuthContext.Provider>
    );
};
