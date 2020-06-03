/* eslint-disable @typescript-eslint/ban-types */
/**
 * Represents some Type of the Object.
 */
export type ObjectType<T> = { new (): T } | Function;
