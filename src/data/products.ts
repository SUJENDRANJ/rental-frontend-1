import { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    pricePerWeek: 1800.00,
    pricePerMonth: 6000.00,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 1247,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394652/pexels-photo-3394652.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Electronics',
    inStock: true,
    stockCount: 45,
    tags: ['wireless', 'bluetooth', 'audio'],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Tech Street',
      city: 'New York',
      country: 'USA'
    },
    owner: {
      id: 'owner1',
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.8
    },
    features: ['Noise Cancellation', '30hr Battery', 'Quick Charge', 'Wireless'],
    minRentalDays: 1,
    maxRentalDays: 30
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    price: 249.99,
    pricePerWeek: 1500.00,
    pricePerMonth: 5000.00,
    rating: 4.6,
    reviewCount: 892,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Wearables',
    inStock: true,
    stockCount: 23,
    tags: ['fitness', 'smart', 'health'],
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '456 Fitness Ave',
      city: 'Los Angeles',
      country: 'USA'
    },
    owner: {
      id: 'owner2',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.9
    },
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking'],
    minRentalDays: 3,
    maxRentalDays: 90
  },
  {
    id: '3',
    name: 'Professional Camera Lens',
    description: '85mm f/1.4 portrait lens perfect for professional photography and stunning bokeh effects.',
    price: 1299.99,
    pricePerWeek: 8000.00,
    pricePerMonth: 25000.00,
    rating: 4.9,
    reviewCount: 456,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Photography',
    inStock: false,
    stockCount: 0,
    tags: ['camera', 'lens', 'professional'],
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '789 Photo Blvd',
      city: 'Chicago',
      country: 'USA'
    },
    owner: {
      id: 'owner3',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5.0
    },
    features: ['85mm f/1.4', 'Professional Grade', 'Weather Sealed', 'Image Stabilization'],
    minRentalDays: 1,
    maxRentalDays: 14
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair designed for long work sessions with lumbar support and adjustable height.',
    price: 399.99,
    pricePerWeek: 2400.00,
    pricePerMonth: 8000.00,
    originalPrice: 599.99,
    rating: 4.4,
    reviewCount: 1834,
    image: 'https://images.pexels.com/photos/6764007/pexels-photo-6764007.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Furniture',
    inStock: true,
    stockCount: 12,
    tags: ['office', 'chair', 'ergonomic'],
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '321 Office Way',
      city: 'San Francisco',
      country: 'USA'
    },
    owner: {
      id: 'owner4',
      name: 'Emily Davis',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.7
    },
    features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', 'Ergonomic Design'],
    minRentalDays: 7,
    maxRentalDays: 365
  },
  {
    id: '5',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with cherry MX switches for the ultimate gaming experience.',
    price: 149.99,
    pricePerWeek: 900.00,
    pricePerMonth: 3000.00,
    rating: 4.7,
    reviewCount: 2156,
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Gaming',
    inStock: true,
    stockCount: 67,
    tags: ['gaming', 'keyboard', 'rgb'],
    location: {
      lat: 39.7392,
      lng: -104.9903,
      address: '654 Gaming St',
      city: 'Denver',
      country: 'USA'
    },
    owner: {
      id: 'owner5',
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.6
    },
    features: ['Cherry MX Switches', 'RGB Backlight', 'Programmable Keys', 'Gaming Mode'],
    minRentalDays: 1,
    maxRentalDays: 60
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 29.99,
    pricePerWeek: 180.00,
    pricePerMonth: 600.00,
    rating: 4.3,
    reviewCount: 743,
    image: 'https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Lifestyle',
    inStock: true,
    stockCount: 156,
    tags: ['water', 'bottle', 'insulated'],
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: '987 Lifestyle Ln',
      city: 'Miami',
      country: 'USA'
    },
    owner: {
      id: 'owner6',
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.4
    },
    features: ['Insulated', '24hr Cold', '12hr Hot', 'Leak Proof'],
    minRentalDays: 1,
    maxRentalDays: 30
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek and minimalist design.',
    price: 39.99,
    pricePerWeek: 240.00,
    pricePerMonth: 800.00,
    originalPrice: 59.99,
    rating: 4.5,
    reviewCount: 892,
    image: 'https://images.pexels.com/photos/4526409/pexels-photo-4526409.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    inStock: true,
    stockCount: 89,
    tags: ['wireless', 'charging', 'phone'],
    location: {
      lat: 47.6062,
      lng: -122.3321,
      address: '147 Tech Plaza',
      city: 'Seattle',
      country: 'USA'
    },
    owner: {
      id: 'owner7',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.5
    },
    features: ['Fast Charging', 'Qi Compatible', 'LED Indicator', 'Sleek Design'],
    minRentalDays: 1,
    maxRentalDays: 90
  },
  {
    id: '8',
    name: 'Premium Coffee Beans',
    description: 'Single-origin Ethiopian coffee beans with notes of chocolate and citrus. Perfect for espresso.',
    price: 24.99,
    pricePerWeek: 150.00,
    pricePerMonth: 500.00,
    rating: 4.8,
    reviewCount: 567,
    image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Food & Beverage',
    inStock: true,
    stockCount: 234,
    tags: ['coffee', 'premium', 'organic'],
    location: {
      lat: 45.5152,
      lng: -122.6784,
      address: '258 Coffee Row',
      city: 'Portland',
      country: 'USA'
    },
    owner: {
      id: 'owner8',
      name: 'Maria Garcia',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.9
    },
    features: ['Single Origin', 'Organic', 'Fair Trade', 'Fresh Roasted'],
    minRentalDays: 1,
    maxRentalDays: 7
  },
  {
    id: '9',
    name: 'Minimalist Desk Lamp',
    description: 'Adjustable LED desk lamp with touch controls and multiple brightness levels. Perfect for any workspace.',
    price: 79.99,
    pricePerWeek: 480.00,
    pricePerMonth: 1600.00,
    rating: 4.6,
    reviewCount: 1123,
    image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Office',
    inStock: false,
    stockCount: 0,
    tags: ['lamp', 'led', 'minimalist'],
    location: {
      lat: 42.3601,
      lng: -71.0589,
      address: '369 Design Ave',
      city: 'Boston',
      country: 'USA'
    },
    owner: {
      id: 'owner9',
      name: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.8
    },
    features: ['LED', 'Touch Control', 'Adjustable', 'Energy Efficient'],
    minRentalDays: 7,
    maxRentalDays: 180
  },
  {
    id: '10',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof Bluetooth speaker with 360° sound and 20-hour battery life.',
    price: 89.99,
    pricePerWeek: 540.00,
    pricePerMonth: 1800.00,
    originalPrice: 129.99,
    rating: 4.4,
    reviewCount: 1456,
    image: 'https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    inStock: true,
    stockCount: 78,
    tags: ['speaker', 'bluetooth', 'portable'],
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: '741 Music St',
      city: 'Austin',
      country: 'USA'
    },
    owner: {
      id: 'owner10',
      name: 'Rachel Brown',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.7
    },
    features: ['360° Sound', 'Waterproof', '20hr Battery', 'Portable'],
    minRentalDays: 1,
    maxRentalDays: 30
  },
  {
    id: '11',
    name: 'Yoga Mat Pro',
    description: 'Non-slip yoga mat made from eco-friendly materials. Perfect for all types of yoga practice.',
    price: 49.99,
    pricePerWeek: 300.00,
    pricePerMonth: 1000.00,
    rating: 4.7,
    reviewCount: 823,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Fitness',
    inStock: true,
    stockCount: 45,
    tags: ['yoga', 'fitness', 'eco-friendly'],
    location: {
      lat: 36.1627,
      lng: -86.7816,
      address: '852 Wellness Way',
      city: 'Nashville',
      country: 'USA'
    },
    owner: {
      id: 'owner11',
      name: 'Kevin Lee',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.6
    },
    features: ['Non-Slip', 'Eco-Friendly', 'Extra Thick', 'Portable'],
    minRentalDays: 7,
    maxRentalDays: 90
  },
  {
    id: '12',
    name: 'Smart Home Hub',
    description: 'Central control hub for all your smart home devices with voice control and app integration.',
    price: 199.99,
    pricePerWeek: 1200.00,
    pricePerMonth: 4000.00,
    rating: 4.5,
    reviewCount: 634,
    image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Smart Home',
    inStock: true,
    stockCount: 29,
    tags: ['smart', 'home', 'hub'],
    location: {
      lat: 32.7767,
      lng: -96.7970,
      address: '963 Smart Home Blvd',
      city: 'Dallas',
      country: 'USA'
    },
    owner: {
      id: 'owner12',
      name: 'Amanda Taylor',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.8
    },
    features: ['Voice Control', 'App Integration', 'Multi-Device', 'Easy Setup'],
    minRentalDays: 7,
    maxRentalDays: 365
  }
];

export const categories = [
  'All',
  'Electronics',
  'Wearables',
  'Photography',
  'Furniture',
  'Gaming',
  'Lifestyle',
  'Food & Beverage',
  'Home & Office',
  'Fitness',
  'Smart Home'
];