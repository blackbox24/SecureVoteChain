// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import './index.css';

// Use Mumbai testnet for development
const activeChain = "mumbai";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID || ""}
      activeChain={activeChain}
      supportedWallets={[metamaskWallet()]}
    >
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ThirdwebProvider>
  </StrictMode>,
);