import { KeyCodes } from './KeysCodes';
/**
 * @param {string} key - key symbol
 * @param {string} func - action on key press
 * @param {number} [keyCode] - key code for special button like tab
 *
 * @export
 * @interface IKeyControl
 */
export interface IKeyControl {
    key?: string;
    keyCode?: number;
    func: () => void;
}
export declare class Keys {
    keyCodeAlias: KeyCodes;
    keys: {
        [keyCode: number]: boolean;
    };
    private _windowOnFocus?;
    private _keysPressed?;
    private _keysReleased?;
    constructor();
    pressed(keyName: keyof KeyCodes): boolean;
    addKeyboardEventsListener(): void;
    removeKeyboardEventsListener(): void;
    private keysPressed;
    private keysReleased;
    private windowOnFocus;
}
