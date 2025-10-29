import { useState, useEffect } from 'react';
import { UtensilsCrossed, BarChart3, ArrowLeft, Loader2 } from 'lucide-react';
import { RatingForm, Rating } from './components/RatingForm';
import { RatingsOverview } from './components/RatingsOverview';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { supabase } from './utils/supabase/client';

const weekdays = [
  { key: 'montag', label: 'Montag' },
  { key: 'dienstag', label: 'Dienstag' },
  { key: 'mittwoch', label: 'Mittwoch' },
  { key: 'donnerstag', label: 'Donnerstag' },
  { key: 'freitag', label: 'Freitag' },
];

export default function App() {
  const [selectedDay, setSelectedDay] = useState('montag');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [view, setView] = useState<'form' | 'overview'>('form');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load ratings from database on mount
  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('ratings')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform database format to app format
      const transformedRatings: Rating[] = (data || []).map((row) => ({
        day: row.day,
        date: row.date,
        categories: {
          vegan: row.vegan,
          vegetarian: row.vegetarian,
          meatFish: row.meat_fish,
          salad: row.salad,
          dessert: row.dessert,
        },
        comment: row.comment,
      }));

      setRatings(transformedRatings);
    } catch (err) {
      console.error('Error loading ratings:', err);
      setError('Bewertungen konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (rating: Rating) => {
    try {
      setSubmitting(true);
      setError(null);

      // Save to database
      const { error: insertError } = await supabase.from('ratings').insert({
        day: rating.day,
        date: rating.date,
        vegan: rating.categories.vegan,
        vegetarian: rating.categories.vegetarian,
        meat_fish: rating.categories.meatFish,
        salad: rating.categories.salad,
        dessert: rating.categories.dessert,
        comment: rating.comment,
      });

      if (insertError) throw insertError;

      // Add to local state
      setRatings((prev) => [rating, ...prev]);
      setView('overview');
    } catch (err) {
      console.error('Error saving rating:', err);
      setError('Bewertung konnte nicht gespeichert werden. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    setView('form');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1704728006655-b9340c92839f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdW5jaCUyMGZvb2QlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjE3NDM2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Lunch background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <UtensilsCrossed className="w-12 h-12" />
            <h1>Mittagessen Bewertung</h1>
          </div>
          <p className="text-orange-100 text-lg">
            Teile deine Meinung zum Essen und hilf uns, besser zu werden! 🍽️
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-red-600">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600">Lade Bewertungen...</p>
          </div>
        ) : view === 'form' ? (
          <>
            {/* Day Selector */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                <label className="block mb-4 text-gray-700">
                  📅 Wähle einen Wochentag
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weekdays.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => setSelectedDay(day.key)}
                      className={`py-3 px-4 rounded-xl transition-all ${
                        selectedDay === day.key
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Form */}
            <div className={submitting ? 'opacity-50 pointer-events-none' : ''}>
              <RatingForm
                selectedDay={weekdays.find((d) => d.key === selectedDay)?.label || ''}
                onSubmit={handleSubmitRating}
              />
            </div>

            {submitting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-orange-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Speichere Bewertung...</span>
              </div>
            )}

            {/* View Statistics Button */}
            {ratings.length > 0 && (
              <button
                onClick={() => setView('overview')}
                className="w-full mt-6 bg-white text-orange-600 border-2 border-orange-500 py-4 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Bewertungsübersicht ansehen ({ratings.length})
              </button>
            )}
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToForm}
              className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zur Bewertung
            </button>

            {/* Overview */}
            <RatingsOverview ratings={ratings} />
          </>
        )}
      </div>
    </div>
  );
}
