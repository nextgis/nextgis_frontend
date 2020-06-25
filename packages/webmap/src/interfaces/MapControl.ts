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

/**
 * @public
 */
export interface MapControl<M extends any = any> {
  onAdd(map?: M): HTMLElement | undefined;
  onRemove(map?: M): unknown;
  remove?(): void;
}

/**
 * @public
 */
export interface ButtonControlOptions {
  html?: string | HTMLElement;
  addClass?: string;
  onClick: OnClick;
  title?: string;
}

/**
 * @public
 */
export type HtmlDef = string | HTMLElement;

/**
 * @public
 */
export interface HtmlToggle {
  on: HtmlDef;
  off: HtmlDef;
}

/**
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
  /** Set an action to execute when button clicked clicked. */
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
