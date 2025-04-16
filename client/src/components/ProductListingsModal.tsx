import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { getProducts } from '../lib/firebaseServices';
import { store } from '../lib/store';
import ProductForm from './ProductForm';
import SellerDashboard from './SellerDashboard';
import { ProductProps } from '../../type';

interface ProductListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductListingsModal = ({ isOpen, onClose }: ProductListingsModalProps) => {
  const { currentUser } = store();
  const [activeView, setActiveView] = useState<'listings' | 'create'>('listings');
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchProducts();
    }
  }, [isOpen, currentUser]);

  const fetchProducts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const fetchedProducts = await getProducts({ sellerId: currentUser.id });
      setProducts(fetchedProducts as ProductProps[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setActiveView('listings');
    fetchProducts();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-xl font-bold text-[#0C2340]">
                    {activeView === 'listings' ? 'Your Product Listings' : 'Create New Listing'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="mb-6 flex border-b">
                  <button
                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                      activeView === 'listings'
                        ? 'border-[#F15A22] text-[#F15A22]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveView('listings')}
                  >
                    Your Listings
                  </button>
                  <button
                    className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                      activeView === 'create'
                        ? 'border-[#F15A22] text-[#F15A22]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveView('create')}
                  >
                    Create Listing
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                  {activeView === 'listings' ? (
                    <SellerDashboard />
                  ) : (
                    <ProductForm onSuccess={handleCreateSuccess} />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductListingsModal; 