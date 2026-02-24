export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Beverages' | 'Food' | 'Desserts' | 'Snacks';
  type: 'Veg' | 'Non-Veg';
  image: string;
  available: boolean;
  popular: boolean;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: { name: string; email: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'COD' | 'UPI';
  orderType?: 'Dine-In' | 'Delivery';
  tableNumber?: number;
  status: 'Placed' | 'Preparing' | 'Out for delivery' | 'Delivered';
  deliveryAddress: { street: string; city: string; pincode: string };
  createdAt: string;
}

export interface AnalyticsData {
  date: string;
  revenue: number;
  orderCount: number;
}
