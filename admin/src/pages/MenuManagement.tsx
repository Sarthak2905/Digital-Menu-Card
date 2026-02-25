import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { MenuItem } from '../types';
import toast from 'react-hot-toast';

const EMPTY_FORM: Omit<MenuItem, '_id'> = {
  name: '',
  description: '',
  price: 0,
  category: 'Beverages',
  type: 'Veg',
  image: '',
  available: true,
  popular: false,
};

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, '_id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/menu');
      setItems(res.data);
    } catch {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    const { _id: _, ...rest } = item;
    setForm(rest);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/api/menu/${id}`);
      toast.success('Item deleted');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const res = await api.put(`/api/menu/${item._id}`, { ...item, available: !item.available });
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data : i)));
    } catch {
      toast.error('Update failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        const res = await api.put(`/api/menu/${editItem._id}`, form);
        setItems((prev) => prev.map((i) => (i._id === editItem._id ? res.data : i)));
        toast.success('Item updated');
      } else {
        const res = await api.post('/api/menu', form);
        setItems((prev) => [...prev, res.data]);
        toast.success('Item added');
      }
      setShowModal(false);
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="loading">Loading menu…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Menu Management</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add New Item</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.image} alt={item.name} className="table-thumb" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x60?text=No+Image'; }} />
                </td>
                <td className="item-name">{item.name}</td>
                <td><span className="badge badge-category">{item.category}</span></td>
                <td><span className={`badge ${item.type === 'Veg' ? 'badge-veg' : 'badge-nonveg'}`}>{item.type}</span></td>
                <td>₹{item.price}</td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" checked={item.available} onChange={() => handleToggleAvailable(item)} />
                    <span className="toggle-slider" />
                  </label>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => updateForm('price', parseFloat(e.target.value))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={(e) => updateForm('category', e.target.value)}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={(e) => updateForm('type', e.target.value)}>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => updateForm('image', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-row form-row--checks">
                <label className="check-label">
                  <input type="checkbox" checked={form.available} onChange={(e) => updateForm('available', e.target.checked)} />
                  Available
                </label>
                <label className="check-label">
                  <input type="checkbox" checked={form.popular} onChange={(e) => updateForm('popular', e.target.checked)} />
                  Popular
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const CATEGORIES = ['Beverages', 'Food', 'Desserts', 'Snacks' ,'Cold Drinks'];
const TYPES = ['Veg', 'Non-Veg'];
