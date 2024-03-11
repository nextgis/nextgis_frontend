/* eslint-disable */

interface Package {
  name: string;
  version: string;
  main: string;
}

interface ExampleItem {
  id: string;
  name: string;
  page?: 'example' | 'readme' | 'api';
  md?: string;
  html?: string;
  ngwMaps?: Package[];
  tags?: string[];
  description?: string;
  children?: ExampleItem[];
}

declare var EXAMPLES: ExampleItem[];
