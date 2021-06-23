import { expect } from 'chai';
import sinon from 'sinon';
import CancelablePromise from '../../packages/cancelable-promise/src';

const getPromise = (delay = 0) =>
  new CancelablePromise((resolve) => {
    setTimeout(() => resolve(), delay);
  });

const getCatchPromise = () =>
  new CancelablePromise((resolve, reject) => {
    setTimeout(() => reject());
  });

describe('CancelablePromise', () => {
  it(`then`, (done) => {
    getPromise().then((e) => {
      done();
    });
  });

  it(`catch`, (done) => {
    getCatchPromise().catch(() => {
      done();
    });
  });

  it(`catch canceled`, (done) => {
    getCatchPromise()
      .catch((er) => {
        if (er.name === 'CancelError') {
          done();
        }
      })
      .cancel();
  });

  it(`finally`, async () => {
    const spy = sinon.spy();
    await getPromise()
      .then(() => {
        spy();
      })
      .catch(() => {
        spy();
      })
      .finally(() => {
        spy();
      });
    expect(spy.callCount).to.eq(2);
  });

  it(`finally after catch`, async () => {
    const spy = sinon.spy();
    await getCatchPromise()
      .then(() => {
        spy();
      })
      .catch(() => {
        spy();
      })
      .finally(() => {
        spy();
      });
    expect(spy.callCount).to.eq(2);
  });

  it(`canceled`, (done) => {
    const promise = getPromise().catch((er) => {
      if (er.name === 'CancelError') {
        done();
      }
    });
    promise.cancel();
  });

  it(`canceled after then`, (done) => {
    const promise = getPromise()
      .then((data) => {
        return true;
      })
      .catch((er) => {
        if (er.name === 'CancelError') {
          done();
        }
      });
    promise.cancel();
  });

  it(`catch after cancel`, (done) => {
    const promise = getPromise()
      .then((data) => {
        return true;
      })
      .then((data) => {
        return true;
      });

    promise.cancel();

    promise.catch((er) => {
      if (er.name === 'CancelError') {
        done();
      }
    });
  });

  it(`throw CancelError immediately`, (done) => {
    const t1 = performance.now();
    const promise = getPromise(300).catch(() => {
      const t2 = performance.now();
      const dt = t2 - t1;
      if (dt < 100) {
        done();
      }
    });
    promise.cancel();
  });

  it(`canceled after chain`, (done) => {
    const spy = sinon.spy();
    const thenSpy = sinon.spy();
    const promise = getPromise().catch((er) => {
      if (er.name === 'CancelError') {
        spy();
      }
      if (spy.callCount === 2 && !thenSpy.called) {
        done();
      }
    });
    const promise2 = promise
      .then(() => thenSpy())
      .catch((er) => {
        if (er.name === 'CancelError') {
          spy();
        }
        if (spy.callCount === 2 && !thenSpy.called) {
          done();
        }
      });
    promise2.cancel();
  });

  it(`attach cancelable promise`, (done) => {
    const promise = new CancelablePromise((resolve, reject) => {
      resolve(
        getPromise().catch((er) => {
          if (er.name === 'CancelError') {
            done();
          }
        }),
      );
    });

    promise.cancel();
  });

  it(`handle onCancel`, (done) => {
    const promise = new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        done();
      });
    });
    promise.cancel();
  });
});
