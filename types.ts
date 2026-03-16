export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviewCount: number;
  sizes?: string[]; 
}

export interface Category {
  id: string;
  name: string;
  slug: string; // Added Slug
  description?: string;
  image: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'active' | 'draft' | 'archived';
  product_count?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export enum ViewMode {
  MOBILE,
  DESKTOP
}
