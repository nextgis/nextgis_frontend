import ControlContainer from '@nextgis/control-container';

import type {
  AddControlOptions,
  ControlContainerOptions,
  ControlTargetPosition,
} from '@nextgis/control-container';
import type {
  Control as LeafletControl,
  ControlPosition,
  Map as LeafletMap,
} from 'leaflet';

import './LeafletControlContainer.css';

export type LeafletControlContainerOptions = Omit<
  ControlContainerOptions<LeafletMap>,
  'container' | 'positionContainers' | 'map'
>;

export class LeafletControlContainer {
  private readonly map: LeafletMap;
  private readonly controlContainer: ControlContainer;
  private readonly targets = new WeakMap<LeafletControl, HTMLElement>();
  private readonly ids = new WeakMap<LeafletControl, string>();

  constructor(map: LeafletMap, options: LeafletControlContainerOptions = {}) {
    this.map = map;
    this.controlContainer = this.createControlContainer(options);
    this.controlContainer.addTo(map.getContainer());
  }

  addControl(
    control: LeafletControl,
    position: ControlTargetPosition,
    options: AddControlOptions = {},
  ): LeafletControl {
    const targetPosition = typeof position === 'string' ? position : 'top-left';
    control.options.position = targetPosition.replace(
      '-',
      '',
    ) as ControlPosition;
    this.map.addControl(control);

    const container = control.getContainer();
    if (container) {
      this.controlContainer.append(container, position, options.order, control);
      this.targets.set(control, container);
      if (options.id) {
        this.controlContainer.registerIDContainer(
          options.id,
          container,
          control,
        );
        this.ids.set(control, options.id);
      }
    }

    return control;
  }

  removeControl(control: LeafletControl): void {
    this.map.removeControl(control);

    const id = this.ids.get(control);
    if (id) {
      this.controlContainer.unregisterIDContainer(id);
      this.ids.delete(control);
    }

    const target = this.targets.get(control);
    if (target) {
      this.controlContainer.removeTarget(target);
      this.targets.delete(control);
    }
  }

  append(
    element: HTMLElement | string,
    position: ControlTargetPosition,
    order = 0,
  ): void {
    this.controlContainer.append(element, position, order);
  }

  registerIDContainer(
    id: string,
    controlRoot: HTMLElement,
    control?: LeafletControl,
  ): void {
    this.controlContainer.registerIDContainer(id, controlRoot, control);
  }

  unregisterIDContainer(id: string): void {
    this.controlContainer.unregisterIDContainer(id);
  }

  detach(): void {
    this.controlContainer.detach();
  }

  getContainer(): HTMLElement {
    return this.controlContainer.getContainer();
  }

  getControlContainer(): ControlContainer {
    return this.controlContainer;
  }

  private createControlContainer(
    options: LeafletControlContainerOptions,
  ): ControlContainer {
    const mapAny = this.map as any;
    const controlCorners = mapAny._controlCorners || {};
    const getCorner = (key: string, selector: string) =>
      (controlCorners[key] as HTMLElement | undefined) ||
      (this.map.getContainer().querySelector(selector) as HTMLElement | null) ||
      undefined;

    return new ControlContainer({
      ...options,
      map: this.map,
      container: mapAny._controlContainer as HTMLElement | undefined,
      positionContainers: {
        'top-left': getCorner('topleft', '.leaflet-top.leaflet-left'),
        'top-right': getCorner('topright', '.leaflet-top.leaflet-right'),
        'bottom-left': getCorner('bottomleft', '.leaflet-bottom.leaflet-left'),
        'bottom-right': getCorner(
          'bottomright',
          '.leaflet-bottom.leaflet-right',
        ),
      },
    });
  }
}
