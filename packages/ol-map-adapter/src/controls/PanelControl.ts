import ControlContainer from '@nextgis/control-container';
import Control from 'ol/control/Control';

import type { ControlPosition } from '@nextgis/webmap';

import './PanelControl.css';

interface PanelControlOptions {
  collapsible?: boolean;
}

const OPTIONS: PanelControlOptions = {
  collapsible: false,
};

export class PanelControl extends Control {
  private panelContainer: ControlContainer;

  constructor(options?: PanelControlOptions) {
    const panelContainer = new ControlContainer();
    const element = panelContainer.getContainer();
    super({ ...OPTIONS, ...options, element });
    this.panelContainer = panelContainer;
  }

  async addControl(control: Control, position: ControlPosition): Promise<void> {
    const map = this.getMap();
    if (map) {
      const target = this.panelContainer.newPositionContainer(position);
      if (target) {
        const _control = await control;
        const element = (_control as any).element as HTMLElement;
        if (element) {
          element.classList.add('webmap-ctrl');
        }
        _control.setTarget(target);
        map.addControl(_control);
      }
    }
  }

  removeControl(control: Control): void {
    const map = this.getMap();
    if (map) {
      map.removeControl(control);
    }
  }

  getContainer(): HTMLElement {
    return this.panelContainer.getContainer();
  }
}
