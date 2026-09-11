// ============================================================
// FiTWM - Screen Component
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { HoyScreen } from './HoyScreen';
import { CamaraScreen } from './CamaraScreen';
import { ResultadoScreen } from './ResultadoScreen';
import { HistorialScreen } from './HistorialScreen';
import { PerfilScreen } from './PerfilScreen';

export function Screen() {
  const { currentScreen, setCurrentScreen } = useAppContext();

  const tabs = [
    { id: 'hoy' as const, label: 'Hoy', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )},
    { id: 'camara' as const, label: 'Cámara', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
      </svg>
    )},
    { id: 'historial' as const, label: 'Historial', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    )},
    { id: 'perfil' as const, label: 'Perfil', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    )},
  ];

  return (
    <div className="app-shell">
      <main className="app-content">
        {currentScreen === 'hoy' && <HoyScreen />}
        {currentScreen === 'camara' && <CamaraScreen />}
        {currentScreen === 'resultado' && <ResultadoScreen />}
        {currentScreen === 'historial' && <HistorialScreen />}
        {currentScreen === 'perfil' && <PerfilScreen />}
      </main>
      <nav className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${currentScreen === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentScreen(tab.id)}
            aria-label={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
