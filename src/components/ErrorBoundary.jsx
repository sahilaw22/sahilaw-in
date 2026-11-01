import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ffffff' }}>
          <p style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '1rem' }}>
            Something went wrong while rendering this section.
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('portfolio_content_cache_v9');
                localStorage.removeItem('portfolio_content_cache_v10');
                localStorage.removeItem('portfolio_content_cache_v11');
              } catch (_) {}
              this.setState({ hasError: false, error: null });
            }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Retry Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

