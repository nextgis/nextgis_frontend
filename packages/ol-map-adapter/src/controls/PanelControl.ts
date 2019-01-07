import { ControlPositions } from '@nextgis/webmap';
import Control from 'ol/control/Control';
import { PanelContainerElement } from './PanelContainerElement';

const OPTIONS = {
  collapsible: false
};

export class PanelControl extends Control {

  private panelContainer: PanelContainerElement;

  constructor(options?) {
    const panelContainer = new PanelContainerElement();
    const element = panelContainer.getContainer();
    super({ ...OPTIONS, ...options, element });
    this.panelContainer = panelContainer;
  }

  async addControl(control: Control, position: ControlPositions) {
    const map = this.getMap();
    const target = this.panelContainer.newPositionContainer(position);
    const _control = await control;
    _control.setTarget(target);
    map.addControl(_control);
  }

  removeControl(control) {
    const map = this.getMap();
    map.removeControl(control);
  }
}
