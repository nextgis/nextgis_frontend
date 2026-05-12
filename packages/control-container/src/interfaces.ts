export type ControlPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type ControlTargetPosition = ControlPosition | { inside: string };

export type OnClickSync = () => void;
export type OnClickAsync = () => Promise<void>;

export type OnToggleClickSync = (status: boolean) => void;
export type OnToggleClickAsync = (status: boolean) => Promise<void>;

export type OnClick = OnClickSync | OnClickAsync;
export type OnToggleClick = OnToggleClickSync | OnToggleClickAsync;

export interface MapControl<M = any> {
  onAdd(map?: M): HTMLElement | undefined;
  remove?(): void;
  onRemove(map?: M): unknown;
  getContainer?(): HTMLElement | undefined;
}

/**
 * Options for creating a {@link WebMapControls.createButtonControl | button control}.
 */
export interface ButtonControlOptions {
  /** Button content. */
  html?: string | HTMLElement;
  /** Additional css class string */
  addClass?: string;
  /** Set standard outer offset. Enabled by default for bar controls. */
  margin?: boolean;
  /** Set an action to execute when button clicked. */
  onClick: OnClick;
  /** Button HTMLElement title */
  title?: string;
}

export type HtmlDef = string | HTMLElement;

/**
 * Values to be in the button content in accordance with the status of the toggle control
 */
export interface HtmlToggle {
  on: HtmlDef;
  off: HtmlDef;
}

/**
 * Values to be in the title in accordance with the status of the toggle control
 */
export interface TitleToggle {
  on: string;
  off: string;
}

export interface ToggleControlOptions {
  /** Boolean state of control. */
  status?: boolean;
  /** Button content, can be set for each state (`on` or `off`). */
  html?: HtmlDef | HtmlToggle;
  /** Additional css class string */
  addClass?: string;
  /** Set standard outer offset. Enabled by default for bar controls. */
  margin?: boolean;
  /** Additional css class string for `on` state only. */
  addClassOn?: string;
  /** Additional css class string for `off` state only. */
  addClassOff?: string;
  /** Button HTMLElement title, can be set for each state (`on` or `off`). */
  title?: string | TitleToggle;
  /**
   * Enables switch mode for toggles added to the same control container.
   *
   * If `true`, the toggle joins the default switch group for its container.
   * If a string is set, only toggles with the same string are switched together.
   */
  switch?: boolean | string;
  /**
   * Prevents a user click from turning an active toggle off.
   * Explicit `onClick(false)` calls can still switch it off.
   */
  disableOnSecondClick?: boolean;
  /** Set an action to execute when button clicked. */
  onClick?: OnToggleClick;
  /** Get current control status. */
  getStatus?: () => boolean;
}
export interface CreateControlOptions {
  bar?: boolean;
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  margin?: boolean;
  addClass?: string;
  direction?: 'vertical' | 'horizontal';
  orientation?: 'vertical' | 'horizontal';
  disableOnSecondClick?: boolean;
}

export interface AddControlOptions {
  id?: string;
  order?: number;
}

export interface ToggleControl {
  switch?: boolean | string;
  disableOnSecondClick?: boolean;
  onStatusChange(listener: ToggleStatusChangeListener): () => void;
  changeStatus(status?: boolean): void;
  onClick(status?: boolean): void;
  getStatus(): boolean;
}

export type ToggleStatusChangeListener = (
  status: boolean,
  control: ToggleControl,
) => void;

export interface ControlContainerOptions<M = any> {
  map?: M;
  target?: string;
  addClass?: string;
  container?: HTMLElement;
  classPrefix?: string;
  wrapperClass?: string;
  positionContainers?: Partial<Record<ControlPosition, HTMLElement>>;
}
