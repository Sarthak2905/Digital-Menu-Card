import { Router, Response } from 'express';
import Order from '../models/Order';
import auth, { AuthRequest } from '../middleware/auth';
import adminAuth from '../middleware/adminAuth';

const router = Router();

// All admin routes require auth + adminAuth
router.use(auth, adminAuth);

// GET /api/admin/orders - all orders with user info
router.get('/orders', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/orders/:id/status - update order status
router.put('/orders/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body as { status: string };
  const validStatuses = ['Placed', 'Preparing', 'Out for delivery', 'Delivered'];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics - last 30 days daily revenue
router.get('/analytics', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          orderCount: 1,
        },
      },
    ]);

    res.json({ dailyRevenue: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
