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
  DocumentSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

import { ProductProps } from '../../type'; // Adjust this path based on where your types are defined

// Products Collection Services
export const productsCollection = collection(db, 'Products');

// Get all products
export const getAllProducts = async (): Promise<ProductProps[]> => {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductProps | null> => {
  try {
    const docRef = doc(db, 'Products', id);
    const docSnap: DocumentSnapshot = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        _id: docSnap.id,
        ...docSnap.data()
      } as ProductProps;
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData: Omit<ProductProps, '_id'>, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      status: "available"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<ProductProps>): Promise<void> => {
  try {
    const docRef = doc(db, 'Products', id);
    await updateDoc(docRef, productData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'Products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get products by user
export const getProductsByUser = async (userId: string): Promise<ProductProps[]> => {
  try {
    const q = query(productsCollection, where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
  } catch (error) {
    console.error("Error getting user products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ProductProps[]> => {
  try {
    const q = query(productsCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    })) as ProductProps[];
  } catch (error) {
    console.error("Error getting category products:", error);
    throw error;
  }
};

// Storage Services
// Upload product image
export const uploadProductImage = async (file: File, userId: string, productId: string): Promise<string> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `product-images/${userId}/${productId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Delete product image
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Users Collection Services
export const usersCollection = collection(db, 'Users');

// Get user by ID
export const getUserById = async (id: string): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, 'Users', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Add product to user's products array
export const addProductToUser = async (userId: string, productId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const products = userData.products || [];
      
      if (!products.includes(productId)) {
        await updateDoc(userRef, {
          products: [...products, productId]
        });
      }
    }
  } catch (error) {
    console.error("Error adding product to user:", error);
    throw error;
  }
};

// Remove product from user's products array
export const removeProductFromUser = async (userId: string, productId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const products = userData.products || [];
      
      await updateDoc(userRef, {
        products: products.filter((id: string) => id !== productId)
      });
    }
  } catch (error) {
    console.error("Error removing product from user:", error);
    throw error;
  }
};