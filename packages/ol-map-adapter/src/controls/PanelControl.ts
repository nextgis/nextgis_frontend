import './PanelControl.css';

import Control from 'ol/control/Control';
import { ControlPositions } from '@nextgis/webmap';
import { MapControlContainer } from '@nextgis/utils';

interface PanelControlOptions {
  collapsible?: boolean;
}

const OPTIONS: PanelControlOptions = {
  collapsible: false
};

export class PanelControl extends Control {
  private panelContainer: MapControlContainer;

  constructor(options?: PanelControlOptions) {
    const panelContainer = new MapControlContainer();
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
