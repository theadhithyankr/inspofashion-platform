import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Velvet Bodycon',
    price: 2499,
    originalPrice: 4999,
    image: 'https://picsum.photos/600/900?random=1',
    secondaryImage: 'https://picsum.photos/600/900?random=11',
    category: 'Dresses',
    isSale: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Urban Street Oversized Tee',
    price: 1299,
    image: 'https://picsum.photos/600/900?random=2',
    secondaryImage: 'https://picsum.photos/600/900?random=12',
    category: 'Tops',
    isNew: true,
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Noir Faux Leather Pants',
    price: 3299,
    image: 'https://picsum.photos/600/900?random=3',
    secondaryImage: 'https://picsum.photos/600/900?random=13',
    category: 'Bottoms',
    rating: 4.9,
    reviewCount: 256
  },
  {
    id: '4',
    name: 'Gilded Chain Accessory',
    price: 899,
    image: 'https://picsum.photos/600/900?random=4',
    secondaryImage: 'https://picsum.photos/600/900?random=14',
    category: 'Accessories',
    isSale: true,
    rating: 4.2,
    reviewCount: 45
  },
  {
    id: '5',
    name: 'Iconic Denim Jacket',
    price: 4599,
    image: 'https://picsum.photos/600/900?random=5',
    secondaryImage: 'https://picsum.photos/600/900?random=15',
    category: 'Outerwear',
    isNew: true,
    rating: 4.7,
    reviewCount: 102
  },
  {
    id: '6',
    name: 'Essential White Crop',
    price: 999,
    originalPrice: 1499,
    image: 'https://picsum.photos/600/900?random=6',
    secondaryImage: 'https://picsum.photos/600/900?random=16',
    category: 'Tops',
    isSale: true,
    rating: 4.6,
    reviewCount: 310
  },
  {
    id: '7',
    name: 'Executive Blazer Dress',
    price: 5999,
    image: 'https://picsum.photos/600/900?random=7',
    secondaryImage: 'https://picsum.photos/600/900?random=17',
    category: 'Dresses',
    isNew: true,
    rating: 4.9,
    reviewCount: 67
  },
  {
    id: '8',
    name: 'Cargo Utility Pants',
    price: 2899,
    image: 'https://picsum.photos/600/900?random=8',
    secondaryImage: 'https://picsum.photos/600/900?random=18',
    category: 'Bottoms',
    rating: 4.4,
    reviewCount: 155
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'New Arrivals', image: 'https://picsum.photos/400/600?random=20' },
  { id: '2', name: 'Dresses', image: 'https://picsum.photos/400/600?random=21' },
  { id: '3', name: 'Tops', image: 'https://picsum.photos/400/600?random=22' },
  { id: '4', name: 'Denim', image: 'https://picsum.photos/400/600?random=23' },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
