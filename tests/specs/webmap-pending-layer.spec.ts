import { expect } from 'chai';

import { WebMap } from '@nextgis/webmap';

import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';

import type { AdapterOptions, MainLayerAdapter } from '@nextgis/webmap';

function deferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((done) => {
    resolve = done;
  });

  return { promise, resolve };
}

describe('WebMap pending layer cleanup', () => {
  let map: WebMap;
  let container: HTMLDivElement;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    map = new WebMap({
      mapAdapter: new FakeMapAdapter(),
      target: container,
      create: false,
    });

    await map.create();
  });

  afterEach(() => {
    map.destroy();
    container.remove();
  });

  it('defers native cleanup until an in-flight add finishes', async () => {
    const ready = deferred<object>();
    const started = deferred<void>();

    let removed = 0;
    let before = 0;
    let added = 0;

    class Slow implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        started.resolve(undefined);
        return ready.promise;
      }

      beforeRemove() {
        before++;
      }

      removeLayer() {
        removed++;
      }
    }

    map.emitter.on('layer:add', () => added++);

    const promise = map.addLayer(Slow, {
      id: 'slow',
      visibility: false,
    });

    await started.promise;

    map.removeLayer('slow');

    expect(removed).to.equal(0);
    expect(before).to.equal(1);
    expect(map.getLayer('slow')).to.be.undefined;

    ready.resolve({});

    expect(await promise).to.be.instanceOf(Slow);

    expect(removed).to.equal(1);
    expect(before).to.equal(1);
    expect(added).to.equal(0);
    expect(map.getLayers()).not.to.include('slow');
  });

  it('does not create native resources after removal before map load', async () => {
    const earlyTarget = document.createElement('div');
    document.body.appendChild(earlyTarget);

    const early = new WebMap({
      mapAdapter: new FakeMapAdapter(),
      target: earlyTarget,
      create: false,
    });

    let created = 0;
    let removed = 0;

    class Slow implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        created++;
        return {};
      }

      removeLayer() {
        removed++;
      }
    }

    try {
      const promise = early.addLayer(Slow, {
        id: 'waiting',
        visibility: false,
      });

      early.removeLayer('waiting');

      await early.create();
      await promise;

      expect(created).to.equal(0);
      expect(removed).to.equal(0);
      expect(early.getLayer('waiting')).to.be.undefined;
    } finally {
      early.destroy();
      earlyTarget.remove();
    }
  });

  it('rejects duplicate ID without removing the existing layer', async () => {
    let removed = 0;
    let duplicateCreated = 0;

    class Old implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        return {};
      }

      removeLayer() {
        removed++;
      }
    }

    class New implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        duplicateCreated++;
        return {};
      }
    }

    const old = await map.addLayer(Old, {
      id: 'same',
      visibility: false,
    });

    let error: unknown;

    try {
      await map.addLayer(New, {
        id: 'same',
        visibility: false,
      });
    } catch (caught) {
      error = caught;
    }

    expect(error).to.be.instanceOf(Error);
    expect((error as Error).message).to.equal(
      "layer with id 'same' already exist",
    );

    expect(map.getLayer('same')).to.equal(old);
    expect(removed).to.equal(0);
    expect(duplicateCreated).to.equal(0);
  });

  it('rejects duplicate ID while the first layer is loading', async () => {
    const ready = deferred<object>();
    const started = deferred<void>();

    let removed = 0;
    let duplicateCreated = 0;

    class Old implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        started.resolve(undefined);
        return ready.promise;
      }

      removeLayer() {
        removed++;
      }
    }

    class New implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        duplicateCreated++;
        return {};
      }
    }

    const loading = map.addLayer(Old, {
      id: 'same',
      visibility: false,
    });

    await started.promise;

    let error: unknown;

    try {
      await map.addLayer(New, {
        id: 'same',
        visibility: false,
      });
    } catch (caught) {
      error = caught;
    }

    expect(error).to.be.instanceOf(Error);
    expect((error as Error).message).to.equal(
      "layer with id 'same' already exist",
    );

    expect(removed).to.equal(0);
    expect(duplicateCreated).to.equal(0);

    ready.resolve({});

    const old = await loading;

    expect(map.getLayer('same')).to.equal(old);
    expect(removed).to.equal(0);
  });

  it('allows reusing ID after removing a loading layer', async () => {
    const ready = deferred<object>();
    const started = deferred<void>();

    let removed = 0;

    class Old implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        started.resolve(undefined);
        return ready.promise;
      }

      removeLayer() {
        removed++;
      }
    }

    class New implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        return {};
      }
    }

    const loading = map.addLayer(Old, {
      id: 'same',
      visibility: false,
    });

    await started.promise;

    map.removeLayer('same');

    expect(map.getLayer('same')).to.be.undefined;
    expect(removed).to.equal(0);

    const current = await map.addLayer(New, {
      id: 'same',
      visibility: false,
    });

    expect(map.getLayer('same')).to.equal(current);

    ready.resolve({});
    await loading;

    expect(map.getLayer('same')).to.equal(current);
    expect(removed).to.equal(1);
  });

  it('waits for an asynchronous show before removing its native object', async () => {
    const show = deferred<void>();
    const started = deferred<void>();

    let removed = 0;
    let added = 0;

    class SlowShow implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer() {
        return {};
      }

      showLayer() {
        started.resolve(undefined);
        return show.promise;
      }

      removeLayer() {
        removed++;
      }
    }

    map.emitter.on('layer:add', () => added++);

    const promise = map.addLayer(SlowShow, {
      id: 'show',
    });

    await started.promise;

    map.removeLayer('show');

    expect(removed).to.equal(0);
    expect(map.getLayer('show')).to.be.undefined;

    show.resolve(undefined);
    await promise;

    expect(removed).to.equal(1);
    expect(added).to.equal(0);
    expect(map.getLayer('show')).to.be.undefined;
  });

  it('still rejects genuine creation failures', async () => {
    class Broken implements MainLayerAdapter {
      options: AdapterOptions = {};

      addLayer(): Promise<object> {
        return Promise.reject(new Error('native failure'));
      }
    }

    let error: unknown;

    try {
      await map.addLayer(Broken, {
        id: 'broken',
        visibility: false,
      });
    } catch (caught) {
      error = caught;
    }

    expect(error).to.be.instanceOf(Error);
    expect((error as Error).message).to.equal('native failure');

    expect(map.getLayer('broken')).to.be.undefined;
    expect(map.getLayers()).not.to.include('broken');
  });
});
