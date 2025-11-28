import { useState, useEffect } from 'react';
import { networkService } from '@/services/NetworkService';
import { Wifi, WifiOff } from 'lucide-react';

export const NetworkStatusIndicator = () => {
    const [isOnline, setIsOnline] = useState(networkService.getStatus());

    useEffect(() => {
        const unsubscribe = networkService.subscribe((status) => {
            setIsOnline(status);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex items-center gap-2">
            {isOnline ? (
                <div className="flex items-center gap-2 text-green-600">
                    <Wifi size={18} />
                    <span className="text-sm font-medium">Online</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-orange-600">
                    <WifiOff size={18} />
                    <span className="text-sm font-medium">Offline</span>
                </div>
            )}
        </div>
    );
};
