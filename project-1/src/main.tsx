// Imports for React and DOM rendering
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global styling for the application
import './index.css'

// Root App component
import App from './App.tsx'

// Redux configuration for state management
import { Provider } from 'react-redux'
import { store } from './app/store'

// Entry point of the application
// We render the App component within the Redux Provider and React StrictMode
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)