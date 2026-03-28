import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);

    const handleSendOTP = async () => {
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/send-otp', { phone: '+91' + phone });
            setStep(2);
        } catch (err) {
            setError('Error sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError('Enter a 6-digit OTP.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login('+91' + phone, otp);
            onClose();
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-modal">
            <div className="modal-content-box">
                <div className="modal-header-row">
                    <h2>Login / Register</h2>
                    <div className="close-modal-icon" onClick={onClose}>×</div>
                </div>
                <p style={{ fontSize: '0.9em', color: '#64748b', marginBottom: '20px', marginTop: 0 }}>
                    Enter your mobile number to get an OTP.
                </p>

                {step === 1 ? (
                    <div id="phone-input-section">
                        <span className="auth-label" style={{ fontSize: '0.85em', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterspacing: '0.5px' }}>Mobile Number</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" value="+91" disabled style={{ width: '60px', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', background: '#f1f5f9', textAlign: 'center', fontWeight: 'bold', color: '#475569' }} />
                            <input
                                type="number"
                                placeholder="9876543210"
                                className="auth-input"
                                style={{ flex: 1, width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1em', marginBottom: '15px', color: '#334155' }}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button
                            className="auth-btn"
                            style={{ width: '100%', padding: '16px', background: 'var(--glacier-blue)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(31,81,198,0.2)' }}
                            onClick={handleSendOTP}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                ) : (
                    <div id="otp-input-section">
                        <span className="auth-label" style={{ fontSize: '0.85em', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterspacing: '0.5px' }}>Enter OTP</span>
                        <input
                            type="number"
                            placeholder="123456"
                            className="auth-input"
                            style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1em', marginBottom: '15px', color: '#334155', letterSpacing: '2px', fontWeight: 'bold', textAlign: 'center' }}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            className="auth-btn"
                            style={{ width: '100%', padding: '16px', background: 'var(--glacier-blue)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(31,81,198,0.2)' }}
                            onClick={handleVerifyOTP}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </div>
                )}

                {error && <div style={{ color: '#e74c3c', fontSize: '0.85em', fontWeight: 600, marginTop: '10px', textAlign: 'center' }}>{error}</div>}
            </div>
        </div>
    );
};

export default AuthModal;
