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

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface Order {
  _id: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: string;
  orderType?: 'Dine-In' | 'Delivery';
  tableNumber?: number;
  status: 'Placed' | 'Preparing' | 'Out for delivery' | 'Delivered';
  deliveryAddress: { street: string; city: string; pincode: string };
  createdAt: string;
}
