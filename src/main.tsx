import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'; 

import App from './App.tsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

createRoot(document.getElementById("root")!).render(<App />);
