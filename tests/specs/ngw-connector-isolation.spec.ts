import { afterEach, describe, expect, it } from 'vitest';

import { removeConnector } from '../../packages/ngw-connector/src/activeConnectors';
import { NgwConnector } from '../../packages/ngw-connector/src/NgwConnector';

import type {
  NgwConnectorOptions,
  RequestTransformFunction,
} from '../../packages/ngw-connector/src/interfaces';

const baseUrl = 'https://connector-isolation.invalid';

describe('NgwConnector instance isolation', () => {
  const created = new Set<NgwConnector>();
  const create = (options: Omit<NgwConnectorOptions, 'baseUrl'> = {}) => {
    const connector = new NgwConnector({ baseUrl, ...options });
    created.add(connector);
    return connector;
  };

  afterEach(() => {
    for (const connector of created) {
      removeConnector(connector);
    }
    created.clear();
  });

  it('never reuses an authenticated connector for an anonymous caller', () => {
    const authenticated = create({
      auth: { login: 'alice', password: 'secret' },
    });
    const anonymous = create();

    expect(anonymous).not.to.equal(authenticated);
    expect(anonymous.options.auth).to.be.undefined;
  });

  it('never reuses an anonymous connector for an authenticated caller', () => {
    const anonymous = create();
    const authenticated = create({
      auth: { login: 'alice', password: 'secret' },
    });

    expect(authenticated).not.to.equal(anonymous);
    expect(authenticated.options.auth?.login).to.equal('alice');
  });

  it('reuses connectors only when credentials match', () => {
    const alice = create({ auth: { login: 'alice', password: 'one' } });
    const aliceAgain = create({ auth: { login: 'alice', password: 'one' } });
    const bob = create({ auth: { login: 'bob', password: 'two' } });
    const anonymous = create();
    const anonymousAgain = create();

    expect(aliceAgain).to.equal(alice);
    expect(bob).not.to.equal(alice);
    expect(anonymousAgain).to.equal(anonymous);
  });

  it('does not reuse connectors with different transport or cache options', () => {
    const basic = create();

    expect(create({ withCredentials: true })).not.to.equal(basic);
    expect(create({ withCredentials: false })).not.to.equal(basic);
    expect(create({ route: '/api/custom/route' })).not.to.equal(basic);
    expect(create({ cacheId: 'other-cache' })).not.to.equal(basic);
  });

  it('does not reuse connectors with a different request transform', () => {
    const transform: RequestTransformFunction = (url, options) => [
      url,
      options,
    ];
    const basic = create();
    const transformed = create({ requestTransform: transform });

    expect(transformed).not.to.equal(basic);
    expect(create({ requestTransform: transform })).to.equal(transformed);
  });

  it('tracks request-transform changes when deciding whether to reuse', () => {
    const transform: RequestTransformFunction = (url, options) => [
      url,
      options,
    ];
    const connector = create();
    connector.setRequestTransform(transform);

    const untransformed = create();
    expect(untransformed).not.to.equal(connector);
    expect(create({ requestTransform: transform })).to.equal(connector);

    connector.setRequestTransform(null);
    removeConnector(untransformed);
    expect(create()).to.equal(connector);
  });
});
