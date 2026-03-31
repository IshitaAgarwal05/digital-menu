import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import LocationPicker from './LocationPicker';

const AddressManager = ({ onSelect }) => {
    const { user, addAddress, deleteAddress } = useContext(AuthContext);
    const { deliveryAddress, setDeliveryAddress } = useContext(CartContext);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        house: '',
        street: '',
        landmark: '',
        city: 'Jaipur',
        pincode: '',
        instructions: ''
    });

    // Auto-select if only one address exists and none is selected
    React.useEffect(() => {
        if (user.addresses?.length > 0 && !deliveryAddress && onSelect) {
            const firstAddr = user.addresses[0];
            setDeliveryAddress(firstAddr);
            onSelect(firstAddr);
        }
    }, [user.addresses, deliveryAddress, onSelect, setDeliveryAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAddr = await addAddress(formData);
        if (newAddr && onSelect) {
            // Auto select the newly added address
            const latest = newAddr[newAddr.length - 1];
            setDeliveryAddress(latest);
            onSelect(latest);
        }
        setIsFormOpen(false);
        setFormData({
            label: 'Home',
            fullName: '',
            phone: '',
            house: '',
            street: '',
            landmark: '',
            city: 'Jaipur',
            pincode: '',
            instructions: '',
            latitude: null,
            longitude: null
        });
    };

    if (!user) return <p className="login-prompt-msg">Please login to manage addresses</p>;

    return (
        <div className="address-manager">
            <div className="address-header">
                <h4>{onSelect ? "Select Delivery Address" : "My Addresses"}</h4>
                {!isFormOpen && (
                    <button className="add-address-btn" onClick={() => setIsFormOpen(true)}>+ New Address</button>
                )}
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.form
                        className="address-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                    >
                        <div className="form-row">
                            <select value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })}>
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                            <input type="text" placeholder="Full Name" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <input type="text" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        <div className="form-row">
                            <input type="text" placeholder="Flat / House No" required value={formData.house} onChange={e => setFormData({ ...formData, house: e.target.value })} />
                            <input type="text" placeholder="Street / Area" required value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <input type="text" placeholder="Landmark" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} />
                            <input type="text" placeholder="Pincode" required value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                        </div>

                        <div className="map-picker-container">
                            <LocationPicker
                                initialLocation={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : null}
                                onLocationSelect={(loc, addressData) => {
                                    setFormData(prev => {
                                        const updates = { latitude: loc.lat, longitude: loc.lng };

                                        if (addressData) {
                                            if (addressData.postcode && !prev.pincode) updates.pincode = addressData.postcode;

                                            // Determine city
                                            const city = addressData.city || addressData.town || addressData.village || addressData.county || addressData.state_district;
                                            if (city && (!prev.city || prev.city === 'Jaipur')) updates.city = city;

                                            // Note: OSM street/house data is often mostly incorrect or overly granular.
                                            // We combine available road/area data and suggest it as a landmark, 
                                            // leaving the exact "Flat/House" and "Street/Area" fields blank for the user.
                                            const areaSuggestion = [];
                                            if (addressData.road) areaSuggestion.push(addressData.road);
                                            if (addressData.suburb) areaSuggestion.push(addressData.suburb);
                                            if (addressData.neighbourhood) areaSuggestion.push(addressData.neighbourhood);

                                            if (areaSuggestion.length > 0 && !prev.landmark) {
                                                updates.landmark = areaSuggestion.join(', ');
                                            }
                                        }

                                        return { ...prev, ...updates };
                                    });
                                }}
                            />
                        </div>

                        <textarea placeholder="Delivery Instructions (Optional)" rows="2" value={formData.instructions} onChange={e => setFormData({ ...formData, instructions: e.target.value })} />
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Save Address</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="address-list">
                {user.addresses?.map(addr => (
                    <div
                        key={addr._id}
                        className={`address-card ${deliveryAddress?._id === addr._id ? 'selected' : ''}`}
                        onClick={() => {
                            setDeliveryAddress(addr);
                            if (onSelect) onSelect(addr);
                        }}
                    >
                        <div className="addr-badge">{addr.label}</div>
                        <div className="addr-details">
                            <span className="addr-name">{addr.fullName}</span>
                            <span className="addr-text">{addr.house}, {addr.street}</span>
                            <span className="addr-subtext">{addr.landmark ? addr.landmark + ', ' : ''}{addr.city} - {addr.pincode}</span>
                        </div>
                        {!onSelect && (
                            <button className="delete-addr" onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(addr._id);
                            }}>🗑️</button>
                        )}
                        {onSelect && deliveryAddress?._id === addr._id && (
                            <div className="selected-tick">✅</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManager;
