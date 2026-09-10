// ============================================================
// FiTWM - Screen Component
// ============================================================

import { useAppContext } from '@ui/context/AppContext';

export function Screen() {
  const { currentScreen, setCurrentScreen } = useAppContext();

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <button onClick={() => setCurrentScreen('hoy')}>Hoy</button>
        <button onClick={() => setCurrentScreen('camara')}>Cámara</button>
        <button onClick={() => setCurrentScreen('historial')}>Historial</button>
        <button onClick={() => setCurrentScreen('perfil')}>Perfil</button>
      </nav>
      <main>
        {currentScreen === 'hoy' && <div>Resumen de Hoy</div>}
        {currentScreen === 'camara' && <div>Cámara</div>}
        {currentScreen === 'historial' && <div>Historial</div>}
        {currentScreen === 'perfil' && <div>Perfil</div>}
      </main>
    </div>
  );
}
