// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import './index.css';

// You can deploy to multiple networks - Ethereum, Polygon, Arbitrum, etc.
// For development, we'll use the Mumbai testnet
const activeChain = "mumbai";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || ""}
      activeChain={activeChain}
    >
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ThirdwebProvider>
  </StrictMode>,
);