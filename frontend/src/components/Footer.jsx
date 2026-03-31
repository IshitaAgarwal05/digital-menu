import React from 'react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <img src="https://i.postimg.cc/pV8FwNvw/logo_glacier.png" alt="Glacier Logo" className="footer-logo" />
                    <p>Experience the finest frozen delights at Glacier Ice Cream. Quality and taste in every scoop.</p>
                </div>
                <div className="footer-section contact-map-section">
                    <div>
                        <h4>Contact Us</h4>
                        <ul className="footer-links">
                            <li>📞 +91 98296 10570</li>
                            <li>📍 A-12, Janta Store, University Marg, Bapu Nagar, Jaipur, Rajasthan 302015</li>
                        </ul>
                    </div>
                    <div className="footer-map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.4213569402764!2d75.8071750118585!3d26.89011956096231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db69dbfffffff%3A0x1a4693a0a6097129!2sGlacier%20Ice%20Cream%20Parlor!5e0!3m2!1sen!2sin!4v1774763113586!5m2!1sen!2sin"
                            width="100%"
                            height="150"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Glacier Ice Cream Location"
                        ></iframe>
                    </div>
                </div>
                {/* <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#">Instagram</a>
                        <a href="#">Email</a>
                    </div>
                </div> */}
            </div>
            <div className="footer-bottom">
                <div className="footer-copyright">
                    &copy; {new Date().getFullYear()} Glacier Ice Cream.
                    <p>All brand logos, names, and trademarks displayed on this menu are the property of their respective owners.
                        *Volume & MRP subject to change. Please refer to actual packaging for final details. </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
