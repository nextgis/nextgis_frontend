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

export interface ApiComment {
  shortText?: string;
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
  'Constructor signature' |
  'Interface' |
  'Type literal' |
  'Index signature'
  ;

  type?: Property;
}

export interface ClassItem extends ApiItem {
  kindString: 'Class';
}

export interface InterfaceItem extends ApiItem {
  kindString: 'Interface';
  children: Parameter[];
}

export interface Parameter extends ApiItem {
  kindString: 'Parameter';
  type: Property;
  comment: ApiComment;
}

export interface ConstructorSignature extends ApiItem {
  kindString: 'Constructor signature';
  parameters: Parameter[];
}

export interface ConstructorItem extends ApiItem {
  kindString: 'Constructor';

  signatures: ConstructorSignature[];
}

export type Property = IntrinsicPropertyType | PropertyUnionType | ReferencePropertyType | TuplePropertyType;

export interface PropertyType {
  type: string;
}

export interface IntrinsicPropertyType extends PropertyType {
  type: 'intrinsic';
  name: 'undefined' | 'string' | 'number' | 'any';
}

export interface TuplePropertyType extends PropertyType {
  type: 'tuple';
  elements: Property[];
}

export interface ReferencePropertyType extends PropertyType {
  type: 'reference';
  id: number;
  name: string;
  typeArguments: Property[];
}

export interface PropertyUnionType extends PropertyType {
  type: 'union';
  types: Property[];
}

interface IndexSignature extends ApiItem {
  name: '__index';
  kindString: 'Index signature';
  parameters: Parameter[];
  type: Property;
}

interface Declaration extends ApiItem {
  kindString: 'Type literal';
  indexSignature: IndexSignature[];
}

export interface DeclarationReflectionType extends PropertyType {
  type: 'reflection';
  name: '__type';
  declaration: Declaration;
}
