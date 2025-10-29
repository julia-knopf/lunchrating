import { Star, TrendingUp, MessageSquare } from 'lucide-react';
import { Rating } from './RatingForm';

interface RatingsOverviewProps {
  ratings: Rating[];
}

const categories = [
  { key: 'vegan' as const, label: 'Vegan', emoji: '🌱' },
  { key: 'vegetarian' as const, label: 'Vegetarisch', emoji: '🥗' },
  { key: 'meatFish' as const, label: 'Fleisch/Fisch', emoji: '🍖' },
  { key: 'salad' as const, label: 'Salat', emoji: '🥬' },
  { key: 'dessert' as const, label: 'Dessert', emoji: '🍰' },
];

export function RatingsOverview({ ratings }: RatingsOverviewProps) {
  const calculateAverage = (category: keyof Rating['categories']) => {
    const validRatings = ratings.filter((r) => r.categories[category] > 0);
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, r) => acc + r.categories[category], 0);
    return sum / validRatings.length;
  };

  const renderStars = (average: number) => {
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= Math.round(average)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">
          {average > 0 ? average.toFixed(1) : '—'}
        </span>
      </div>
    );
  };

  const totalRatings = ratings.length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8" />
          <h2>Bewertungsübersicht</h2>
        </div>
        <p className="text-orange-100">
          Basierend auf {totalRatings} {totalRatings === 1 ? 'Bewertung' : 'Bewertungen'}
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const average = calculateAverage(category.key);
          const count = ratings.filter((r) => r.categories[category.key] > 0).length;
          
          return (
            <div
              key={category.key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <div>
                    <div className="text-gray-700">{category.label}</div>
                    <div className="text-sm text-gray-500">
                      {count} {count === 1 ? 'Bewertung' : 'Bewertungen'}
                    </div>
                  </div>
                </div>
                {renderStars(average)}
              </div>
              
              {average > 0 && (
                <div className="mt-2 bg-gray-50 rounded-lg h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-amber-400 h-full transition-all duration-500"
                    style={{ width: `${(average / 5) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {ratings.filter((r) => r.comment.trim()).length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h3 className="text-gray-700">Kommentare & Vorschläge</h3>
          </div>
          <div className="space-y-3">
            {ratings
              .filter((r) => r.comment.trim())
              .map((rating, index) => (
                <div
                  key={index}
                  className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-400"
                >
                  <div className="text-sm text-orange-600 mb-1">
                    {rating.day}
                  </div>
                  <p className="text-gray-700">{rating.comment}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
