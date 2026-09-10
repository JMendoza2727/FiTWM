// ============================================================
// FiTWM - Main App Component
// ============================================================

import { AppProvider } from './context/AppProvider';
import { Screen } from './components/Screen';

export default function App() {
  return (
    <AppProvider>
      <Screen />
    </AppProvider>
  );
}
