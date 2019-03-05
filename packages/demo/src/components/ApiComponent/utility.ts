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
  KindString
} from './ApiItem';
import { Indexes } from '../../store/modules/api';

export function getSourceLink(item: ApiItem) {
  return item.sources.map((x) => {
    const link = `https://github.com/nextgis/nextgisweb_frontend/blob/master/packages/${x.fileName}#L${x.line}`;
    return `<a href="${link}" target="_blank">${x.fileName}#L${x.line}</a>`;
  });
}

export function getParameterName(parameter: Parameter) {
  return `${parameter.name}${parameter.flags.isOptional ? '?' : ''}`;
}

export function getSignatureParameters(parameters: Parameter[], indexes: Indexes): string[] {
  return parameters.map((p) => {
    const typeName = getOptionType(p.type, indexes);
    return `${getParameterName(p)}${typeName ? ': ' + typeName : ''}`;
  });
}

export function getConstructorSignatureStr(item: ConstructorItem, indexes: Indexes) {
  return item && item.signatures.map((x) => {
    return getSignatureStrForConstructor(x, indexes);
  });
}

export function getSignatureStrForConstructor(signatures: Signatures, indexes: Indexes) {
  if ('parameters' in signatures) {
    // const parameters = getSignatureParameters(signatures.parameters, indexes);
    const parameters = signatures.parameters.map((p) => {
      return `${getParameterName(p)}`;
    });
    const str = `${signatures.name}(${parameters.join(', ')})`;
    return str;
  }
}

export function getOptionType(option: Property, indexes: Indexes): string {
  if (option.type === 'union') {
    return option.types.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(' | ');
  } else if (option.type === 'intrinsic') {
    if (option.name !== 'undefined') {
      return option.name;
    }
  } else if (option.type === 'tuple') {
    return `[${option.elements.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(', ')}]`;
  } else if (option.type === 'reference') {
    return createReference(option, indexes);
  } else if (option.type === 'reflection') {
    return createDeclarationStr(option, indexes);
  } else if (option.type === 'typeOperator') {
    return `keyof ${getOptionType(option.target, indexes)}`;
  }

  return '';
}

export function createReference(option: ReferencePropertyType, indexes: Indexes) {
  let str = '';
  const kindStringToLink: KindString[] = ['Interface', 'Class'];
  const refOption = indexes[option.id];

  const isHref = (ref) => {
    return ref && kindStringToLink.indexOf(ref.kindString) !== -1;
  };

  const createHref = (ref) => {
    return `<a href="${ref.module.name}-api#${option.name}">${option.name}</a>`;
  };

  if (refOption && refOption.type) {
    str += getOptionType(refOption.type, indexes);
  } else if (option.typeArguments) {
    let name = option.name;
    if (option.type === 'reference' && isHref(refOption)) {
      name = createHref(refOption);
    }
    const args = option.typeArguments.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(' | ');
    str += `${name}${args ? `< ${args} >` : ''}`;
  } else if (isHref(refOption)) {
    return createHref(refOption);
  } else if (refOption && refOption.kindString === 'Function') {
    return createMethodString(refOption as FunctionItem, indexes);
  } else {
    return option.name;
  }
  return str;
}

export function getDeclarationSignatureStr(signatures: Signatures, indexes: Indexes) {
  if ('parameters' in signatures) {
    const parameters = getSignatureParameters(signatures.parameters, indexes);
    const str = `{ [${parameters.join(', ')}]: ${getOptionType(signatures.type, indexes)} }`;
    return str;
  }
}

export function createDeclarationStr(option: ReflectionType, indexes: Indexes) {
  let str = '';
  if (option.declaration.name === '__type') {
    if (option.declaration) {
      if (option.declaration.indexSignature) {
        const signatures = option.declaration.indexSignature;
        str += signatures.map((x) => {
          return getDeclarationSignatureStr(x, indexes);
        });
      } else if (option.declaration.children) {
        const defs = option.declaration.children.map((x) => {
          return `${getParameterName(x)}: ${getOptionType(x.type, indexes)}`;
        });
        str += `{ ${defs.join(', ')} }`;
      }
    }
  }
  return str;
}

export function createMethodString(methodItem: MethodItem | FunctionItem, indexes: Indexes): string {
  const signatures = methodItem.signatures.map((x) => {
    if ('parameters' in x) {
      // const args = getSignatureParameters(x.parameters, indexes).join(', ');
      const args = x.parameters.map((p) => {
        return `${getParameterName(p)}`;
      }).join(', ');
      return `(${args})`; // : ${getOptionType(x.type, indexes)}`;
    }
  }).join(', ');
  return `${methodItem.name}${signatures || '()'}`;
}

export function createMethodTypeString(methodItem: MethodItem | FunctionItem, indexes: Indexes): string {
  const signatures = methodItem.signatures.map((x) => {
    if ('parameters' in x) {
      const args = getSignatureParameters(x.parameters, indexes).join(', ');
      return `(${args}): ${getOptionType(x.type, indexes)}`;
    }
  }).join(', ');
  return `${signatures || '()'}`;
}
