import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IDeliveryAddress {
  street: string;
  city: string;
  pincode: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: 'pending' | 'paid';
  orderType: 'Dine-In' | 'Delivery';
  tableNumber?: number;
  status: 'Placed' | 'Preparing' | 'Out for delivery' | 'Delivered';
  deliveryAddress: IDeliveryAddress;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['COD', 'UPI'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderType: { type: String, enum: ['Dine-In', 'Delivery'], default: 'Delivery' },
    tableNumber: { type: Number, default: null },
    status: {
      type: String,
      enum: ['Placed', 'Preparing', 'Out for delivery', 'Delivered'],
      default: 'Placed',
    },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
