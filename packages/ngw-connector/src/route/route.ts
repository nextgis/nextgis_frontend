import { fixUrlStr, objectRemoveEmpty } from '@nextgis/utils';

import { generateUrl, request } from './request';

import type {
  RequestMethod,
  ResponseType,
  RouteName,
  RouteParameters,
  RouteQuery,
  RouteRequestOptions,
  RouteResp,
  RouteResults,
  ToReturn,
} from './type';
import type { NgwConnector } from '../NgwConnector';

function routeURL<N extends RouteName>(
  name: N,
  baseUrl: string,
  routeData: Record<string, string[]>,
  ...rest: RouteParameters[N]
): string {
  const [template, ...params] = routeData[name];
  const first = rest[0];

  let sub: string[];
  if (first === undefined) {
    sub = [];
  } else if (typeof first === 'object' && first !== null) {
    if (rest.length > 1) {
      throw new Error('Too many arguments for route(name, object)!');
    }
    sub = [];
    for (const [p, v] of Object.entries(first)) {
      sub[params.indexOf(p)] = String(v);
    }
  } else {
    sub = rest.map((v) => String(v));
  }

  return fixUrlStr(
    baseUrl +
      template.replace(/\{(\w+)\}/g, function (m, a) {
        const idx = parseInt(a);
        const value = sub[idx];
        if (value === undefined) {
          const msg = `Undefined parameter ${idx} in "${template}".`;
          throw new Error(msg);
        }
        return String(value);
      }),
  );
}

export function route<N extends RouteName>(
  name: N,
  connector: NgwConnector,
  ...rest: RouteParameters[N]
): RouteResults<N> {
  const result = {
    url: async (
      opt?: Pick<
        RouteRequestOptions<ResponseType, false, RouteQuery<N, 'get'>>,
        'query'
      >,
    ) => {
      const routeData = await connector.connect();
      const template = routeURL(
        name,
        connector.options.baseUrl ?? '',
        routeData,
        ...rest,
      );
      return generateUrl(template, opt?.query);
    },
  } as RouteResults<N>;
  const methods: RequestMethod[] = ['get', 'post', 'put', 'delete', 'patch'];
  for (const method of methods) {
    const methodResp = async <
      T = RouteResp<N, typeof method>,
      RT extends ResponseType = 'json',
      RU extends boolean = false,
    >(
      requestOptions?: RouteRequestOptions<
        RT,
        RU,
        RouteQuery<N, typeof method>
      >,
    ): Promise<ToReturn<T, RT, RU>> => {
      const { headers: optHeaders, ...restOpt } = requestOptions || {};
      const routeData = await connector.connect();
      const template = routeURL(
        name,
        connector.options.baseUrl ?? '',
        routeData,
        ...rest,
      );
      const headers = objectRemoveEmpty({
        ...connector.getAuthorizationHeaders(),
        ...(optHeaders ?? {}),
      });
      return request<T, RT, RU>(
        template,
        {
          headers,
          ...restOpt,
          method,
        },
        connector.cache,
      );
    };
    // Using 'unknown' for type assertion because all methods are actually written to 'result'
    (result[method] as unknown) = methodResp;
  }
  return result;
}
