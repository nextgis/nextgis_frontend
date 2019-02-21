import {
  ConstructorItem,
  Property,
  ReferencePropertyType,
  ReflectionType,
  Signatures,
  Parameter,
  MethodItem,
  ApiItem
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
    const parameters = getSignatureParameters(signatures.parameters, indexes);
    const str = `${signatures.name}(${parameters.join(', ')})`;
    return str;
  }
}

export function getOptionType(option: Property, indexes: Indexes): string {
  let str = '';
  if (option.type === 'union') {
    str += option.types.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(' | ');
  } else if (option.type === 'intrinsic') {
    if (option.name !== 'undefined') {
      str += option.name;
    }
  } else if (option.type === 'tuple') {
    str += `[${option.elements.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(', ')}]`;
  } else if (option.type === 'reference') {
    str += createReference(option, indexes);
  } else if (option.type === 'reflection') {
    str += createDeclarationStr(option, indexes);
  }

  return str;
}

export function createReference(option: ReferencePropertyType, indexes: Indexes) {
  let str = '';
  const refOption = indexes[option.id];
  if (refOption && refOption.type) {
    str += getOptionType(refOption.type, indexes);
  } else if (option.typeArguments) {
    const args = option.typeArguments.map((x) => getOptionType(x, indexes)).filter((x) => !!x).join(' | ');
    str += `${option.name}<${args}>`;
  } else if (refOption && refOption.kindString === 'Interface') {
    return `<a href="${refOption.module.name}-api#${option.name}">${option.name}</a>`;
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

export function createMethodString(methodItem: MethodItem, indexes: Indexes): string {
  const signatures = methodItem.signatures.map((x) => {
    if ('parameters' in x) {
      const args = getSignatureParameters(x.parameters, indexes).join(', ');
      return `(${args})`; // : ${getOptionType(x.type, indexes)}`;
    }
  }).join(', ');
  return `${methodItem.name}${signatures || '()'}`;
}
