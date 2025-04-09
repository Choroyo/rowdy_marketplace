export interface HighlightsType {
  _id: number;
  _base: string;
  title: string;
  name: string;
  image: string;
  color: string;
  buttonTitle: string;
}

export interface CategoryProps {
  _id: number;
  image: string;
  name: string;
  _base: string;
  description: string;
}

export interface ProductProps {
  _id: string;                 // Changed from number to string for Firestore document ID
  name: string;
  price: number;               // Added to match your Firebase schema
  description: string;
  images: string[];            // Changed from [string] to string[]
  category: string;
  createdBy: string;           // Added to match your Firebase schema
  createdAt: any;              // Added for Firestore timestamp
  status: string;              // Added to match your Firebase schema
  
  // Existing properties from your interface
  _base?: string;              // Made optional with ?
  reviews?: number;
  rating?: number;
  quantity?: number;
  overView?: string;
  isStock?: boolean;
  isNew?: boolean;
  discountedPrice?: number;
  regularPrice?: number;
  colors?: string[];           // Changed from [string] to string[]
  brand?: string;
}

export interface BlogProps {
  _id: number;
  image: string;
  title: string;
  description: string;
  _base: string;
}

export interface UserTypes {
  currentUser: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    id: string;
  };
}

export interface FirebaseUserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  products: string[];          // Array of product IDs
}

export interface OrderTypes {
  orderItems: ProductProps[];  // Changed from [ProductProps] to ProductProps[]
  paymentId: string;
  paymentMethod: string;
  userEmail: string;
}