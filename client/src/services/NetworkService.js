class NetworkService {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = new Set();
        this.checkInterval = null;
        this.setupListeners();
        this.startPeriodicCheck();
    }

    setupListeners() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    startPeriodicCheck() {
        this.checkInterval = setInterval(() => {
            this.checkConnection();
        }, 5000);
    }

    async checkConnection() {
        const wasOnline = this.isOnline;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(window.location.origin + '/api/health', {
                method: 'HEAD',
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            this.isOnline = response.ok || response.status < 500;
        } catch (error) {
            this.isOnline = false;
            console.log('[NetworkService] Connection check failed:', error.message);
        }

        if (wasOnline !== this.isOnline) {
            console.log(`[NetworkService] Status changed: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
            this.notifyListeners(this.isOnline);
        }
    }

    handleOnline = () => {
        const wasOnline = this.isOnline;
        this.isOnline = true;
        if (!wasOnline) {
            this.notifyListeners(true);
        }
    };

    handleOffline = () => {
        const wasOnline = this.isOnline;
        this.isOnline = false;
        if (wasOnline) {
            this.notifyListeners(false);
        }
    };

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(status) {
        this.listeners.forEach(callback => callback(status));
    }

    getStatus() {
        return this.isOnline;
    }

    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        this.listeners.clear();
    }
}

export const networkService = new NetworkService();

export default NetworkService;
