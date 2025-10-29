import { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface RatingFormProps {
  selectedDay: string;
  onSubmit: (rating: Rating) => void;
}

export interface Rating {
  day: string;
  date: string;
  categories: {
    vegan: number;
    vegetarian: number;
    meatFish: number;
    salad: number;
    dessert: number;
  };
  comment: string;
}

const categories = [
  { key: 'vegan' as const, label: 'Vegan', emoji: '🌱' },
  { key: 'vegetarian' as const, label: 'Vegetarisch', emoji: '🥗' },
  { key: 'meatFish' as const, label: 'Fleisch/Fisch', emoji: '🍖' },
  { key: 'salad' as const, label: 'Salat', emoji: '🥬' },
  { key: 'dessert' as const, label: 'Dessert', emoji: '🍰' },
];

export function RatingForm({ selectedDay, onSubmit }: RatingFormProps) {
  const [ratings, setRatings] = useState({
    vegan: 0,
    vegetarian: 0,
    meatFish: 0,
    salad: 0,
    dessert: 0,
  });
  const [comment, setComment] = useState('');

  const handleStarClick = (category: keyof typeof ratings, stars: number) => {
    setRatings((prev) => ({ ...prev, [category]: stars }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rating: Rating = {
      day: selectedDay,
      date: new Date().toISOString(),
      categories: ratings,
      comment,
    };
    
    onSubmit(rating);
  };

  const StarRating = ({ 
    category, 
    value 
  }: { 
    category: keyof typeof ratings; 
    value: number 
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-7 h-7 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category.key}
            className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-gray-700">{category.label}</span>
              </div>
              <StarRating category={category.key} value={ratings[category.key]} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
        <label className="block mb-3 text-gray-700">
          💬 Verbesserungsvorschläge & Kommentare
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
          rows={4}
          placeholder="Was hat dir besonders gut geschmeckt? Was könnte besser sein?"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Send className="w-5 h-5" />
        Bewertung absenden
      </button>
    </form>
  );
}
