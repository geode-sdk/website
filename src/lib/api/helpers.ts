/**
 * Parses the string as an integer, or undefined if it's not a integer
 */
export function toIntSafe(value: string | null) {
    if (!value) {
        return undefined;
    }

    const as_int = parseInt(value);
    if (!as_int) {
        return undefined;
    }

    return as_int;
}

export function clamp(number: number, min: number, max: number): number {
    return Math.min(Math.max(number, min), max);
}

export function undefIfEmpty<T>(value: T[]) {
    if (value.length > 0) {
        return value;
    }

    return undefined;
}

export function onlyIfTrue(value: string | null) {
    if (value == "true") {
        return true;
    }

    return undefined;
}
