import NgwMap from '@nextgis/ngw-ol';

const ID = 'layer-id';
const logBlock = document.getElementById('log');
const log = (msg) => {
  logBlock.innerHTML = '<p>' + msg + '</p>' + logBlock.innerHTML;
  console.log(msg);
};

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then((ngwMap) => {
  const emitter = /** @type {import('events').EventEmitter} */ (ngwMap.emitter);
  ngwMap.addNgwLayer({
    id: ID,
    resource: 4224,
    fit: true,
    adapterOptions: {
      limit: 100,
      onClick: (e) => {
        log('click - from options');
      },
      onDoubleClick: (e) => {
        log('dblclick - from options');
      },
      onMouseOver: (e) => {
        log('mouseover - from options');
      },
      onMouseOut: (e) => {
        log('mouseout - from options');
      },
    },
  });

  emitter.on('layer-' + ID + ':click', (ev) => {
    log('click -- from specific layer emitter');
  });
  emitter.on('layer-' + ID + ':dblclick', (ev) => {
    log('dblclick -- from specific layer emitter');
  });

  emitter.on('layer-' + ID + ':mouseover', (ev) => {
    log('mouseover -- from specific layer emitter');
  });

  emitter.on('layer-' + ID + ':mouseout', (ev) => {
    log('mouseout -- from specific layer emitter');
  });

  ngwMap.emitter.on('layer:click', (ev) => {
    if (ev.layer.id === ID) {
      log('click --- from global emitter');
    }
  });
  ngwMap.emitter.on('layer:dblclick', (ev) => {
    if (ev.layer.id === ID) {
      log('dblclick --- from global emitter');
    }
  });
  ngwMap.emitter.on('layer:mouseover', (ev) => {
    if (ev.layer.id === ID) {
      log('mouseover --- from global emitter');
    }
  });
  ngwMap.emitter.on('layer:mouseout', (ev) => {
    if (ev.layer.id === ID) {
      log('mouseout --- from global emitter');
    }
  });
});
