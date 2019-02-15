export interface ApiItem {
  id: number;
  name: string;
  kind: number;
  flags: {};
  children: ApiItem[];

  kindString?: 'Class';
}
