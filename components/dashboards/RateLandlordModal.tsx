import React, { useState } from 'react';
import type { BookingHistoryEntry } from '../../types';

interface RateLandlordModalProps {
    booking: BookingHistoryEntry;
    onClose: () => void;
    onSubmit: (data: { rating: number, comment: string }) => void;
}

const StarRatingInput: React.FC<{ rating: number, setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const displayRating = hoverRating || rating;
    
    return (
        <div className="flex items-center justify-center space-x-2" onMouseLeave={() => setHoverRating(0)}>
            {[...Array(5)].map((_, i) => (
                <i 
                    key={i} 
                    className={`fas fa-star text-4xl transition-colors cursor-pointer ${i < displayRating ? 'text-yellow-400' : 'text-slate-300'}`}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onClick={() => setRating(i + 1)}
                />
            ))}
        </div>
    );
};

const RateLandlordModal: React.FC<RateLandlordModalProps> = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating.');
            return;
        }
        onSubmit({ rating, comment });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-extrabold text-slate-800">Rate Your Stay</h2>
                        <p className="mt-1 text-slate-500">How was your experience at <span className="font-semibold">{booking.roomName}</span>?</p>
                    </div>

                    <div>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 text-center mb-2">
                            Share your thoughts (optional)
                        </label>
                        <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            placeholder="What did you like or dislike? Your feedback helps other tenants."
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-100 text-slate-700 font-semibold py-2 px-6 rounded-md hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0}
                            className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-700 transition-colors disabled:bg-slate-400"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RateLandlordModal;
