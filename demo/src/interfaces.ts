import type { QTreeNode } from 'quasar';

export interface Package {
  name: string;
  version: string;
  main: string;
}

export interface Item extends Omit<ExampleItem, 'children'> {
  children?: Item[];
  model?: boolean;
  component?: unknown;
  icon?: string;
  _parent?: Item;
}

export interface ExampleItem {
  id: string;
  name: string;
  page?: 'example' | 'readme' | 'api';
  md?: string;
  html?: string;
  ngwMaps?: Package[];
  tags?: string[];
  description?: string;
  priority?: number;
  children?: ExampleItem[];
}

export type TreeNode = QTreeNode<
  Partial<Omit<Item, 'name' | 'children' | 'icon'> & { component: unknown }>
>;
