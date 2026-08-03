import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0C16] text-[#EDE4D3] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#12162B] border border-[#E8A33D]/40 p-8 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#E8A33D]/10 border border-[#E8A33D] flex items-center justify-center mx-auto text-[#E8A33D] font-mono text-2xl font-bold">
              DUAT
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-[#EDE4D3]">تحديث المتصفح والذاكرة المؤقتة</h1>
              <p className="text-xs text-[#8E98BF] leading-relaxed">
                تم كشف تحديث جديد للمشروع. انقر أدناه لتنشيط الصفحة والبدء فوراً.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 bg-[#E8A33D] text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-widest hover:bg-[#C97B22] transition-colors shadow-lg"
            >
              تحديث وتفريغ الـ CACHE الآن ↻
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>,
);
