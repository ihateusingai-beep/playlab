import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { LanguageProvider } from './contexts/LanguageContext';
import { GameProvider } from './contexts/GameContext';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <LanguageProvider>
      <GameProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GameProvider>
    </LanguageProvider>
  </StrictMode>,
);
