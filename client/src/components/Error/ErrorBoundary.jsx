import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to monitoring service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Что-то пошло не так
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Произошла непредвиденная ошибка. Попробуйте обновить страницу.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Обновить страницу
                            </button>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500">
                                        Детали ошибки (только для разработки)
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-600 overflow-auto">
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;