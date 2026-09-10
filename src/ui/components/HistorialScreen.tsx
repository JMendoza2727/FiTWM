// ============================================================
// FiTWM - Historial Screen
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { useMemo, useState, useCallback } from 'react';
import { DailySummary, Meal, MealAnalysis } from '@domain/types';

function formatDateDisplay(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) return 'Hoy';
  if (dateStr === yesterday) return 'Ayer';

  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function MealTypeLabel({ type }: { type: string }) {
  const labels: Record<string, { label: string; icon: string }> = {
    desayuno: { label: 'Desayuno', icon: '☀️' },
    comida: { label: 'Comida', icon: '🌤️' },
    cena: { label: 'Cena', icon: '🌙' },
    snack: { label: 'Snack', icon: '🍎' },
  };
  const info = labels[type] || { label: type, icon: '🍽️' };
  return (
    <span className="historial-meal-type">
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
}

function MealSummary({ meal, onDelete, onRepeat }: { meal: MealAnalysis; onDelete: () => void; onRepeat: () => void }) {
  return (
    <div className="historial-meal">
      <div className="historial-meal-header">
        <MealTypeLabel type={meal.meal.type} />
        <div className="historial-meal-actions">
          <button className="historial-meal-action-btn" onClick={onRepeat} aria-label="Repetir">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          <button className="historial-meal-action-btn historial-meal-action-delete" onClick={onDelete} aria-label="Eliminar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="historial-meal-items">
        {meal.meal.foods.map(f => (
          <div key={f.id} className="historial-meal-item">
            <span className="historial-meal-item-name">{f.name}</span>
            <span className="historial-meal-item-grams">{f.grams}g</span>
          </div>
        ))}
      </div>
      <div className="historial-meal-totals">
        <span className="historial-meal-total-kcal">{Math.round(meal.totalKcal)} kcal</span>
        <span className="historial-meal-total-macros">
          P: {Math.round(meal.totalProtein)}g · C: {Math.round(meal.totalCarbs)}g · G: {Math.round(meal.totalFat)}g
        </span>
      </div>
    </div>
  );
}

export function HistorialScreen() {
  const { meals, setMeals, dailySummary, setDailySummary, historyDate, setHistoryDate, favoriteMeals, setFavoriteMeals, setCurrentScreen } = useAppContext();
  const [editingDate, setEditingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(historyDate);

  const dates = useMemo(() => {
    const dateSet = new Set<string>();
    meals.forEach(m => {
      const d = m.timestamp.split('T')[0];
      dateSet.add(d);
    });
    if (dailySummary) {
      dateSet.add(dailySummary.date);
    }
    return Array.from(dateSet).sort().reverse();
  }, [meals, dailySummary]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, DailySummary> = {};
    dates.forEach(d => {
      const ds = dailySummary?.date === d ? dailySummary : null;
      if (ds) {
        groups[d] = ds;
      } else {
        const dayMeals = meals.filter(m => m.timestamp.startsWith(d));
        let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        const mealAnalyses: MealAnalysis[] = [];
        dayMeals.forEach(m => {
          const foods = m.foods;
          totalKcal += foods.reduce((s, f) => s + f.kcal, 0);
          totalProtein += foods.reduce((s, f) => s + f.protein, 0);
          totalCarbs += foods.reduce((s, f) => s + f.carbs, 0);
          totalFat += foods.reduce((s, f) => s + f.fat, 0);
          mealAnalyses.push({
            meal: m,
            totalKcal: foods.reduce((s, f) => s + f.kcal, 0),
            totalProtein: foods.reduce((s, f) => s + f.protein, 0),
            totalCarbs: foods.reduce((s, f) => s + f.carbs, 0),
            totalFat: foods.reduce((s, f) => s + f.fat, 0),
            analyzedAt: m.timestamp,
          });
        });
        groups[d] = {
          date: d,
          meals: mealAnalyses,
          totalKcal,
          totalProtein,
          totalCarbs,
          totalFat,
          updatedAt: new Date().toISOString(),
        };
      }
    });
    return groups;
  }, [dates, dailySummary, meals]);

  const currentMonth = selectedDate ? formatMonthYear(selectedDate) : '';

  const dateMeals = selectedDate ? groupedByDate[selectedDate]?.meals || [] : [];

  const deleteMeal = useCallback((mealId: string) => {
    const updatedMeals = meals.filter(m => m.id !== mealId);
    setMeals(updatedMeals);
  }, [meals, setMeals]);

  const repeatMeal = useCallback((mealAnalysis: MealAnalysis) => {
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      type: mealAnalysis.meal.type,
      foods: mealAnalysis.meal.foods.map(f => ({ ...f, id: `food-${Date.now()}-${f.id}` })),
      timestamp: new Date().toISOString(),
    };
    setMeals([...meals, newMeal]);
    setCurrentScreen('hoy');
  }, [meals, setMeals, setCurrentScreen]);

  const toggleFavorite = useCallback((mealAnalysis: MealAnalysis) => {
    const existing = favoriteMeals.find(fm => fm.meal.id === mealAnalysis.meal.id);
    if (existing) {
      setFavoriteMeals(favoriteMeals.filter(fm => fm.meal.id !== mealAnalysis.meal.id));
    } else {
      setFavoriteMeals([...favoriteMeals, {
        id: `fav-${Date.now()}`,
        meal: mealAnalysis.meal,
        mealAnalysis,
        savedAt: new Date().toISOString(),
        name: mealAnalysis.meal.foods.map(f => f.name).slice(0, 3).join(', '),
      }]);
    }
  }, [favoriteMeals, setFavoriteMeals]);

  return (
    <div className="screen historial-screen">
      <div className="screen-header">
        <h1 className="screen-title">Historial</h1>
      </div>

      {/* Date Selector */}
      <div className="historial-date-selector">
        <button className="historial-date-btn" onClick={() => setEditingDate(!editingDate)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{selectedDate ? formatDateDisplay(selectedDate) : 'Seleccionar fecha'}</span>
        </button>
        {editingDate && (
          <div className="historial-date-picker">
            <input
              className="historial-date-input"
              type="date"
              value={selectedDate || ''}
              onChange={e => {
                setSelectedDate(e.target.value);
                setHistoryDate(e.target.value);
                setEditingDate(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Current Month Label */}
      {currentMonth && (
        <div className="historial-month-label">
          <span>{currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}</span>
        </div>
      )}

      {/* Day Summary */}
      {dateMeals.length > 0 && selectedDate && (
        <div className="historial-day-summary">
          <div className="historial-day-summary-kcal">
            <span className="historial-day-summary-value">{Math.round(groupedByDate[selectedDate]?.totalKcal || 0)}</span>
            <span className="historial-day-summary-label">kcal totales</span>
          </div>
          <div className="historial-day-summary-macros">
            <span>P: {Math.round(groupedByDate[selectedDate]?.totalProtein || 0)}g</span>
            <span>C: {Math.round(groupedByDate[selectedDate]?.totalCarbs || 0)}g</span>
            <span>G: {Math.round(groupedByDate[selectedDate]?.totalFat || 0)}g</span>
          </div>
        </div>
      )}

      {/* Meals List */}
      <div className="historial-meals-list">
        {dateMeals.length === 0 ? (
          <div className="historial-empty">
            <div className="historial-empty-icon">📅</div>
            <p>No hay comidas registradas</p>
          </div>
        ) : (
          dateMeals.map((ma, i) => (
            <MealSummary
              key={ma.meal.id || i}
              meal={ma}
              onDelete={() => deleteMeal(ma.meal.id)}
              onRepeat={() => repeatMeal(ma)}
            />
          ))
        )}
      </div>

      {/* Favorites */}
      {favoriteMeals.length > 0 && (
        <div className="historial-favorites">
          <h2 className="historial-section-title">Favoritos</h2>
          <div className="historial-favorites-list">
            {favoriteMeals.map(fm => (
              <div key={fm.id} className="historial-favorite-item">
                <div className="historial-favorite-info">
                  <span className="historial-favorite-name">{fm.name}</span>
                  <span className="historial-favorite-kcal">{Math.round(fm.mealAnalysis.totalKcal)} kcal</span>
                </div>
                <div className="historial-favorite-actions">
                  <button className="historial-favorite-action-btn" onClick={() => repeatMeal(fm.mealAnalysis)} aria-label="Repetir">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </button>
                  <button className="historial-favorite-action-btn historial-favorite-action-delete" onClick={() => toggleFavorite(fm)} aria-label="Quitar favorito">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
