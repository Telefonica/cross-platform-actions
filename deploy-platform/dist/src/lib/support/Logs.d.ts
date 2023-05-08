export declare function hideObjectKeys<Type extends Record<string, unknown>>(object: Type, keysToHide: (keyof Type)[]): Type;
export declare function logObject<Type extends Record<string, unknown>>(object: Type, keysToHide: (keyof Type)[]): string;
