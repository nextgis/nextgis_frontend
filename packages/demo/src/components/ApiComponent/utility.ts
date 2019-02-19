import { ConstructorItem } from './ApiItem';

export function getSignaturesStr(item: ConstructorItem) {
  return item && item.signatures.map((x) => {
    const parameters = x.parameters.map((p) => {
      return `${p.name}${p.flags.isOptional ? '?' : ''}: ${p.type.name}`;
    });
    const str = `${x.name}(${parameters.join(', ')})`;
    return str;
  });
}
