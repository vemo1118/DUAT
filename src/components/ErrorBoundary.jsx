import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Captured React Exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone border border-gold/40 flex items-center justify-center text-gold">
            <AlertCircle size={24} />
          </div>
          <h2 className="font-clash text-xl uppercase text-bone">
            عذراً، حدث خطأ مؤقت في تحميل هذه الصفحة
          </h2>
          <p className="font-space text-xs text-ash max-w-md leading-relaxed">
            تم تسجيل الخطأ تلقائياً. يُرجى محاولة إعادة تحديث الصفحة أو العودة للصفحة الرئيسية.
          </p>
          <button
            onClick={this.handleReload}
            className="btn-primary py-2.5 px-6 text-xs font-mono flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>إعادة تحديث الصفحة</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
