import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import type { MenuItem } from '../types';
import MenuCard from '../components/MenuCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/menu')
      .then(({ data }) => {
        const items: MenuItem[] = Array.isArray(data) ? data : data.items ?? [];
        setFeatured(items.filter((i) => i.popular).slice(0, 6));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-home">
      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-tag">Premium Coffee Experience</span>
          <h1 className="hero-title">Experience Coffee<br />Like Never Before</h1>
          <p className="hero-sub">
            Handcrafted beverages, artisan food and warm vibes — all delivered to your doorstep.
          </p>
          <div className="hero-btns">
            <Link to="/menu" className="btn-primary">Explore Menu</Link>
            <Link to="/cart" className="btn-outline-light">Order Now</Link>
          </div>
        </motion.div>
      </section>

      {/* Featured */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Our Favourites</h2>
          <p className="section-sub">Handpicked fan favourites — loved by our regulars.</p>
          {loading ? (
            <LoadingSpinner />
          ) : featured.length > 0 ? (
            <div className="menu-grid">
              {featured.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="empty-msg">Menu coming soon. Check back later!</p>
          )}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/menu" className="btn-primary">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="section about-snippet">
        <div className="container about-snippet-inner">
          <motion.div
            className="about-snippet-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Story</h2>
            <p>
              Born from a passion for exceptional coffee, Digital Café was founded to bring
              café-quality beverages right to your screen — and your doorstep. We source
              single-origin beans, bake fresh daily, and craft every order with care.
            </p>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </motion.div>
          <motion.div
            className="about-snippet-img"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600"
              alt="Café interior"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to order?</h2>
          <p>Use code <strong>WELCOME50</strong> for 50% off your first order!</p>
          <Link to="/menu" className="btn-primary">Order Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
