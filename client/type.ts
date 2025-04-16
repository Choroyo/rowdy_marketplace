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
  _id: string;                 // Firestore document ID
  title: string;               // Changed from name to title
  price: number;
  description: string;
  images: string[];
  sellerId: string;            // Changed from createdBy to sellerId
  status: string;              // available/sold
  createdAt: any;              // Firestore timestamp
  
  // Existing properties from the interface
  name?: string;               // Maintaining backward compatibility
  category?: string;
  _base?: string;
  reviews?: number;
  rating?: number;
  quantity?: number;
  overView?: string;
  isStock?: boolean;
  isNew?: boolean;
  discountedPrice?: number;
  regularPrice?: number;
  colors?: string[];
  brand?: string;
  mainImage?: string;          // Added for compatibility with our image path helper
}

export interface TransactionProps {
  _id: string;                 // Firestore document ID
  productId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: string;              // pending/completed/cancelled
  createdAt: any;              // Firestore timestamp
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
    role?: string;             // Added role
  };
}

export interface FirebaseUserProps {
  id: string;
  name: string;
  email: string;
  role: string;                // user/seller/admin
  products: string[];          // Array of product IDs
  paymentDetails?: {           // Added payment details for sellers
    email?: string;
    phone?: string;
  };
  ratings?: {                  // Added ratings
    score: number;
    comment: string;
    fromUserId: string;
    createdAt: any;
  }[];
}

export interface OrderTypes {
  orderItems: ProductProps[];
  paymentId: string;
  paymentMethod: string;
  userEmail: string;
  status?: string;             // Added status
}

export interface NotificationProps {
  _id: string;
  userId: string;
  type: string;                // purchase/sale/status-change/rating
  message: string;
  relatedId?: string;          // ID of related product/transaction/etc.
  read: boolean;
  createdAt: any;
}