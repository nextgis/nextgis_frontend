import './PanelControl.css';

import Control from 'ol/control/Control';
import { ControlPositions } from '@nextgis/webmap';
import { ControlContainer } from '@nextgis/control-container';

interface PanelControlOptions {
  collapsible?: boolean;
}

const OPTIONS: PanelControlOptions = {
  collapsible: false
};

export class PanelControl extends Control {
  private panelContainer: ControlContainer;

  constructor(options?: PanelControlOptions) {
    const panelContainer = new ControlContainer();
    const element = panelContainer.getContainer();
    super({ ...OPTIONS, ...options, element });
    this.panelContainer = panelContainer;
  }

  async addControl(control: Control, position: ControlPositions) {
    const map = this.getMap();
    const target = this.panelContainer.newPositionContainer(position);
    if (target) {
      const _control = await control;
      _control.setTarget(target);
      map.addControl(_control);
    }
  }

  removeControl(control: Control) {
    const map = this.getMap();
    map.removeControl(control);
  }
}
