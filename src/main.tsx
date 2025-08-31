
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeData } from './utils/dataSeed.ts'

// Banner de inicialização SISMED v4.0
console.log(`
╔═══════════════════════════════════════╗
║        SISMED PEROBAL v4.0            ║
║   Sistema de Saúde Municipal          ║
║     Inicializando aplicação...        ║
╚═══════════════════════════════════════╝
`);

// Initialize seed data for SISMED v4.0
initializeData();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
