import React, { StrictMode, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Hoop Master caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center mb-4 text-[#FF6B00] text-2xl font-black">
            HM
          </div>
          <h1 className="text-xl font-bold mb-2">Hoop Master Training</h1>
          <p className="text-sm text-neutral-400 max-w-sm mb-6">
            An unexpected error occurred while loading the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-[#FF6B00] text-black font-bold text-sm hover:bg-orange-500 transition-colors"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
