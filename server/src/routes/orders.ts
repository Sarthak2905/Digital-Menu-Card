import { Router, Response } from 'express';
import Order from '../models/Order';
import auth, { AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/orders - authenticated
router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderData = {
      ...(req.body as object),
      user: req.user!.id,
    };
    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/my - authenticated, current user's orders
router.get('/my', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!.id })
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id - authenticated
router.get('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem', 'name image');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    // Allow only the order owner or admin to view
    if (order.user.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
