import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="page">
      <section className="page-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </motion.div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-detail">
              <span>📍</span>
              <div>
                <h4>Address</h4>
                <p>123 Brew Street, Coffee Lane<br />Bangalore, Karnataka 560001</p>
              </div>
            </div>
            <div className="contact-detail">
              <span>📞</span>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-detail">
              <span>✉️</span>
              <div>
                <h4>Email</h4>
                <p>hello@digitalcafe.in</p>
              </div>
            </div>
            <div className="contact-detail">
              <span>🕐</span>
              <div>
                <h4>Opening Hours</h4>
                <p>Mon–Fri: 7am – 10pm<br />Sat–Sun: 8am – 11pm</p>
              </div>
            </div>
            <div className="map-placeholder">
              <p>📍 Map Placeholder</p>
              <small>123 Brew Street, Bangalore</small>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="form-input" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="form-input" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={5} className="form-input" />
              </div>
              <button type="submit" className="btn-primary btn-full">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
