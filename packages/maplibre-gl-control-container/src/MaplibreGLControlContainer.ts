import ControlContainer from '@nextgis/control-container';

import type {
  AddControlOptions,
  ControlContainerOptions,
  ControlTargetPosition,
} from '@nextgis/control-container';
import type {
  ControlPosition,
  IControl,
  Map as MaplibreMap,
} from 'maplibre-gl';

export type MaplibreGLControlContainerOptions = Omit<
  ControlContainerOptions<MaplibreMap>,
  'container' | 'positionContainers' | 'map'
>;

export class MaplibreGLControlContainer {
  private readonly map: MaplibreMap;
  private readonly controlContainer: ControlContainer;
  private readonly targets = new WeakMap<IControl, HTMLElement>();
  private readonly ids = new WeakMap<IControl, string>();

  constructor(
    map: MaplibreMap,
    options: MaplibreGLControlContainerOptions = {},
  ) {
    this.map = map;
    this.controlContainer = this.createControlContainer(options);
    this.controlContainer.addTo(map.getContainer());
  }

  addControl(
    control: IControl,
    position: ControlTargetPosition,
    options: AddControlOptions = {},
  ): IControl {
    const targetPosition = (
      typeof position === 'string' ? position : 'top-left'
    ) as ControlPosition;
    this.map.addControl(control, targetPosition);

    const container = this.getControlElement(control);
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

  removeControl(control: IControl): void {
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
    control?: IControl,
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
    options: MaplibreGLControlContainerOptions,
  ): ControlContainer {
    const mapContainer = this.map.getContainer();
    const controlContainer = mapContainer.querySelector(
      '.maplibregl-control-container',
    ) as HTMLElement | null;
    const getCorner = (position: string) =>
      mapContainer.querySelector(
        `.maplibregl-ctrl-${position}`,
      ) as HTMLElement | null;

    return new ControlContainer({
      ...options,
      map: this.map,
      container: controlContainer || undefined,
      positionContainers: {
        'top-left': getCorner('top-left') || undefined,
        'top-right': getCorner('top-right') || undefined,
        'bottom-left': getCorner('bottom-left') || undefined,
        'bottom-right': getCorner('bottom-right') || undefined,
      },
    });
  }

  private getControlElement(control: IControl): HTMLElement | undefined {
    const withContainer = control as IControl & {
      getContainer?: () => HTMLElement | undefined;
      _container?: HTMLElement;
    };
    return (
      (withContainer.getContainer &&
        withContainer.getContainer.call(control)) ||
      withContainer._container
    );
  }
}
