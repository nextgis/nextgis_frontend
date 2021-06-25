import { expect } from 'chai';
import sinon from 'sinon';
import Cache from '../../packages/cache/src';
import CancelablePromise from '../../packages/cancelable-promise/src';
import sleep from '../helpers/utils/asyncTimeout';

describe(`Cache`, () => {
  beforeEach(() => {
    const cache = new Cache();
    cache.clean();
  });
  it(`add value`, () => {
    const cache = new Cache();
    cache.add('test', 'test');
    const fromCache = cache.match('test');
    expect(fromCache).to.eql('test');
  });
  it(`add value from callback`, () => {
    const cache = new Cache();
    let callCount = 0;
    const cb = () => {
      callCount++;
      return 'test';
    };
    cache.add('test', cb);
    const onAdd = cache.add('test', cb);
    const fromCache = cache.match('test');
    expect(fromCache).to.eql('test');
    expect(onAdd).to.eql('test');
    expect(callCount).to.eql(1);
  });
  it(`add promise`, () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    cache.add('test', cb);
    const fromCache = cache.match('test');
    expect(fromCache instanceof Promise).to.be.true;
  });
  it(`add promise`, () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    const onAdd = cache.add('test', cb);
    expect(onAdd instanceof Promise).to.be.true;
  });
  it(`add promise`, async () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    const onAdd = await cache.add('test', cb);
    expect(onAdd).to.be.equal('test');
  });
  it(`add options with promise`, (done) => {
    const cache = new Cache();
    const spy = sinon.spy();
    const cb = () => {
      return sleep(10).then(() => {
        spy();
      });
    };
    Promise.all([
      cache.add('test', cb),
      cache.add('test', cb, { id: 1 }),
      cache.add('test', cb, { id: 1 }),
      cache.add('test', cb, { id: 2 }),
      cache.add('test', cb, { id: 2 }),
    ]).then(() => {
      if (spy.callCount === 3) {
        done();
      }
    });
  });
  it(`match promise immediately`, () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    cache.add('test', cb);
    const fromCache = cache.match('test');
    expect(fromCache instanceof Promise).to.be.true;
  });
  it(`match promise on resolve`, async () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    const onAdd = cache.add('test', cb);
    await sleep(10);
    const fromCache = cache.match('test');
    expect(fromCache instanceof Promise).to.be.true;
    await sleep(30);
    const fromCacheOnRes = cache.match('test') as Promise<string>;
    expect(fromCacheOnRes instanceof Promise).to.be.true;
    expect(onAdd instanceof Promise).to.be.true;
    const valOnRes = await fromCacheOnRes;
    const valOnAdd = await onAdd;
    expect(valOnRes).to.be.equal('test');
    expect(valOnAdd).to.be.equal('test');
  });

  it(`delete promise`, async () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => 'test');
    };
    const onAdd = cache.add('test', cb);
    cache.delete('test');
    const fromCache = cache.match('test');
    expect(fromCache).to.be.undefined;
    const val = await onAdd;
    const fromCache2 = cache.match('test');
    expect(val).to.be.equal('test');
    expect(fromCache2).to.be.undefined;
  });

  it(`add promise error`, async () => {
    const cache = new Cache();
    const cb = () => {
      return sleep(20).then(() => {
        throw new Error('error');
      });
    };
    const onAdd = cache.add('test', cb);
    const fromCache = cache.match('test');
    try {
      await onAdd;
    } catch (er) {
      expect(er.message).to.be.equal('error');
    }
    try {
      await fromCache;
    } catch (er) {
      expect(er.message).to.be.equal('error');
    }
  });

  it(`add cancelable promise`, (done) => {
    const cache = new Cache();
    const cb = () => {
      return new CancelablePromise((resolve) =>
        sleep(30).then(() => resolve('test')),
      );
    };
    const onAdd = cache.add('test', cb) as CancelablePromise;
    const fromCache = cache.match('test');
    expect(onAdd instanceof CancelablePromise).to.be.true;
    expect(fromCache instanceof CancelablePromise).to.be.true;
    onAdd.catch((er) => {
      if (er.name === 'CancelError') {
        const fromCacheOnCancel = cache.match('test');
        expect(fromCacheOnCancel).to.be.undefined;
        done();
      }
    });
    onAdd.cancel();
  });

  it(`add callback`, (done) => {
    const cache = new Cache();
    let callCount = 0;
    const makePromise = function () {
      return new Promise((resolve) => {
        sleep(20).then(() => resolve(callCount++));
      });
    };
    Promise.all([
      cache.add('key', makePromise),
      cache.add('key', makePromise, { id: 1 }),
      cache.add('key', makePromise, { id: 1 }),
      cache.add('key', makePromise, { id: 2 }),
      cache.add('key', makePromise, { id: 2 }),
    ])
      .then((resp) => {
        return expect(resp).deep.equal([0, 1, 1, 2, 2]);
      })
      .then(() => done(), done);
  });
  it(`match all`, (done) => {
    const cache = new Cache();
    let callCount = 0;
    const makePromise = function () {
      return new Promise((resolve) => {
        sleep(20).then(() => resolve(callCount++));
      });
    };
    cache.add('key', makePromise); // added to cache
    cache.add('key', makePromise, { id: 1 }); // added to the cache
    cache.add('key', makePromise, { id: 1 }); // NOT added to the cache
    cache.add('key', makePromise, { id: 2 }); // added to the cache
    cache.add('key', makePromise, { id: 2 }); // NOT added to the cache
    Promise.all(cache.matchAll('key'))
      .then((resp) => {
        return expect(resp).deep.equal([0, 1, 2]);
      })
      .then(() => done(), done);
  });
});
