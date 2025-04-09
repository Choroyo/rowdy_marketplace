// src/lib/index.ts
import { getAllProducts, getProductById } from './firebaseServices';

export const getData = async (endpoint: string) => {
  try {
    // Extract product ID if present in the endpoint
    if (endpoint.includes('/products/') && endpoint.split('/').pop() !== '') {
      const id = endpoint.split('/').pop();
      if (id) {
        return await getProductById(id);
      }
    }
    
    // If no specific product ID, return all products
    return await getAllProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};