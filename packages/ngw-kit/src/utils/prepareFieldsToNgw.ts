import type { FeatureProperties } from '@nextgis/utils';

export function prepareFieldsToNgw<
  T extends FeatureProperties = FeatureProperties,
>(
  item: T,
  resourceFields: Pick<FeatureProperties, 'keyname' | 'datatype'>[],
): Record<keyof T, any> {
  const fields = {} as Record<keyof T, any>;
  if (item) {
    resourceFields.forEach((x) => {
      if (x.keyname in item) {
        const keyname = x.keyname;
        const prop = item[keyname];
        let value: any;
        if (prop !== undefined) {
          if (x.datatype === 'STRING') {
            value = prop ? String(prop) : null;
            // TODO: remove after v 3.0.0. For backward compatibility
            if (value === 'null') {
              value = null;
            }
          } else if (x.datatype === 'BIGINT' || x.datatype === 'INTEGER') {
            value = typeof prop === 'string' ? parseInt(prop, 10) : prop;
          } else if (x.datatype === 'REAL') {
            value = typeof prop === 'string' ? parseFloat(prop) : prop;
          } else if (x.datatype === 'BOOLEAN') {
            value =
              typeof prop === 'boolean' || typeof prop === 'number'
                ? Number(!!prop)
                : null;
          } else if (x.datatype === 'DATE' || x.datatype === 'DATETIME') {
            let dt: Date | undefined;
            if (typeof prop === 'object' && !((prop as any) instanceof Date)) {
              value = prop;
            } else {
              if ((prop as any) instanceof Date) {
                dt = prop as any;
              } else {
                const parse = Date.parse(String(prop));
                if (parse) {
                  dt = new Date(parse);
                }
              }
              if (dt) {
                value = {
                  year: dt.getFullYear(),
                  month: dt.getMonth(),
                  day: dt.getDay(),
                };
                if (x.datatype === 'DATETIME') {
                  value.hour = dt.getHours();
                  value.minute = dt.getMinutes();
                  value.second = dt.getSeconds();
                }
              }
            }
          }
        }
        fields[keyname as keyof T] = value ?? null;
      }
    });
  }
  return fields;
}
