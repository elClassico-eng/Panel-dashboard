import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/database';
import { syncService } from '@/services/SyncService';
import { networkService } from '@/services/NetworkService';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const SyncStatusBadge = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);

    const pendingCount = useLiveQuery(async () => {
        const stats = await db.getUnsyncedStats();
        return stats.queueLength;
    }, []);

    useEffect(() => {
        const unsubscribe = syncService.subscribe((event) => {
            if (event.type === 'SYNC_START') {
                setIsSyncing(true);
            } else if (event.type === 'SYNC_COMPLETE') {
                setIsSyncing(false);
                setLastSyncTime(new Date());
                toast.success('Синхронизация завершена');
            } else if (event.type === 'SYNC_ERROR') {
                setIsSyncing(false);
                toast.error('Ошибка синхронизации');
            }
        });

        db.getLastSyncTime().then(setLastSyncTime);

        return () => unsubscribe();
    }, []);

    const handleManualSync = async () => {
        if (!networkService.getStatus()) {
            toast.error('Нет подключения к интернету');
            return;
        }

        try {
            await syncService.forceSyncNow();
        } catch (error) {
            console.error('Manual sync error:', error);
        }
    };

    if (!pendingCount && !isSyncing) {
        return (
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Синхронизировано</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {isSyncing ? (
                <div className="flex items-center gap-2 text-blue-600">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm font-medium">Синхронизация...</span>
                </div>
            ) : pendingCount > 0 ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-orange-600">
                        <Clock size={18} />
                        <span className="text-sm font-medium">
                            {pendingCount} изм.
                        </span>
                    </div>
                    <button
                        onClick={handleManualSync}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Синхронизировать сейчас"
                    >
                        Синхронизировать
                    </button>
                </div>
            ) : null}

            {lastSyncTime && !isSyncing && (
                <span className="text-xs text-gray-500">
                    {new Date(lastSyncTime).toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};
