import { BaseProperty, IEntryBasePropertyOptions } from './BaseProperty';
import { Entry } from '../Entry';
interface ICheckOptions extends IEntryBasePropertyOptions<boolean> {
    label?: string;
    turnOff?: () => void;
    turnOn?: () => void;
}
export declare class CheckProperty<V = boolean, O = ICheckOptions> extends BaseProperty<boolean, ICheckOptions> {
    static options: ICheckOptions;
    constructor(name: any, entry: any, options: any);
    update(value: boolean, options: ICheckOptions): void;
    getHierarchyValue(): boolean;
    _prepareValue(value: boolean): boolean;
    _turnOff(options: ICheckOptions): void;
    _turnOn(options: ICheckOptions): void;
    block(options: ICheckOptions): void;
    _block(options: ICheckOptions): void;
    unBlock(options: ICheckOptions): void;
    _unBlock(options: ICheckOptions): void;
    blockChilds(options: ICheckOptions): void;
    unblockChilds(options: ICheckOptions): void;
    _blockChild(options: ICheckOptions, entry: Entry): void;
    _unBlockChild(options: ICheckOptions, entry: Entry): void;
    _propagation(value: boolean, options: ICheckOptions): void;
}
export {};
