import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import type { MenuItem } from '../types';
import MenuCard from '../components/MenuCard';
import LoadingSpinner from '../components/LoadingSpinner';

type FilterType = 'All' | 'Veg' | 'Non-Veg' | 'Beverages' | 'Food' | 'Desserts' | 'Snacks';

const FILTERS: FilterType[] = ['All', 'Veg', 'Non-Veg', 'Beverages', 'Food', 'Desserts', 'Snacks'];

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  useEffect(() => {
    api.get('/api/menu')
      .then(({ data }) => {
        const list: MenuItem[] = Array.isArray(data) ? data : data.items ?? [];
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ||
      filter === item.type ||
      filter === item.category;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page">
      <section className="page-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1>Our Menu</h1>
          <p>Explore our full range of handcrafted delights</p>
        </motion.div>
      </section>

      <section className="section">
        <div className="container">
          <div className="menu-controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-buttons">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length > 0 ? (
            <motion.div
              className="menu-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filtered.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <p>No items found. Try a different search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
