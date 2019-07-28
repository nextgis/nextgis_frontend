import { NavigationControl } from 'mapbox-gl';
import { ZoomControlOptions } from '@nextgis/webmap';

export class ZoomControl extends NavigationControl {
  options: ZoomControlOptions & any;

  constructor(options: ZoomControlOptions & any = {}) {
    options = { ...options, showCompass: false };
    super(options);
  }

  _createButton(className: string, ariaLabel: string, fn: () => any) {
    // @ts-ignore
    const element = super._createButton(className, ariaLabel, fn);
    const aliases: any = {
      'Zoom in': 'zoomInTitle',
      'Zoom out': 'zoomOutTitle'
    };
    const alias = aliases[ariaLabel];
    const label = alias && this.options[alias];
    if (label) {
      element.title = label;
      element.setAttribute('aria-label', label);
    }

    return element;
  }
}
