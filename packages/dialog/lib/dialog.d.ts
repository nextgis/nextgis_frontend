import { DialogAdapter, DialogAdapterOptions } from '@nextgis/webmap';
import 'dialog-polyfill/dialog-polyfill.css';
import './dialog.css';
export { DialogAdapterOptions };
export declare class Dialog implements DialogAdapter {
    static dialogs: Dialog[];
    options: DialogAdapterOptions;
    private _dialog;
    private _isNativeDialog;
    private _closeBtn;
    private _content;
    private _parent;
    constructor(options?: DialogAdapterOptions);
    show(): void;
    close(): void;
    updateContent(content?: string | Node): void;
    private _addCloseBtn;
    private _addContent;
    private _addEventsListeners;
}
