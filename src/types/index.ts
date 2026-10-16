export type ProductCategory = 'All' | 'Kitchen' | 'On the Go' | 'Clothing';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Kitchen' | 'On the Go' | 'Clothing';
  material: string;
  price: number;
  originalPrice?: number;
  image: string;
  shortDescription: string;
  fullDescription: string;
  details: string[];
  care: string;
  variants?: {
    type: 'size' | 'color' | 'variant';
    label: string;
    options: {
      name: string;
      value: string;
      colorHex?: string;
    }[];
  };
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  product: string;
  rating: number;
  quote: string;
  verifiedSample: boolean;
}
