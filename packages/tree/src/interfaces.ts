export type SelfFilter<TREE_ITEM = any> = (x: TREE_ITEM) => boolean;
export type RelationFunction<TREE_ITEM = any> = (
  x: TREE_ITEM,
) => TREE_ITEM | TREE_ITEM[] | undefined;
export type TreeRelation<TREE_ITEM = any> =
  | RelationFunction<TREE_ITEM>
  | string;

export type DefaultTreeItem = Record<string, any>;

export interface TreeOptions<TREE_ITEM = any> {
  relation?: TreeRelation<TREE_ITEM>;
}
