/**
 * Options for initializing a basic search provider.
 */
export interface BaseProviderOptions {
  /**
   * URL endpoint for the search service.
   * This is where queries will be sent to obtain search results.
   */
  searchUrl?: string;

  /**
   * Label to represent the provider.
   * This could be used for user interfaces to display the source of search results.
   */
  label?: string;
}
