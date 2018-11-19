import { Entry } from './Entry';
export declare class TreeHelper {
    entry: Entry;
    private _parent?;
    private _children?;
    constructor(entry: Entry);
    setParent(parent: Entry): void;
    addChildren(children: Entry): void;
    getParent(): Entry;
    getParents(filterFunc?: (entry: Entry) => boolean): Entry[];
    getDescendants(filterFunc?: (entry: Entry) => boolean): any[];
    getChildren(): Entry[];
}
