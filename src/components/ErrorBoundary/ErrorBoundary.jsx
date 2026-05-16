import { Component } from 'react';
import { Link } from 'react-router-dom';
import i18n from '../../i18n';
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
          <h2 className="error-title">{i18n.t('common.error')}</h2>
          <p className="error-message">
            {this.state.error?.message || i18n.t('common.unknown_error')}
          </p>
          <div className="error-actions">
            <button
              className="error-btn"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              {i18n.t('common.try_again')}
            </button>
            <Link to="/" className="error-btn error-btn-secondary">
              {i18n.t('common.go_home')}
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
