import ControlContainer, {
  getControlOptions,
} from '@nextgis/control-container';
import Control from 'ol/control/Control';

import type {
  AddControlOptions,
  ControlContainerOptions,
  ControlTargetPosition,
} from '@nextgis/control-container';
import type { Options as OlControlOptions } from 'ol/control/Control';

import './OlControlContainer.css';

export interface OlControlContainerOptions extends OlControlOptions {
  controlContainerOptions?: Omit<ControlContainerOptions, 'map'>;
}

export class OlControlContainer extends Control {
  private controlContainer: ControlContainer;
  private targets = new WeakMap<Control, HTMLElement>();
  private ids = new WeakMap<Control, string>();

  constructor(options: OlControlContainerOptions = {}) {
    const { controlContainerOptions, ...controlOptions } = options;
    const controlContainer = new ControlContainer({
      ...controlContainerOptions,
    });
    const element = controlContainer.getContainer();
    super({ ...controlOptions, element });
    this.controlContainer = controlContainer;
  }

  async addControl(
    control: Control | Promise<Control>,
    position: ControlTargetPosition,
    options: AddControlOptions = {},
  ): Promise<void> {
    const map = this.getMap();
    if (map) {
      const olControl = await control;
      const target = this.controlContainer.newPositionContainer(
        position,
        options.order,
        olControl,
      );
      if (target) {
        const element = (olControl as any).element as HTMLElement;
        if (element) {
          element.classList.add('webmap-ctrl');
          const controlOptions = getControlOptions(olControl);
          if (
            controlOptions?.margin ||
            (!controlOptions && element.classList.contains('webmap-ctrl-group'))
          ) {
            target.classList.add('webmap-ctrl-margin');
          }
          if (options.id) {
            this.controlContainer.registerIDContainer(
              options.id,
              element,
              olControl,
            );
            this.ids.set(olControl, options.id);
          }
        }
        olControl.setTarget(target);
        map.addControl(olControl);
        this.targets.set(olControl, target);
      }
    }
  }

  removeControl(control: Control): void {
    const map = this.getMap();
    if (map) {
      map.removeControl(control);
    }

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

  getContainer(): HTMLElement {
    return this.controlContainer.getContainer();
  }

  getControlContainer(): ControlContainer {
    return this.controlContainer;
  }
}

export { OlControlContainer as PanelControl };
