import { Component } from 'react';
import { Link } from 'react-router-dom';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Щось пішло не так</h2>
          <p className="error-message">
            {this.state.error?.message || 'Невідома помилка'}
          </p>
          <div className="error-actions">
            <button
              className="error-btn"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Спробувати знову
            </button>
            <Link to="/" className="error-btn error-btn-secondary">
              На головну
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
