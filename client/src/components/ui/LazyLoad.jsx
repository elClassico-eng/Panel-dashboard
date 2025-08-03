import { Suspense } from 'react';
import { Loader } from '../Loader/Loader';

export const LazyLoad = ({ children, fallback = <Loader /> }) => {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );
};