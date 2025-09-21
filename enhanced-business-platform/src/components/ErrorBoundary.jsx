import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Optionally: send to analytics/logging endpoint
    // fetch('/_client_error', { method: 'POST', body: JSON.stringify({ error: String(error), stack: info?.componentStack }) })
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, info: null });
    // simple recovery: reload page
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-2">حدث خطأ داخل واجهة المستخدم</h2>
          <p className="text-sm text-red-700 mb-4">الرجاء إعادة التحميل أو مشاركة مخرجات الـ Console معنا للمساعدة في التشخيص.</p>
          <details className="text-xs text-red-600 mb-4 whitespace-pre-wrap max-h-48 overflow-auto">
            {String(this.state.error)}
            {this.state.info?.componentStack ? `\n\n${this.state.info.componentStack}` : ''}
          </details>
          <div>
            <button onClick={this.handleReload} className="px-4 py-2 bg-red-600 text-white rounded-md">إعادة التحميل</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
