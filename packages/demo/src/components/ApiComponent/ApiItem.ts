export interface Flags {
  isPrivate: boolean;
  isExported: boolean;
  isOptional: boolean;
}

export interface Source {
  fileName: string;
  line: number;
  character: number;
}

export interface ReferenceType {
  type: 'reference';
  name: string;
  id: number;
}

export interface ApiItem {
  id: number;
  name: string;
  kind: number;
  flags: Flags;

  children: ApiItem[];

  sources?: Source[];
  kindString?: 'Class' |
  'Constructor' |
  'Property' |
  'Method' |
  'Parameter' |
  'Call signature' |
  'Constructor signature';

}

export interface ClassItem extends ApiItem {
  kindString: 'Class';
}

export interface Parameter extends ApiItem {
  kindString: 'Parameter';
  type: ReferenceType;
}

export interface ConstructorSignature extends ApiItem {
  kindString: 'Constructor signature';
  parameters: Parameter[];
}

export interface ConstructorItem extends ApiItem {
  kindString: 'Constructor';

  signatures: ConstructorSignature[];
}
