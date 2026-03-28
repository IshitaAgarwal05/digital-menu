import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = ({ onProfileClick, onLoginClick }) => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const shareWebsite = () => {
        const url = window.location.origin;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard! 📋');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <header>
            <img src="https://i.postimg.cc/pV8FwNvw/logo_glacier.png" alt="Glacier Ice Cream Logo" className="header-logo" />
            <div className="header-actions">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button className="action-btn btn-profile" onClick={user ? onProfileClick : onLoginClick}>
                    👤 <span className="hide-mobile-text">{user ? 'My Profile' : 'Login'}</span>
                </button>
                <button className="action-btn" onClick={shareWebsite}>
                    📤 <span className="hide-mobile-text">Share</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
