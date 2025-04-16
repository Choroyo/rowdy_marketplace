// src/lib/firebaseServices.ts

import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  orderBy,
  arrayUnion
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

import { ProductProps, TransactionProps, NotificationProps } from '../../type'; // Adjust this path based on where your types are defined

// Products Collection Services
export const productsCollection = collection(db, 'Products');

// Get all products
export const getAllProducts = async (): Promise<ProductProps[]> => {
  try {
    console.log("[FirebaseServices] Fetching all products");
    const querySnapshot: QuerySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
    console.log("[FirebaseServices] Fetched", products.length, "products");
    return products;
  } catch (error) {
    console.error("[FirebaseServices] Error getting products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductProps | null> => {
  try {
    console.log("[FirebaseServices] Fetching product with ID:", id);
    const docRef = doc(db, 'Products', id);
    const docSnap: DocumentSnapshot = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("[FirebaseServices] Product found:", id);
      return {
        _id: docSnap.id,
        ...docSnap.data()
      } as ProductProps;
    } else {
      console.warn("[FirebaseServices] No product found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("[FirebaseServices] Error getting product:", error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData: Omit<ProductProps, '_id'>, userId: string): Promise<string> => {
  try {
    console.log("[FirebaseServices] Adding new product for user:", userId);
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      status: "available"
    });
    console.log("[FirebaseServices] Product added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[FirebaseServices] Error adding product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<ProductProps>): Promise<void> => {
  try {
    console.log("[FirebaseServices] Updating product with ID:", id);
    const docRef = doc(db, 'Products', id);
    await updateDoc(docRef, productData);
    console.log("[FirebaseServices] Product updated successfully:", id);
  } catch (error) {
    console.error("[FirebaseServices] Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log("[FirebaseServices] Deleting product with ID:", id);
    const docRef = doc(db, 'Products', id);
    await deleteDoc(docRef);
    console.log("[FirebaseServices] Product deleted successfully:", id);
  } catch (error) {
    console.error("[FirebaseServices] Error deleting product:", error);
    throw error;
  }
};

// Get products by user
export const getProductsByUser = async (userId: string): Promise<ProductProps[]> => {
  try {
    console.log("[FirebaseServices] Fetching products for user:", userId);
    const q = query(productsCollection, where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
    console.log("[FirebaseServices] Fetched", products.length, "products for user:", userId);
    return products;
  } catch (error) {
    console.error("[FirebaseServices] Error getting user products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ProductProps[]> => {
  try {
    console.log("[FirebaseServices] Fetching products for category:", category);
    const q = query(productsCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
    console.log("[FirebaseServices] Fetched", products.length, "products for category:", category);
    return products;
  } catch (error) {
    console.error("[FirebaseServices] Error getting category products:", error);
    throw error;
  }
};

// Storage Services
// Upload product image
export const uploadProductImage = async (file: File, userId: string, productId: string): Promise<string> => {
  try {
    console.log("[FirebaseServices] Uploading image for product:", productId);
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `product-images/${userId}/${productId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log("[FirebaseServices] Image uploaded. URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("[FirebaseServices] Error uploading image:", error);
    throw error;
  }
};

// Delete product image
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    console.log("[FirebaseServices] Deleting image:", imageUrl);
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("[FirebaseServices] Image deleted:", imageUrl);
  } catch (error) {
    console.error("[FirebaseServices] Error deleting image:", error);
    throw error;
  }
};

// Users Collection Services
export const usersCollection = collection(db, 'Users');

// Get user by ID
export const getUserById = async (id: string): Promise<DocumentData | null> => {
  try {
    console.log("[FirebaseServices] Fetching user with ID:", id);
    const docRef = doc(db, 'Users', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("[FirebaseServices] User found:", id);
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.warn("[FirebaseServices] No user found with ID:", id);
      return null;
    }
  } catch (error) {
    console.error("[FirebaseServices] Error getting user:", error);
    throw error;
  }
};

// Add product to user's products array
export const addProductToUser = async (userId: string, productId: string): Promise<void> => {
  try {
    console.log("[FirebaseServices] Adding product", productId, "to user", userId);
    const userRef = doc(db, 'Users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const products = userData.products || [];
      
      if (!products.includes(productId)) {
        await updateDoc(userRef, {
          products: [...products, productId]
        });
        console.log("[FirebaseServices] Product added to user", userId);
      }
    }
  } catch (error) {
    console.error("[FirebaseServices] Error adding product to user:", error);
    throw error;
  }
};

// Remove product from user's products array
export const removeProductFromUser = async (userId: string, productId: string): Promise<void> => {
  try {
    console.log("[FirebaseServices] Removing product", productId, "from user", userId);
    const userRef = doc(db, 'Users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const products = userData.products || [];
      
      await updateDoc(userRef, {
        products: products.filter((id: string) => id !== productId)
      });
      console.log("[FirebaseServices] Product removed from user", userId);
    }
  } catch (error) {
    console.error("[FirebaseServices] Error removing product from user:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData: Partial<ProductProps>) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: serverTimestamp(),
      status: 'available'
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get all products
export const getProducts = async (filter: { sellerId?: string; status?: string } = {}) => {
  try {
    let q = query(productsCollection);
    
    // Apply filters if provided
    if (filter.sellerId) {
      q = query(q, where('sellerId', '==', filter.sellerId));
    }
    
    if (filter.status) {
      q = query(q, where('status', '==', filter.status));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Update a product
export const updateProductData = async (productId: string, productData: Partial<ProductProps>) => {
  try {
    const docRef = doc(productsCollection, productId);
    await updateDoc(docRef, productData);
    return { _id: productId, ...productData };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProductData = async (productId: string) => {
  try {
    const docRef = doc(productsCollection, productId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Transactions Collection Services
export const transactionsCollection = collection(db, 'Transactions');

// Create a new transaction
export const createTransaction = async (transactionData: Partial<TransactionProps>) => {
  try {
    const docRef = await addDoc(transactionsCollection, {
      ...transactionData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    // Update product status to 'sold'
    if (transactionData.productId) {
      const productRef = doc(productsCollection, transactionData.productId);
      await updateDoc(productRef, { status: 'sold' });
    }
    
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Get transactions for a user (as buyer or seller)
export const getUserTransactions = async (userId: string, role: 'buyer' | 'seller' = 'buyer') => {
  try {
    const field = role === 'seller' ? 'sellerId' : 'buyerId';
    const q = query(transactionsCollection, where(field, '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// Update transaction status
export const updateTransactionStatus = async (transactionId: string, status: string) => {
  try {
    const docRef = doc(transactionsCollection, transactionId);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Notifications Collection Services
export const notificationsCollection = collection(db, 'Notifications');

// Create a notification
export const createNotification = async (notificationData: Partial<NotificationProps>) => {
  try {
    const docRef = await addDoc(notificationsCollection, {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...notificationData };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get notifications for a user
export const getUserNotifications = async (userId: string) => {
  try {
    const q = query(
      notificationsCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const docRef = doc(notificationsCollection, notificationId);
    await updateDoc(docRef, { read: true });
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Ratings Collection Services
export const createRating = async (sellerId: string, ratingData: { score: number; comment: string; fromUserId: string; createdAt?: any }) => {
  try {
    const userRef = doc(db, 'Users', sellerId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    // Add the new rating with timestamp
    const ratingWithTimestamp = {
      ...ratingData,
      createdAt: ratingData.createdAt || serverTimestamp()
    };
    
    await updateDoc(userRef, {
      ratings: arrayUnion(ratingWithTimestamp)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating rating:", error);
    throw error;
  }
};
