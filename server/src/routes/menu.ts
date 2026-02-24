import { Router, Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import auth, { AuthRequest } from '../middleware/auth';
import adminAuth from '../middleware/adminAuth';

const router = Router();

// GET /api/menu - public
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/menu/:id - public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu - admin only
router.post('/', auth, adminAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.create(req.body as object);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/menu/:id - admin only
router.put('/:id', auth, adminAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body as object, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/menu/:id - admin only
router.delete('/:id', auth, adminAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
