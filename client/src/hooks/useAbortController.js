import { useEffect, useRef } from 'react';

export const useAbortController = () => {
    const abortControllerRef = useRef(null);

    useEffect(() => {
        abortControllerRef.current = new AbortController();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const getSignal = () => abortControllerRef.current?.signal;

    const createNewController = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        return abortControllerRef.current;
    };

    return { getSignal, createNewController };
};