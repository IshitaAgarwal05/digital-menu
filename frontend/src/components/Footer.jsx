import React from 'react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <img src="https://i.postimg.cc/pV8FwNvw/logo_glacier.png" alt="Glacier Logo" className="footer-logo" />
                    <p>Experience the finest frozen delights at Glacier Ice Cream. Quality and taste in every scoop.</p>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <ul className="footer-links">
                        <li>📞 +91 98296 10570</li>
                        <li>📍 Jaipur, Rajasthan, India</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#">Instagram</a>
                        <a href="#">Email</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Glacier Ice Cream. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
