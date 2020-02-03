/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ConstructorItem,
  Property,
  ReferencePropertyType,
  ReflectionType,
  Signatures,
  Parameter,
  MethodItem,
  FunctionItem,
  ApiItem,
  KindString,
  Declaration
} from './ApiItem';
import { Indexes } from '../../store/modules/api';

export function getSourceLink(item: ApiItem) {
  return item.sources.map(x => {
    const link = `https://github.com/nextgis/nextgisweb_frontend/blob/master/packages/${x.fileName}#L${x.line}`;
    return `<a href="${link}" target="_blank">${x.fileName}#L${x.line}</a>`;
  });
}

export function getParameterName(parameter: Parameter) {
  return `${parameter.name}${parameter.flags.isOptional ? '?' : ''}`;
}

export function createHref(ref: ApiItem, name: string) {
  return `${ref.module.name}-api#${name}`;
}
export function createMethodString(
  methodItem: MethodItem | FunctionItem | Declaration,
  indexes: Indexes
): string {
  const signatures = methodItem.signatures
    .map(x => {
      if ('parameters' in x) {
        // const args = getSignatureParameters(x.parameters, indexes).join(', ');
        const args = x.parameters
          .map(p => {
            return `${getParameterName(p)}`;
          })
          .join(', ');
        return `(${args})`; // : ${getOptionType(x.type, indexes)}`;
      }
    })
    .join(', ');
  return `${methodItem.name}${signatures || '()'}`;
}

export function createLink(ref: ApiItem, name: string) {
  return `<a href="${createHref(ref, name)}">${name}</a>`;
}

export function createReference(
  option: ReferencePropertyType,
  indexes: Indexes
) {
  let str = '';
  const kindStringToLink: KindString[] = ['Interface', 'Class'];
  const refOption = indexes[option.id];

  const isHref = ref => {
    return ref && kindStringToLink.indexOf(ref.kindString) !== -1;
  };

  if (refOption && refOption.type) {
    str += getOptionType(refOption.type, indexes);
  } else if (option.typeArguments) {
    let name = option.name;
    if (option.type === 'reference' && isHref(refOption)) {
      name = createLink(refOption, option.name);
    }
    const args = option.typeArguments
      .map(x => getOptionType(x, indexes))
      .filter(x => !!x)
      .join(' | ');
    str += `${name}${args ? `&lt;${args}&gt;` : ''}`;
  } else if (isHref(refOption)) {
    return createLink(refOption, option.name);
  } else if (refOption && refOption.kindString === 'Function') {
    return createMethodString(refOption as FunctionItem, indexes);
  } else {
    return option.name;
  }
  return str;
}

export function getOptionType(option: Property, indexes: Indexes): string {
  if (option.type === 'union') {
    return option.types
      .map(x => getOptionType(x, indexes))
      .filter(x => !!x)
      .join(' | ');
  } else if (option.type === 'intrinsic') {
    if (option.name !== 'undefined') {
      return option.name;
    }
  } else if (option.type === 'tuple') {
    return `[${option.elements
      .map(x => getOptionType(x, indexes))
      .filter(x => !!x)
      .join(', ')}]`;
  } else if (option.type === 'reference') {
    return createReference(option, indexes);
  } else if (option.type === 'reflection') {
    return createDeclarationStr(option, indexes);
  } else if (option.type === 'typeOperator') {
    return `keyof ${getOptionType(option.target, indexes)}`;
  }

  return '';
}

export function getDeclarationSignatureStr(
  signatures: Signatures,
  indexes: Indexes
) {
  if ('parameters' in signatures) {
    const parameters = getSignatureParameters(signatures.parameters, indexes);
    const str = `{[${parameters.join(
      ', '
    )}]<span class="nowrap">: ${getOptionType(
      signatures.type,
      indexes
    )}</span>}`;
    return str;
  }
}

export function createDeclarationStr(option: ReflectionType, indexes: Indexes) {
  let str = '';
  if (option.declaration) {
    if (option.declaration.name === '__type') {
      if (option.declaration.indexSignature) {
        const signatures = option.declaration.indexSignature;
        str += signatures.map(x => {
          return getDeclarationSignatureStr(x, indexes);
        });
      } else if (option.declaration.children) {
        const defs = option.declaration.children.map(x => {
          return `<span class="nowrap">${getParameterName(x)}: ${getOptionType(
            x.type,
            indexes
          )}</span>`;
        });
        str += `{${defs.join(', ')}}`;
      } else if (option.declaration.signatures) {
        str += createMethodTypeString(option.declaration, indexes);
      }
    }
  }
  return str;
}

export function getSignatureParameters(
  parameters: Parameter[],
  indexes: Indexes
): string[] {
  return parameters.map(p => {
    const typeName = getOptionType(p.type, indexes);
    return `${getParameterName(p)}${
      typeName ? `<span class="nowrap">: ${typeName}</span>` : ''
    }`;
  });
}

export function getConstructorSignatureStr(
  item: ConstructorItem,
  indexes: Indexes
) {
  return (
    item &&
    item.signatures.map(x => {
      return getSignatureStrForConstructor(x, indexes);
    })
  );
}

export function getSignatureStrForConstructor(
  signatures: Signatures,
  indexes: Indexes
) {
  if ('parameters' in signatures) {
    // const parameters = getSignatureParameters(signatures.parameters, indexes);
    const parameters = signatures.parameters.map(p => {
      return `${getParameterName(p)}`;
    });
    const str = `${signatures.name}(${parameters.join(', ')})`;
    return str;
  }
}

export function createMethodTypeString(
  methodItem: MethodItem | FunctionItem | Declaration,
  indexes: Indexes
): string {
  const signatures = methodItem.signatures
    .map(x => {
      let str = '(';
      if ('parameters' in x) {
        const args = getSignatureParameters(x.parameters, indexes).join(', ');
        str += args;
      }
      str += ')';
      const toReturn = getOptionType(x.type, indexes);
      if (toReturn) {
        str += `<span class="nowrap">: ${toReturn}</span>`;
      }
      return str;
    })
    .join(', ');
  return `${signatures}`;
}

export function createMethodReturn(
  methodItem: MethodItem | FunctionItem | Declaration,
  indexes: Indexes
): string {
  const signatures = methodItem.signatures
    .map(x => {
      const toReturn = getOptionType(x.type, indexes);
      if (toReturn) {
        return toReturn;
      }
      return '';
    })
    .filter(x => !!x)
    .join('| ');
  return `${signatures}`;
}
