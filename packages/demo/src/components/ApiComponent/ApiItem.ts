export interface Flags {
  isPrivate: boolean;
  isExported: boolean;
  isOptional: boolean;
  isStatic: boolean;
}

export type KindString =
  | 'External module'
  | 'Class'
  | 'Constructor'
  | 'Property'
  | 'Method'
  | 'Parameter'
  | 'Function'
  | 'Call signature'
  | 'Constructor signature'
  | 'Interface'
  | 'Type literal'
  | 'Index signature'
  | 'Variable'
  | 'Event';

export interface Source {
  fileName: string;
  line: number;
  character: number;
}

export interface Tag {
  tag: 'example' | 'default';
  text: string;
}

type Tags = Tag[];

export interface ApiComment {
  text?: string;
  shortText?: string;
  tags?: Tags;
}

export interface ApiItem {
  module?: ApiItem;

  id: number;
  name: string;
  kind: number;
  flags: Flags;

  children?: ApiItem[];

  sources?: Source[];
  kindString?: KindString;

  type?: Property;
  comment?: ApiComment;
}

export type Parameter = ParameterItem | VariableItem | MethodItem | TypedItem;

export interface ClassItem extends ApiItem {
  kindString: 'Class';
}

export interface VariableItem extends ApiItem {
  kindString: 'Variable';
  type: Property;
}

export interface CallSignatureItem extends ApiItem {
  kindString: 'Call signature';
  type: Property;
  comment: ApiComment;
}

export interface InterfaceItem extends ApiItem {
  kindString: 'Interface';
  children: Parameter[];
}

export interface PropertyItem extends ApiItem {
  kindString: 'Property';
  type: Property;
  name: string;
}
export interface TypedItem extends ApiItem {
  type: Property;
}

export interface ParameterItem extends ApiItem {
  kindString: 'Parameter';
  type: Property;
  comment: ApiComment;
}

export interface ConstructorSignature extends ApiItem {
  kindString: 'Constructor signature';
  parameters: Parameter[];
}

export interface SignaturedItem extends ApiItem {
  signatures: Signatures[];
}

export interface ConstructorItem extends ApiItem {
  kindString: 'Constructor';
  signatures: ConstructorSignature[];
}

export interface FunctionItem extends SignaturedItem {
  kindString: 'Function';
  implementationOf: ReferencePropertyType;
}

export interface MethodItem extends SignaturedItem {
  kindString: 'Method';
  implementationOf: ReferencePropertyType;
}

export type Property =
  | IntrinsicPropertyType
  | PropertyUnionType
  | ReferencePropertyType
  | TuplePropertyType
  | TypeOperatorPropertyType
  | ReflectionType;

export interface PropertyType {
  name?: string;
  type: string;
  comment?: ApiComment;
}

export interface IntrinsicPropertyType extends PropertyType {
  type: 'intrinsic';
  name: 'undefined' | 'string' | 'number' | 'any';
}

export interface TuplePropertyType extends PropertyType {
  type: 'tuple';
  elements: Property[];
}

export interface TypeOperatorPropertyType extends PropertyType {
  type: 'typeOperator';
  operator: 'keyof';
  target: Property;
}

export interface ReferencePropertyType extends PropertyType {
  type: 'reference';
  name: string;
  id: number;
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

export interface Declaration extends ApiItem {
  kindString: 'Type literal';
  indexSignature?: IndexSignature[];
  signatures?: Signatures[];
  children?: VariableItem[];
  name: '__type';
}

export interface ReflectionType extends PropertyType {
  type: 'reflection';
  declaration: Declaration;
}

export type Signatures = IndexSignature | ConstructorSignature | CallSignatureItem;
