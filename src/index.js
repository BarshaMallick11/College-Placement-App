import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { placementStore } from './store/PlacementStore';
import './App.css';

// Create a context
const StoreContext = createContext(placementStore);

// Create a hook to use the store
export const useStore = () => useContext(StoreContext);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provide the store to the entire app */}
    <StoreContext.Provider value={placementStore}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);
