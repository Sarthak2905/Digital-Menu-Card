import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import type { MenuItem } from '../types';
import MenuCard from '../components/MenuCard';
import LoadingSpinner from '../components/LoadingSpinner';

type FilterType = 'All' | 'Veg' | 'Non-Veg' | 'Beverages' | 'Food' | 'Desserts' | 'Snacks' | 'Cold Drinks';

const FILTERS: FilterType[] = ['All', 'Veg', 'Non-Veg', 'Beverages', 'Food', 'Desserts', 'Snacks', 'Cold Drinks'];

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Read ?table=N from QR code scan and persist it
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam && /^\d+$/.test(tableParam)) {
      localStorage.setItem('cafe_table', tableParam);
      setTableNumber(tableParam);
      toast.success(`Welcome! You're ordering for Table ${tableParam} — your order goes straight to your table.`, { duration: 4000 });
    } else {
      const stored = localStorage.getItem('cafe_table');
      if (stored) setTableNumber(stored);
    }
  }, [searchParams]);

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

      {tableNumber && (
        <div className="table-banner">
          🪑 You're ordering for <strong>Table {tableNumber}</strong> — items go straight to your table!
          <button
            className="table-banner-clear"
            onClick={() => { localStorage.removeItem('cafe_table'); setTableNumber(null); }}
          >
            ✕ Clear
          </button>
        </div>
      )}

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
