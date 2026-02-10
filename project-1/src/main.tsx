// Imports for React and DOM rendering
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global styling for the application
import './index.css'

// Sentry for error tracking
import * as Sentry from "@sentry/react";

// Root App component
import App from './App.tsx'

// Redux configuration for state management
import { Provider } from 'react-redux'
import { store } from './app/store'

// Initialize Sentry for centralized error handling
Sentry.init({
  dsn: "https://79779bd681cec58216671f7e8c94951d@o4510826507993088.ingest.us.sentry.io/4510826512121856",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  /**
   * beforeSend: Global filter to prevent expected errors from hitting Sentry.
   * We filter out 404 "Not Found" errors which are common/expected during search.
   */
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error && error instanceof Error) {
      // Filter out common API 404/Not Found messages
      if (error.message.includes('404') || error.message.toLowerCase().includes('not found')) {
        return null;
      }
    }
    return event;
  },
});

// Entry point of the application
// We render the App component within the Redux Provider and React StrictMode
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <App />
      </Sentry.ErrorBoundary>
    </Provider>
  </StrictMode>,
)