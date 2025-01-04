import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <Auth0Provider
        domain="dev-t8l4ytdjin243z18.us.auth0.com"
        clientId="5dqaDj3fE6qCgEh2RuK6NUP2f5JhMIO5"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </ConvexProvider>
  </StrictMode>
);
