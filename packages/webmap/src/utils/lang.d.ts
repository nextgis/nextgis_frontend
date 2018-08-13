export declare function isString(it: any): boolean;
/**
 * Return true if it is a Function
 * @param it Item to test.
 */
export declare function isFunction(it: any): boolean;
export declare function getProp(parts: any[], create: boolean, context: object): object;
export declare function setObject(name: string, value: any, context: object): any;
export declare function hitch(scope: any, method: any): any;
export declare function deepmerge(target: any, src: any, mergeArray?: boolean): any;
export declare function fixUrlStr(url: string): string;
