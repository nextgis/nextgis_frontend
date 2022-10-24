## API Report File for "@nextgis/control-container"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ControlPosition } from '@nextgis/webmap';
import { MapAdapter } from '@nextgis/webmap';
import { MapControl } from '@nextgis/webmap';

// @alpha (undocumented)
class ControlContainer {
    constructor(opt?: ControlContainerOptions);
    // (undocumented)
    addControl(control: MapControl, position: ControlPosition): void;
    // (undocumented)
    addTo(el: HTMLElement | string): this;
    // (undocumented)
    append(element: HTMLElement | string, position: ControlPosition): void;
    // (undocumented)
    static controls: {
        ZOOM: typeof ZoomControl;
    };
    // (undocumented)
    detach(): void;
    // (undocumented)
    getContainer(): HTMLElement;
    // (undocumented)
    getPositionContainer(position: ControlPosition): HTMLElement | undefined;
    // (undocumented)
    newPositionContainer(position: ControlPosition): HTMLElement | undefined;
}
export default ControlContainer;

// @public (undocumented)
export interface ControlContainerOptions {
    // (undocumented)
    addClass?: string;
    // (undocumented)
    classPrefix?: string;
    // (undocumented)
    map?: MapAdapter;
    // (undocumented)
    target?: string;
}

// Warnings were encountered during analysis:
//
// src/ControlContainer.ts:14:7 - (ae-forgotten-export) The symbol "ZoomControl" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```