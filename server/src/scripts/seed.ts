import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem';

dotenv.config();

const menuItems = [
  {
    name: 'Cappuccino',
    description: 'Rich espresso topped with steamed milk foam',
    price: 180,
    category: 'Beverages',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Flat White',
    description: 'Smooth espresso with velvety microfoam milk',
    price: 200,
    category: 'Beverages',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Cold Brew',
    description: 'Slow-steeped cold brew coffee served over ice',
    price: 220,
    category: 'Beverages',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Masala Chai',
    description: 'Aromatic spiced tea brewed with ginger and cardamom',
    price: 120,
    category: 'Beverages',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Matcha Latte',
    description: 'Japanese matcha green tea blended with steamed milk',
    price: 250,
    category: 'Beverages',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Classic Croissant',
    description: 'Buttery, flaky French pastry baked fresh daily',
    price: 180,
    category: 'Food',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Chicken Sandwich',
    description: 'Grilled chicken with lettuce, tomato and mayo on toasted bread',
    price: 320,
    category: 'Food',
    type: 'Non-Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Veg Wrap',
    description: 'Grilled vegetables and hummus wrapped in a soft tortilla',
    price: 280,
    category: 'Food',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Eggs Benedict',
    description: 'Poached eggs on English muffin with hollandaise sauce',
    price: 380,
    category: 'Food',
    type: 'Non-Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Avocado Toast',
    description: 'Smashed avocado on sourdough with chili flakes and lemon',
    price: 350,
    category: 'Food',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with ice cream',
    price: 280,
    category: 'Desserts',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with mascarpone, espresso and cocoa',
    price: 320,
    category: 'Desserts',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Cheesecake',
    description: 'New York style baked cheesecake with berry compote',
    price: 300,
    category: 'Desserts',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Brownie',
    description: 'Fudgy chocolate brownie served warm',
    price: 180,
    category: 'Desserts',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Samosa',
    description: 'Crispy fried pastry filled with spiced potatoes and peas',
    price: 80,
    category: 'Snacks',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy buffalo chicken wings with dipping sauce',
    price: 350,
    category: 'Snacks',
    type: 'Non-Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'French Fries',
    description: 'Golden crispy fries seasoned with sea salt',
    price: 150,
    category: 'Snacks',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Nachos',
    description: 'Tortilla chips loaded with cheese, jalapeños and salsa',
    price: 200,
    category: 'Snacks',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled in tandoor with mint chutney',
    price: 280,
    category: 'Snacks',
    type: 'Veg',
    image: '',
    available: true,
    popular: true,
  },
  {
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil and olive oil',
    price: 220,
    category: 'Snacks',
    type: 'Veg',
    image: '',
    available: true,
    popular: false,
  },
];

const seed = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
