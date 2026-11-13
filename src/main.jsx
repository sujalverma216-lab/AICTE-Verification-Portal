import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { PortalProvider } from './context/PortalContext.jsx';
import './styles/theme.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <PortalProvider>
        <App />
      </PortalProvider>
    </HashRouter>
  </React.StrictMode>
);
