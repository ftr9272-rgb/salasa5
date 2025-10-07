import React from "react";
import SupplierDashboard from "./pages/supplier/Dashboard";

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
        <div style={{ padding: "2rem", color: "red" }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.error && this.state.error.stack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundarySupplierTest() {
  console.log("ErrorBoundarySupplierTest component loaded");
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <ErrorBoundary>
        <SupplierDashboard />
      </ErrorBoundary>
    </div>
  );
}
