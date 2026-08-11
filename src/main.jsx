import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Automatic auto-recovery for module script import errors / stale mobile cache
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const errorMsg = String(event?.message || event?.error || '');
    if (
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('error loading dynamically imported module')
    ) {
      const key = 'duat_auto_chunk_reload';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, 'true');
        window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
      }
    }
  });
}

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
    const errorMsg = String(error || '');
    if (
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Failed to fetch dynamically imported module')
    ) {
      const key = 'duat_auto_chunk_reload_boundary';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, 'true');
        window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
      }
    }
  }

  handleReset = () => {
    sessionStorage.clear();
    localStorage.removeItem('duat_hero_slides_v9');
    localStorage.removeItem('duat_hero_slides_v10');
    localStorage.removeItem('duat_hero_slides_v11');
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0C16] text-[#EDE4D3] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#12162B] border border-[#E8A33D]/40 p-8 space-y-6 shadow-2xl rounded-sm">
            <div className="w-16 h-16 rounded-full bg-[#E8A33D]/10 border border-[#E8A33D] flex items-center justify-center mx-auto text-[#E8A33D] font-mono text-2xl font-bold">
              DUAT
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-[#EDE4D3]">تحديث المتصفح والذاكرة المؤقتة</h1>
              <p className="text-xs text-[#8E98BF] leading-relaxed">
                تم نشر تحديث جديد للموقع. اضغط على الزر أدناه لتفريغ الـ Cache وتنشيط أحدث نسخة فوراً.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-[#0A0C16] border border-[#D9432E]/40 text-[#D9432E] font-mono text-[11px] text-right overflow-x-auto max-h-32 dir-ltr select-text rounded">
                  {this.state.error.toString()}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 bg-[#E8A33D] text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-widest hover:bg-[#C97B22] transition-colors shadow-lg rounded-sm"
              >
                تحديث وتفريغ الـ Cache الآن ↻
              </button>

              <button
                onClick={this.handleRetry}
                className="w-full py-2.5 bg-transparent border border-[#28305F] text-[#EDE4D3] hover:border-[#E8A33D] hover:text-[#E8A33D] font-mono text-xs uppercase transition-colors rounded-sm"
              >
                إعادة المحاولة ومتابعة التصفح 🚀
              </button>
            </div>
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
