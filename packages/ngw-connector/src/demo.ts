const ID = 'layer-id';
const logBlock = document.getElementById('log');
const log = function (msg) {
  logBlock.innerHTML = '<p>' + msg + '</p>' + logBlock.innerHTML;
  console.log(msg);
};

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    id: ID,
    resource: 4222,
    fit: true,
    adapterOptions: {
      limit: 100,
      onClick: function (e) {
        log('`click` - from options');
      },
      onMouseOver: function (e) {
        log('`mouseover` - from options');
      },
      onMouseOut: function (e) {
        log('`mouseout` - from options');
      },
    },
  });

  ngwMap.emitter.on('layer-' + ID + ':click', function (ev) {
    log('`click` -- from specific layer emitter');
  });

  ngwMap.emitter.on('layer-' + ID + ':mouseover', function (ev) {
    log('`mouseover` -- from specific layer emitter');
  });

  ngwMap.emitter.on('layer-' + ID + ':mouseout', function (ev) {
    log('`mouseout` -- from specific layer emitter');
  });

  ngwMap.emitter.on('layer:click', function (ev) {
    if (ev.layer.id === ID) {
      log('`click` --- from global emitter');
    }
  });
  ngwMap.emitter.on('layer:mouseover', function (ev) {
    if (ev.layer.id === ID) {
      log('`mouseover` --- from global emitter');
    }
  });
  ngwMap.emitter.on('layer:mouseout', function (ev) {
    if (ev.layer.id === ID) {
      log('`mouseout` --- from global emitter');
    }
  });
});
