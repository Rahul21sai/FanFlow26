import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#bec9c1]/30 max-w-md w-full">
            <span className="material-symbols-outlined text-5xl text-[#ba1a1a] mb-4">error</span>
            <h1 className="text-xl font-bold text-[#1c1b1b] mb-2">Something went wrong</h1>
            <p className="text-[#414942] mb-6 text-sm">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#00543b] text-white font-medium rounded-xl hover:bg-[#00422e] transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
