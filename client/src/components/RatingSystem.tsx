import { useState } from 'react';
import { createRating, createNotification } from '../lib/firebaseServices';
import { store } from '../lib/store';
import toast from 'react-hot-toast';

interface RatingSystemProps {
  sellerId: string;
  sellerName: string;
  transactionId?: string;
}

const RatingSystem = ({ sellerId, sellerName, transactionId }: RatingSystemProps) => {
  const { currentUser } = store();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to leave a rating');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create the rating
      await createRating(sellerId, {
        score: rating,
        comment,
        fromUserId: currentUser.id,
      });
      
      // Notify the seller
      await createNotification({
        userId: sellerId,
        type: 'rating',
        message: `${currentUser.firstName} ${currentUser.lastName} gave you a ${rating}-star rating.`,
        relatedId: transactionId,
      });
      
      toast.success('Rating submitted successfully');
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-[#0C2340] mb-4">Rate {sellerName}</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl mr-1 focus:outline-none"
            >
              {star <= (hoveredRating || rating) ? '★' : '☆'}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0 ? `${rating} stars` : 'Select rating'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F15A22]"
          placeholder="Tell us about your experience with this seller..."
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submitting || !currentUser}
        className={`w-full py-2 text-white font-medium rounded-md ${
          submitting || !currentUser
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#F15A22] hover:bg-[#D14C1E]'
        } transition duration-200`}
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
      
      {!currentUser && (
        <p className="mt-2 text-sm text-red-500 text-center">
          You must be logged in to leave a rating
        </p>
      )}
    </div>
  );
};

export default RatingSystem; 