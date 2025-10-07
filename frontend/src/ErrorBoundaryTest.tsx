import React from "react";
import { useState, useEffect } from "react";

// Simple error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Dynamically import and render the SupplierDashboard
export default function ErrorBoundaryTest() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ErrorBoundaryTest component mounted");
    
    import("./pages/supplier/Dashboard")
      .then((module) => {
        console.log("SupplierDashboard module imported:", module);
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error importing SupplierDashboard:", err);
        setError(`Failed to import SupplierDashboard: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', color: 'red' }}>
        <h2>Error Loading Component</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (Component) {
    return (
      <div style={{ padding: '1rem' }}>
        <h1>Error Boundary Test</h1>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </div>
    );
  }

  return <div style={{ padding: '1rem' }}>No component to render</div>;
}