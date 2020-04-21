import { expect } from 'chai';
import sinon from 'sinon';
import { CancelablePromise } from '../../packages/cancelable-promise/src';

const getPromise = () =>
  new CancelablePromise((resolve) => {
    setTimeout(() => resolve());
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
});
