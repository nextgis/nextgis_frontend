import type { ControlTargetPosition } from './MapAdapter';
export type {
  AddControlOptions,
  ButtonControlOptions,
  CreateControlOptions,
  HtmlDef,
  HtmlToggle,
  MapControl,
  TitleToggle,
  ToggleControl,
  ToggleControlOptions,
  ToggleStatusChangeListener,
} from '@nextgis/control-container';

// like in https://leafletjs.com/reference-1.3.4.html#control-zoom

export interface ZoomControlOptions {
  /** The text set on the 'zoom in' button. */
  zoomInText?: string;
  /** The title set on the 'zoom in' button. */
  zoomInTitle?: string;
  /** The text set on the 'zoom out' button. */
  zoomOutText?: string;
  /** The title set on the 'zoom out' button. */
  zoomOutTitle?: string;
}

export interface AttributionControlOptions {
  /**
   * If true force a compact attribution that shows the full attribution on mouse hover,
   * or if  false force the full attribution control.
   */
  compact?: boolean;
  /**
   * String or strings to show in addition to any other attributions.
   */
  customAttribution?: string | string[];
}

export interface MapControls extends ContribControlsOptions {
  [name: string]: Record<string, any>;
}

export interface ContribControlsOptions {
  ZOOM: ZoomControlOptions;
  ATTRIBUTION: AttributionControlOptions;
}

export interface ControlOptions {
  position?: ControlTargetPosition;
  control?: string;
  order?: number;
  id?: string;
}

export type ControlsOptions<
  O extends MapControls = MapControls,
  K extends keyof O = keyof O,
> = {
  [control in K]: O[K];
};
