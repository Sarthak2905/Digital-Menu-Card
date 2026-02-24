import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => (
  <div className="page">
    <section className="page-hero">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1>About Us</h1>
        <p>Our story, our values, our people.</p>
      </motion.div>
    </section>

    <section className="section">
      <div className="container about-grid">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600" alt="Coffee beans" className="about-img" />
        </motion.div>
        <motion.div className="about-text" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Our Story</h2>
          <p>
            Digital Café was born in 2020 when two coffee enthusiasts decided the world needed
            better access to premium, handcrafted beverages. We started as a small pop-up stall
            in Bangalore's Indiranagar and quickly grew into a beloved neighbourhood café.
          </p>
          <p>
            Today, we source single-origin beans from Coorg, Chikmagalur and Wayanad, roasting
            them in small batches to preserve every nuance of flavour.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section values-section">
      <div className="container">
        <h2 className="section-title">Our Values</h2>
        <div className="values-grid">
          {[
            { icon: '🌱', title: 'Sustainability', desc: 'We partner with eco-conscious farms and use compostable packaging.' },
            { icon: '☕', title: 'Quality First', desc: 'Every bean is hand-selected. Every drink is crafted with precision.' },
            { icon: '❤️', title: 'Community', desc: 'We give back to the farming communities who make our coffee possible.' },
            { icon: '🚀', title: 'Innovation', desc: 'We constantly explore new recipes and brewing techniques.' },
          ].map((v) => (
            <motion.div key={v.title} className="value-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
              <span className="value-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-grid">
          {[
            { name: 'Arjun Sharma', role: 'Head Barista & Co-founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
            { name: 'Priya Nair', role: 'Pastry Chef & Co-founder', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
            { name: 'Rahul Menon', role: 'Operations Manager', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
          ].map((member) => (
            <motion.div key={member.name} className="team-card" whileHover={{ y: -4 }}>
              <img src={member.img} alt={member.name} className="team-img" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
