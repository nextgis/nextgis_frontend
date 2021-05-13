import type { ControlPosition } from './MapAdapter';

/**
 * @public
 */
export type OnClickSync = (status?: boolean) => void;
/**
 * @public
 */
export type onClickAsync = (status?: boolean) => Promise<void>;
/**
 * @public
 */
export type OnClick = OnClickSync | onClickAsync;

// like in https://leafletjs.com/reference-1.3.4.html#control-zoom
/**
 * @public
 */
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

/**
 * @public
 */
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

/**
 * @public
 */
export interface MapControls {
  [name: string]: Record<string, any>;
  ZOOM: ZoomControlOptions;
  ATTRIBUTION: AttributionControlOptions;
}

export interface ControlOptions {
  [param: string]: any;
  position?: ControlPosition;
  control?: string;
}

export interface ControlsOptions {
  [control: string]: ControlOptions;
}

/**
 * @public
 */
export interface MapControl<M extends any = any> {
  onAdd(map?: M): HTMLElement | undefined;
  onRemove(map?: M): unknown;
  remove?(): void;
}

/**
 * Options for creating a {@link WebMapControls.createButtonControl | button control}.
 * @public
 */
export interface ButtonControlOptions {
  /** Button content. */
  html?: string | HTMLElement;
  /** Additional css class string */
  addClass?: string;
  /** Set an action to execute when button clicked. */
  onClick: OnClick;
  /** Button HTMLElement title */
  title?: string;
}

/**
 * @public
 */
export type HtmlDef = string | HTMLElement;

/**
 * Values to be in the button content in accordance with the status of the toggle control
 * @public
 */
export interface HtmlToggle {
  on: HtmlDef;
  off: HtmlDef;
}

/**
 * Values to be in the title in accordance with the status of the toggle control
 * @public
 */
export interface TitleToggle {
  on: string;
  off: string;
}

/**
 * Options for creating a {@link WebMapControls.createToggleControl | toggle control}
 * to layout customization and assigning a callback function
 * @public
 */
export interface ToggleControlOptions {
  /** Boolean state of control. */
  status?: boolean;
  /** Button content, can be set for each state (`on` or `off`). */
  html?: HtmlDef | HtmlToggle;
  /** Additional css class string */
  addClass?: string;
  /** Additional css class string for `on` state only. */
  addClassOn?: string;
  /** Additional css class string for `off` state only. */
  addClassOff?: string;
  /** Button HTMLElement title, can be set for each state (`on` or `off`). */
  title?: string | TitleToggle;
  /** Set an action to execute when button clicked. */
  onClick?: OnClick;
  /** Get current control status. */
  getStatus?: () => boolean;
}

/**
 * @public
 */
export interface CreateControlOptions {
  bar?: boolean;
  margin?: boolean;
  addClass?: string;
}

/**
 * @public
 */
export interface ToggleControl {
  onClick: OnClick;
  changeStatus: OnClickSync;
}
