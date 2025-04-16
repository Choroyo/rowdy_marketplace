// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import ProductListingsModal from "../components/ProductListingsModal";
import { FaBox, FaPlusCircle, FaShoppingBag, FaUser } from "react-icons/fa";

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <Loading />
          <p className="text-white mt-4">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-utsaBlue/80 rounded-lg p-6 text-white backdrop-blur-sm border border-utsaBlue/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-utsaOrange hover:bg-utsaOrange/90 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-utsaBlue/50 rounded p-2 text-white border border-utsaBlue/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-utsaBlue/50 rounded p-2 text-white border border-utsaBlue/30"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-utsaOrange hover:bg-utsaOrange/90 text-white px-4 py-2 rounded transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-300 text-sm">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-gray-300 text-sm">Role</h3>
                <p className="capitalize">{user.role}</p>
              </div>
              <div>
                <h3 className="text-gray-300 text-sm">First Name</h3>
                <p>{user.firstName}</p>
              </div>
              <div>
                <h3 className="text-gray-300 text-sm">Last Name</h3>
                <p>{user.lastName}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-utsaOrange hover:bg-utsaOrange/90 text-white px-4 py-2 rounded transition"
              >
                <FaUser /> Edit Profile
              </button>
              
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 bg-utsaOrange hover:bg-utsaOrange/90 text-white px-4 py-2 rounded transition"
              >
                <FaBox /> Your Listings
              </button>
            </div>
            
            {user.products && user.products.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-2">Your Products</h3>
                <div className="bg-utsaBlue/50 p-4 rounded border border-utsaBlue/30">
                  <ul className="list-disc pl-5">
                    {user.products.map((productId, index) => (
                      <li key={index}>{productId}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Product Listings Modal */}
      <ProductListingsModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
      />
    </Container>
  );
};

export default Profile;
