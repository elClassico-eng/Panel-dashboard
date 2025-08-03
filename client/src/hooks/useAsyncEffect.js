import { useEffect, useRef } from 'react';

export const useAsyncEffect = (asyncFn, deps) => {
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        
        const runAsyncFn = async () => {
            try {
                await asyncFn();
            } catch (error) {
                if (mountedRef.current) {
                    console.error('Async effect error:', error);
                }
            }
        };

        runAsyncFn();

        return () => {
            mountedRef.current = false;
        };
    }, deps);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return mountedRef;
};