export interface Flags {
  isPrivate: boolean;
  isExported: boolean;
  isOptional: boolean;
}

export interface ApiItem {
  id: number;
  name: string;
  kind: number;
  flags: Flags;

  children: ApiItem[];

  kindString?: 'Class' | 'Property' | 'Method' | 'Parameter' | 'Call signature';

}

export interface ClassItem {
  kindString: 'Class';
}
