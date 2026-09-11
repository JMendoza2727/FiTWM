// ============================================================
// FiTWM - Result Screen (Analysis Result)
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { useMemo, useState, useCallback } from 'react';
import { FoodItem, MealType } from '@domain/types';

const MEAL_TYPE_OPTIONS: { key: MealType; label: string; icon: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '☀️' },
  { key: 'comida', label: 'Comida', icon: '🌤️' },
  { key: 'cena', label: 'Cena', icon: '🌙' },
  { key: 'snack', label: 'Snack', icon: '🍎' },
];

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  let color = 'var(--color-success)';
  if (pct < 60) color = 'var(--color-warning)';
  if (pct < 40) color = 'var(--color-error)';

  return (
    <span className="confidence-badge" style={{ backgroundColor: color }}>
      {pct}%
    </span>
  );
}

export function ResultadoScreen() {
  const {
    analysisResult,
    setAnalysisResult,
    meals,
    setMeals,
    dailySummary,
    setDailySummary,
    setCurrentScreen,
  } = useAppContext();

  const [selectedMealType, setSelectedMealType] = useState<MealType>('comida');
  const [editingFood, setEditingFood] = useState<string | null>(null);
  const [editGrams, setEditGrams] = useState('');
  const [editKcal, setEditKcal] = useState('');
  const [editProtein, setEditProtein] = useState('');
  const [editCarbs, setEditCarbs] = useState('');
  const [editFat, setEditFat] = useState('');

  if (!analysisResult) {
    return (
      <div className="screen resultado-screen">
        <div className="resultado-empty">
          <div className="resultado-empty-icon">📷</div>
          <h2>Sin resultados</h2>
          <p>Analiza una foto de tu comida para ver los resultados</p>
          <button className="btn btn-primary" onClick={() => setCurrentScreen('camara')}>
            Abrir cámara
          </button>
        </div>
      </div>
    );
  }

  const { foods } = analysisResult;

  const updatedFoods = useMemo(() => {
    return foods.map(f => {
      if (editingFood === f.id) {
        return {
          ...f,
          grams: parseFloat(editGrams) || f.grams,
          kcal: parseFloat(editKcal) || f.kcal,
          protein: parseFloat(editProtein) || f.protein,
          carbs: parseFloat(editCarbs) || f.carbs,
          fat: parseFloat(editFat) || f.fat,
        };
      }
      return f;
    });
  }, [foods, editingFood, editGrams, editKcal, editProtein, editCarbs, editFat]);

  const newTotals = useMemo(() => ({
    totalKcal: updatedFoods.reduce((s, f) => s + f.kcal, 0),
    totalProtein: updatedFoods.reduce((s, f) => s + f.protein, 0),
    totalCarbs: updatedFoods.reduce((s, f) => s + f.carbs, 0),
    totalFat: updatedFoods.reduce((s, f) => s + f.fat, 0),
  }), [updatedFoods]);

  const startEdit = useCallback((food: FoodItem) => {
    setEditingFood(food.id);
    setEditGrams(String(food.grams));
    setEditKcal(String(food.kcal));
    setEditProtein(String(food.protein));
    setEditCarbs(String(food.carbs));
    setEditFat(String(food.fat));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingFood(null);
  }, []);

  const saveEdit = useCallback((foodId: string) => {
    const updated = analysisResult.foods.map(f => {
      if (f.id === foodId) {
        return {
          ...f,
          grams: parseFloat(editGrams) || f.grams,
          kcal: parseFloat(editKcal) || f.kcal,
          protein: parseFloat(editProtein) || f.protein,
          carbs: parseFloat(editCarbs) || f.carbs,
          fat: parseFloat(editFat) || f.fat,
        };
      }
      return f;
    });
    setAnalysisResult({ ...analysisResult, foods: updated });
    setEditingFood(null);
  }, [analysisResult, editGrams, editKcal, editProtein, editCarbs, editFat, setAnalysisResult]);

  const deleteFood = useCallback((foodId: string) => {
    const updated = analysisResult.foods.filter(f => f.id !== foodId);
    setAnalysisResult({ ...analysisResult, foods: updated });
  }, [analysisResult, setAnalysisResult]);

  const saveMeal = useCallback(() => {
    const updatedFoods = analysisResult.foods.map(f => ({
      ...f,
      grams: parseFloat(editGrams) || f.grams,
      kcal: parseFloat(editKcal) || f.kcal,
      protein: parseFloat(editProtein) || f.protein,
      carbs: parseFloat(editCarbs) || f.carbs,
      fat: parseFloat(editFat) || f.fat,
    }));

    const meal = {
      id: `meal-${Date.now()}`,
      type: selectedMealType,
      foods: updatedFoods,
      timestamp: new Date().toISOString(),
    };

    setMeals([...meals, meal]);

    // Update daily summary
    const today = new Date().toISOString().split('T')[0];
    const existingSummary = dailySummary;
    const newSummary = {
      date: today,
      meals: [...(existingSummary?.meals || []), {
        meal,
        totalKcal: updatedFoods.reduce((s, f) => s + f.kcal, 0),
        totalProtein: updatedFoods.reduce((s, f) => s + f.protein, 0),
        totalCarbs: updatedFoods.reduce((s, f) => s + f.carbs, 0),
        totalFat: updatedFoods.reduce((s, f) => s + f.fat, 0),
        analyzedAt: new Date().toISOString(),
      }],
      totalKcal: (existingSummary?.totalKcal || 0) + updatedFoods.reduce((s, f) => s + f.kcal, 0),
      totalProtein: (existingSummary?.totalProtein || 0) + updatedFoods.reduce((s, f) => s + f.protein, 0),
      totalCarbs: (existingSummary?.totalCarbs || 0) + updatedFoods.reduce((s, f) => s + f.carbs, 0),
      totalFat: (existingSummary?.totalFat || 0) + updatedFoods.reduce((s, f) => s + f.fat, 0),
      updatedAt: new Date().toISOString(),
    };
    setDailySummary(newSummary);

    setAnalysisResult(null);
    setCurrentScreen('hoy');
  }, [analysisResult, selectedMealType, meals, setMeals, dailySummary, setDailySummary, setAnalysisResult, setCurrentScreen, editGrams, editKcal, editProtein, editCarbs, editFat]);

  const avgConfidence = foods.length > 0 ? foods.reduce((s, f) => s + f.confidence, 0) / foods.length : 0;

  return (
    <div className="screen resultado-screen">
      <div className="resultado-header">
        <button className="resultado-back" onClick={() => setCurrentScreen('camara')} aria-label="Volver">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="screen-title">Resultado</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Confidence */}
      <div className="resultado-confidence">
        <span className="resultado-confidence-label">Confianza de detección</span>
        <ConfidenceBadge confidence={avgConfidence} />
      </div>

      {/* Totals */}
      <div className="resultado-totals">
        <div className="resultado-total-item">
          <span className="resultado-total-value">{Math.round(newTotals.totalKcal)}</span>
          <span className="resultado-total-label">kcal</span>
        </div>
        <div className="resultado-total-item">
          <span className="resultado-total-value resultado-total-protein">{Math.round(newTotals.totalProtein)}g</span>
          <span className="resultado-total-label">Proteína</span>
        </div>
        <div className="resultado-total-item">
          <span className="resultado-total-value resultado-total-carbs">{Math.round(newTotals.totalCarbs)}g</span>
          <span className="resultado-total-label">Carbos</span>
        </div>
        <div className="resultado-total-item">
          <span className="resultado-total-value resultado-total-fat">{Math.round(newTotals.totalFat)}g</span>
          <span className="resultado-total-label">Grasa</span>
        </div>
      </div>

      {/* Meal Type Selector */}
      <div className="resultado-meal-type">
        <span className="resultado-meal-type-label">Tipo de comida:</span>
        <div className="resultado-meal-type-options">
          {MEAL_TYPE_OPTIONS.map(mt => (
            <button
              key={mt.key}
              className={`resultado-meal-type-btn ${selectedMealType === mt.key ? 'resultado-meal-type-btn-active' : ''}`}
              onClick={() => setSelectedMealType(mt.key)}
            >
              <span>{mt.icon}</span>
              <span>{mt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Foods List */}
      <div className="resultado-foods">
        <h2 className="resultado-section-title">Alimentos detectados</h2>
        {foods.length === 0 ? (
          <div className="resultado-empty-foods">No se detectaron alimentos</div>
        ) : (
          foods.map((f, i) => (
            <div key={f.id || i} className="resultado-food-item">
              {editingFood === f.id ? (
                <div className="resultado-food-edit">
                  <div className="form-group">
                    <label className="form-label">Gramos</label>
                    <input className="form-input form-input-sm" type="number" value={editGrams} onChange={e => setEditGrams(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">kcal</label>
                    <input className="form-input form-input-sm" type="number" value={editKcal} onChange={e => setEditKcal(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Prot (g)</label>
                      <input className="form-input form-input-sm" type="number" value={editProtein} onChange={e => setEditProtein(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Carb (g)</label>
                      <input className="form-input form-input-sm" type="number" value={editCarbs} onChange={e => setEditCarbs(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grasa (g)</label>
                    <input className="form-input form-input-sm" type="number" value={editFat} onChange={e => setEditFat(e.target.value)} />
                  </div>
                  <div className="resultado-food-edit-actions">
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancelar</button>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(f.id)}>Guardar</button>
                  </div>
                </div>
              ) : (
                <div className="resultado-food-info">
                  <div className="resultado-food-name-row">
                    <span className="resultado-food-name">{f.name}</span>
                    <ConfidenceBadge confidence={f.confidence} />
                  </div>
                  <div className="resultado-food-macros">
                    <span className="resultado-food-grams">{f.grams}g</span>
                    <span className="resultado-food-kcal">{f.kcal} kcal</span>
                    <span className="resultado-food-macro resultado-food-protein">P: {f.protein}g</span>
                    <span className="resultado-food-macro resultado-food-carbs">C: {f.carbs}g</span>
                    <span className="resultado-food-macro resultado-food-fat">G: {f.fat}g</span>
                  </div>
                  <div className="resultado-food-actions">
                    <button className="resultado-food-edit-btn" onClick={() => startEdit(f)} aria-label="Editar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="resultado-food-delete-btn" onClick={() => deleteFood(f.id)} aria-label="Eliminar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      <div className="resultado-save-section">
        <button className="btn btn-primary btn-large" onClick={saveMeal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Guardar comida
        </button>
      </div>
    </div>
  );
}
