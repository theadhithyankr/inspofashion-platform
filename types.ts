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
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export enum ViewMode {
  MOBILE,
  DESKTOP
}
