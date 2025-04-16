import { useState, useRef, FormEvent, useEffect } from 'react';
import { createProduct } from '../lib/firebaseServices';
import { store } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const { currentUser } = store();
  const auth = useAuth(); // Get auth context
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState({
    title: '',
    name: '', // Add name field for backward compatibility
    description: '',
    price: 0,
    category: '', // Add category field for product classification
    images: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a product ID once when the component mounts
  useEffect(() => {
    setProductId(uuidv4());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setProduct({ ...product, [name]: parseFloat(value) || 0 });
    } else if (name === 'title') {
      // Update both title and name fields when title changes
      setProduct({ 
        ...product, 
        title: value,
        name: value // Ensure name is set for backward compatibility
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files);
      
      // Create preview URLs for selected images
      const urls = [];
      for (let i = 0; i < e.target.files.length; i++) {
        urls.push(URL.createObjectURL(e.target.files[i]));
      }
      setPreviewUrls(urls);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Upload files to the server
  const uploadImages = async (): Promise<string[]> => {
    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    const uploadPaths: string[] = [];
    setUploadProgress(0);
    
    // Create a clean name for file organization
    const safeName = product.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Upload each file individually
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const file = imageFiles[i];
        const formData = new FormData();
        
        // Create a filename based on product title and ID
        const filename = `${safeName}-${productId}${i > 0 ? `-${i}` : ''}.webp`;
        
        // Add the file and filename to form data
        formData.append('image', file);
        formData.append('filename', filename);
        formData.append('productId', productId);
        
        // Upload to our server
        const response = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          uploadPaths.push(data.path);
          // Update progress
          setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
    
    return uploadPaths;
  };

  // Alternatively, upload all files at once
  const uploadAllImages = async (): Promise<string[]> => {
    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }
    
    try {
      const formData = new FormData();
      
      // Add all images
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }
      
      // Add product ID for filename generation
      formData.append('productId', productId);
      
      // Upload to our server
      const response = await fetch('http://localhost:3001/upload-multiple', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUploadProgress(100);
        return data.files.map((file: any) => file.path);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload images');
      return [];
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Get the seller ID - prefer auth context, fallback to store
    const sellerId = auth.user?.email || (currentUser ? currentUser.id : '');
    
    if (!product.title || !product.description || product.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!imageFiles || imageFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload images to our server
      const imagePaths = await uploadImages();
      
      if (imagePaths.length === 0) {
        toast.error('Failed to upload any images');
        setLoading(false);
        return;
      }
      
      // Create product in database with the uploaded image paths
      const newProduct = await createProduct({
        ...product,
        images: imagePaths,
        _id: productId, // Set the product ID directly
        name: product.title, // Ensure name is set for backward compatibility
        sellerId,
        status: 'available',
      });
      
      toast.success('Product created successfully!');
      
      // Reset form
      setProductId(uuidv4()); // Generate a new ID for next product
      setProduct({
        title: '',
        name: '',
        description: '',
        price: 0,
        category: '',
        images: [],
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setImageFiles(null);
      setPreviewUrls([]);
      setUploadProgress(0);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0C2340]">List a New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Product Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
            placeholder="Enter product title"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be displayed as the product name in listings
          </p>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
          >
            <option value="">Select a category</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
            placeholder="Describe your product"
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD)*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price || ''}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Product Images*
          </label>
          <input
            type="file"
            id="images"
            name="images"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
          />
          <p className="text-sm text-gray-500 mt-1">
            Images will be automatically uploaded to our server
          </p>
          
          {/* Upload progress */}
          {uploadProgress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#F15A22] h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload progress: {uploadProgress}%</p>
            </div>
          )}
          
          {/* Image previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Images:</p>
              <div className="grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="h-24 w-24 object-cover rounded border border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm text-blue-800">
          <h3 className="font-semibold mb-1">Information</h3>
          <p>Images will be automatically uploaded and saved to:</p>
          <code className="bg-blue-100 px-2 py-1 rounded">client/public/images/products/</code>
          <p className="mt-1">Make sure the upload server is running.</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0C2340] hover:bg-[#0A1E38]'
          } transition duration-200`}
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm; 