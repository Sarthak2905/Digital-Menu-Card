import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <h3>☕ Digital Café</h3>
        <p>Crafting exceptional coffee experiences, one cup at a time.</p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div className="footer-contact">
        <h4>Visit Us</h4>
        <p>123 Brew Street, Coffee Lane</p>
        <p>Bangalore, Karnataka 560001</p>
        <p>+91 98765 43210</p>
        <p>hello@digitalcafe.in</p>
      </div>
      <div className="footer-hours">
        <h4>Hours</h4>
        <p>Mon–Fri: 7am – 10pm</p>
        <p>Sat–Sun: 8am – 11pm</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Digital Café. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
