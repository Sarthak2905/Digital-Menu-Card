import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: 'Beverages' | 'Food' | 'Desserts' | 'Snacks' | 'Cold Drinks';
  type: 'Veg' | 'Non-Veg';
  image: string;
  available: boolean;
  popular: boolean;
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Beverages', 'Food', 'Desserts', 'Snacks', 'Cold Drinks'],
      required: true,
    },
    type: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
