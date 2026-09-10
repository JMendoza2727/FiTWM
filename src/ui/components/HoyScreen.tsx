// ============================================================
// FiTWM - Hoy Screen (Today)
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { useMemo, useState, useCallback } from 'react';
import { MealType, FoodItem } from '@domain/types';

const MEAL_TYPES: { key: MealType; label: string; icon: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '☀️' },
  { key: 'comida', label: 'Comida', icon: '🌤️' },
  { key: 'cena', label: 'Cena', icon: '🌙' },
  { key: 'snack', label: 'Snack', icon: '🍎' },
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function MacroBar({ value, goal, color, unit }: { value: number; goal: number; color: string; unit: string }) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  return (
    <div className="macro-bar">
      <div className="macro-bar-label">
        <span className="macro-bar-name">{unit}</span>
        <span className="macro-bar-value">
          {Math.round(value)} / {Math.round(goal)}{unit === 'kcal' ? '' : 'g'}
        </span>
      </div>
      <div className="macro-bar-track">
        <div className="macro-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function MealCard({ type, foods, onAddFood }: { type: MealType; foods: FoodItem[]; onAddFood: () => void }) {
  const info = MEAL_TYPES.find(m => m.key === type)!;
  const totalKcal = foods.reduce((s, f) => s + f.kcal, 0);

  return (
    <div className="meal-card">
      <div className="meal-card-header">
        <div className="meal-card-title">
          <span className="meal-card-icon">{info.icon}</span>
          <span className="meal-card-name">{info.label}</span>
        </div>
        <button className="meal-card-add" onClick={onAddFood} aria-label="Añadir comida">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      {foods.length === 0 ? (
        <div className="meal-card-empty">Sin alimentos añadidos</div>
      ) : (
        <div className="meal-card-body">
          {foods.map((f, i) => (
            <div key={f.id || i} className="meal-card-item">
              <span className="meal-card-item-name">{f.name}</span>
              <span className="meal-card-item-grams">{f.grams}g</span>
              <span className="meal-card-item-kcal">{f.kcal} kcal</span>
            </div>
          ))}
          <div className="meal-card-total">
            <span>Total</span>
            <span className="meal-card-total-kcal">{Math.round(totalKcal)} kcal</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CircularProgress({ kcal, goal }: { kcal: number; goal: number }) {
  const pct = goal > 0 ? Math.min(kcal / goal, 1) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="circular-progress">
      <svg viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="8" className="circular-progress-track" />
        <circle
          cx="64" cy="64" r={radius} fill="none" strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-progress-fill"
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="circular-progress-content">
        <span className="circular-progress-kcal">{Math.round(kcal)}</span>
        <span className="circular-progress-label">/ {Math.round(goal)} kcal</span>
      </div>
    </div>
  );
}

export function HoyScreen() {
  const { profile, goals, meals, setMeals, dailySummary, setDailySummary } = useAppContext();
  const [showAddMeal, setShowAddMeal] = useState<MealType | null>(null);
  const [showAddFood, setShowAddFood] = useState<MealType | null>(null);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodGrams, setNewFoodGrams] = useState('');
  const [newFoodKcal, setNewFoodKcal] = useState('');
  const [newFoodProtein, setNewFoodProtein] = useState('');
  const [newFoodCarbs, setNewFoodCarbs] = useState('');
  const [newFoodFat, setNewFoodFat] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const todayMeals = useMemo(() =>
    meals.filter(m => m.timestamp.startsWith(today)),
    [meals, today]
  );

  const todayAnalysis = useMemo(() => {
    let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    todayMeals.forEach(m => {
      m.foods.forEach(f => {
        totalKcal += f.kcal;
        totalProtein += f.protein;
        totalCarbs += f.carbs;
        totalFat += f.fat;
      });
    });
    return { totalKcal, totalProtein, totalCarbs, totalFat };
  }, [todayMeals]);

  const remainingKcal = goals.kcal - todayAnalysis.totalKcal;

  const addMeal = useCallback((type: MealType) => {
    const newMeal: import('@domain/types').Meal = {
      id: `meal-${Date.now()}`,
      type,
      foods: [],
      timestamp: new Date().toISOString(),
    };
    setMeals([...meals, newMeal]);
    setShowAddMeal(null);
  }, [meals, setMeals]);

  const addFoodToMeal = useCallback((mealType: MealType) => {
    if (!newFoodName.trim() || !newFoodGrams) return;
    const grams = parseFloat(newFoodGrams) || 0;
    const kcal = parseFloat(newFoodKcal) || 0;
    const protein = parseFloat(newFoodProtein) || 0;
    const carbs = parseFloat(newFoodCarbs) || 0;
    const fat = parseFloat(newFoodFat) || 0;

    const food: FoodItem = {
      id: `food-${Date.now()}`,
      name: newFoodName.trim(),
      grams,
      kcal,
      protein,
      carbs,
      fat,
      confidence: 1,
    };

    const updatedMeals = meals.map(m => {
      if (m.id === todayMeals.find(m => m.type === mealType)?.id) {
        return { ...m, foods: [...m.foods, food] };
      }
      return m;
    });

    // If meal doesn't exist, create it
    if (!todayMeals.find(m => m.type === mealType)) {
      updatedMeals.push({
        id: `meal-${Date.now()}`,
        type: mealType,
        foods: [food],
        timestamp: new Date().toISOString(),
      });
    }

    setMeals(updatedMeals);
    setShowAddFood(null);
    setNewFoodName('');
    setNewFoodGrams('');
    setNewFoodKcal('');
    setNewFoodProtein('');
    setNewFoodCarbs('');
    setNewFoodFat('');
  }, [meals, setMeals, todayMeals, newFoodName, newFoodGrams, newFoodKcal, newFoodProtein, newFoodCarbs, newFoodFat]);

  const deleteMeal = useCallback((mealId: string) => {
    setMeals(meals.filter(m => m.id !== mealId));
  }, [meals, setMeals]);

  const deleteFood = useCallback((mealId: string, foodId: string) => {
    setMeals(meals.map(m => {
      if (m.id === mealId) {
        return { ...m, foods: m.foods.filter(f => f.id !== foodId) };
      }
      return m;
    }));
  }, [meals, setMeals]);

  return (
    <div className="screen hoy-screen">
      {/* Header */}
      <div className="screen-header">
        <div className="screen-header-left">
          <h1 className="screen-title">Hoy</h1>
          {profile?.name && <span className="screen-subtitle">{profile.name}</span>}
        </div>
        <button className="screen-header-btn" aria-label="Añadir comida">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Circular Progress */}
      <div className="hoy-progress-section">
        <CircularProgress kcal={todayAnalysis.totalKcal} goal={goals.kcal} />
        <div className="hoy-progress-remaining">
          <span className="hoy-progress-remaining-label">Restantes</span>
          <span className={`hoy-progress-remaining-value ${remainingKcal < 0 ? 'hoy-progress-remaining-negative' : ''}`}>
            {Math.round(remainingKcal)} kcal
          </span>
        </div>
      </div>

      {/* Macros */}
      <div className="hoy-macros-section">
        <h2 className="hoy-section-title">Macros</h2>
        <div className="hoy-macros-grid">
          <MacroBar value={todayAnalysis.totalProtein} goal={goals.protein} color="var(--color-protein)" unit="Proteína" />
          <MacroBar value={todayAnalysis.totalCarbs} goal={goals.carbs} color="var(--color-carbs)" unit="Carbos" />
          <MacroBar value={todayAnalysis.totalFat} goal={goals.fat} color="var(--color-fat)" unit="Grasa" />
        </div>
      </div>

      {/* Meals */}
      <div className="hoy-meals-section">
        <h2 className="hoy-section-title">Comidas</h2>
        <div className="hoy-meals-list">
          {MEAL_TYPES.map(mt => {
            const meal = todayMeals.find(m => m.type === mt.key);
            return (
              <div key={mt.key} className="hoy-meal-card">
                <div className="hoy-meal-card-header">
                  <div className="hoy-meal-card-title">
                    <span className="hoy-meal-card-icon">{mt.icon}</span>
                    <span>{mt.label}</span>
                  </div>
                  <div className="hoy-meal-card-actions">
                    {meal && meal.foods.length > 0 && (
                      <button className="hoy-meal-card-delete" onClick={() => deleteMeal(meal.id)} aria-label="Eliminar comida">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                    <button className="hoy-meal-card-add" onClick={() => setShowAddFood(mt.key)} aria-label="Añadir alimento">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {meal && meal.foods.length > 0 ? (
                  <div className="hoy-meal-card-body">
                    {meal.foods.map(f => (
                      <div key={f.id} className="hoy-meal-item">
                        <div className="hoy-meal-item-info">
                          <span className="hoy-meal-item-name">{f.name}</span>
                          <span className="hoy-meal-item-grams">{f.grams}g</span>
                        </div>
                        <div className="hoy-meal-item-right">
                          <span className="hoy-meal-item-kcal">{f.kcal}</span>
                          <button className="hoy-meal-item-delete" onClick={() => deleteFood(meal.id, f.id)} aria-label="Eliminar alimento">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="hoy-meal-card-total">
                      <span>Total</span>
                      <span>{meal.foods.reduce((s, f) => s + f.kcal, 0)} kcal</span>
                    </div>
                  </div>
                ) : (
                  <div className="hoy-meal-card-empty">Sin alimentos</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="modal-overlay" onClick={() => setShowAddFood(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Añadir alimento</h2>
              <button className="modal-close" onClick={() => setShowAddFood(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} placeholder="Ej: Pechuga de pollo" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Gramos</label>
                  <input className="form-input" type="number" value={newFoodGrams} onChange={e => setNewFoodGrams(e.target.value)} placeholder="g" />
                </div>
                <div className="form-group">
                  <label className="form-label">kcal</label>
                  <input className="form-input" type="number" value={newFoodKcal} onChange={e => setNewFoodKcal(e.target.value)} placeholder="kcal" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Proteína (g)</label>
                  <input className="form-input" type="number" value={newFoodProtein} onChange={e => setNewFoodProtein(e.target.value)} placeholder="g" />
                </div>
                <div className="form-group">
                  <label className="form-label">Carbos (g)</label>
                  <input className="form-input" type="number" value={newFoodCarbs} onChange={e => setNewFoodCarbs(e.target.value)} placeholder="g" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Grasa (g)</label>
                <input className="form-input" type="number" value={newFoodFat} onChange={e => setNewFoodFat(e.target.value)} placeholder="g" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddFood(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => addFoodToMeal(showAddFood)}>Añadir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
