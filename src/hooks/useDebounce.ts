import { useState, useEffect } from 'react';

/**
 * Hook that delays updating a value.
 * @param value The value to debounce.
 * @param delay The delay time in milliseconds.
 * @returns The value after the delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
