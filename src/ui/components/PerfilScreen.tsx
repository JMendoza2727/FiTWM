// ============================================================
// FiTWM - Perfil Screen
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { useState, useCallback } from 'react';
import { UserProfile } from '@domain/types';

export function PerfilScreen() {
  const { profile, setProfile, goals, setGoals, theme, setTheme, metric, setMetric } = useAppContext();
  const [name, setName] = useState(profile?.name || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [kcal, setKcal] = useState(goals.kcal.toString());
  const [protein, setProtein] = useState(goals.protein.toString());
  const [carbs, setCarbs] = useState(goals.carbs.toString());
  const [fat, setFat] = useState(goals.fat.toString());

  const handleSaveProfile = useCallback(() => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      name,
      weight: weight ? parseFloat(weight) : null,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
  }, [profile, name, weight, setProfile]);

  const handleSaveGoals = useCallback(() => {
    setGoals({
      kcal: parseFloat(kcal) || goals.kcal,
      protein: parseFloat(protein) || goals.protein,
      carbs: parseFloat(carbs) || goals.carbs,
      fat: parseFloat(fat) || goals.fat,
    });
  }, [kcal, protein, carbs, fat, goals, setGoals]);

  return (
    <div className="screen perfil-screen">
      <div className="screen-header">
        <h1 className="screen-title">Perfil</h1>
      </div>

      <div className="perfil-section">
        <h2 className="perfil-section-title">Datos personales</h2>
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Peso (kg)</label>
          <input
            className="form-input"
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="Tu peso"
          />
        </div>
        <button className="btn btn-primary" onClick={handleSaveProfile}>
          Guardar perfil
        </button>
      </div>

      <div className="perfil-section">
        <h2 className="perfil-section-title">Objetivos nutricionales</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Kcal</label>
            <input
              className="form-input"
              type="number"
              value={kcal}
              onChange={e => setKcal(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Proteína (g)</label>
            <input
              className="form-input"
              type="number"
              value={protein}
              onChange={e => setProtein(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Carbos (g)</label>
            <input
              className="form-input"
              type="number"
              value={carbs}
              onChange={e => setCarbs(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Grasa (g)</label>
            <input
              className="form-input"
              type="number"
              value={fat}
              onChange={e => setFat(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSaveGoals}>
          Guardar objetivos
        </button>
      </div>

      <div className="perfil-section">
        <h2 className="perfil-section-title">Apariencia</h2>
        <div className="form-group">
          <label className="form-label">Tema</label>
          <select
            className="form-input"
            value={theme}
            onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          >
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Unidades</label>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${metric ? 'toggle-btn-active' : ''}`}
              onClick={() => setMetric(true)}
            >
              Métricas
            </button>
            <button
              className={`toggle-btn ${!metric ? 'toggle-btn-active' : ''}`}
              onClick={() => setMetric(false)}
            >
              Imperiales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
