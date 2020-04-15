/**
 * Special options passed to Repository#save, Repository#insert and Repository#update methods.
 */
export interface UpdateOptions {
  /**
   * Indicates if listeners and subscribers are called for this operation.
   * By default they are enabled, you can disable them by setting { listeners: false } in save/remove options.
   */
  listeners?: boolean;

  /**
   * Breaks save execution into chunks of a given size.
   * For example, if you want to save 100,000 objects but you have issues with saving them,
   * you can break them into 10 groups of 10,000 objects (by setting { chunk: 10000 }) and save each group separately.
   * This option is needed to perform very big insertions when you have issues with underlying driver parameter number limitation.
   */
  chunk?: number;
}
