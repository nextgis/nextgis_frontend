/**
 * @module webmap
 */

type OnClickSync = (status?: boolean) => void;
type onClickAsync = (status?: boolean) => Promise<void>;
export type OnClick = OnClickSync | onClickAsync;

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

export interface MapControls {
  ZOOM: ZoomControlOptions;
  ATTRIBUTION: AttributionControlOptions;
  [name: string]: {};
}

export interface MapControl<M extends any = any> {
  onAdd(map?: M): any;
  onRemove(map?: M): any;
}

export interface ButtonControlOptions {
  html?: string | HTMLElement;
  addClass?: string;
  onClick: OnClick;
  title?: string;
}

export type HtmlDef = string | HTMLElement;

export interface HtmlToggle {
  on: HtmlDef;
  off: HtmlDef;
}

export interface TitleToggle {
  on: string;
  off: string;
}

export interface ToggleControlOptions {
  status?: boolean;
  html?: HtmlDef | HtmlToggle;

  addClass?: string;
  addClassOn?: string;
  addClassOff?: string;

  title?: string | TitleToggle;

  onClick?: OnClick;
  getStatus?: () => boolean;
}

export interface CreateControlOptions {
  bar?: boolean;
  margin?: boolean;
  addClass?: string;
}

export interface ToggleControl {
  onClick: OnClick;
  changeStatus: OnClickSync;
}
