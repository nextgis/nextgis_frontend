import node from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';

const pckg = require('./package');
const input = pckg.main + '.ts';

export default {
  // external: [
  //   'ol',
  //   'ol/source/ImageWMS',
  //   'ol/layer/Image',
  //   'ol/layer/Tile',
  //   'ol/Map',
  //   'ol/proj',
  //   'ol/source/OSM',
  //   'ol/View',
  //   'ol/geom/Point.js',
  //   'ol/Feature.js',
  //   'ol/style.js',
  //   'ol/source/Vector.js',
  //   'ol/layer.js',

  //   'ol/source/ImageWMS.js',
  //   'ol/layer/Image.js',
  //   'ol/source/OSM.js',
  //   'ol/layer/Tile.js',
  //   'ol/geom/Point.js',
  //   'ol/Feature.js',
  //   'ol/proj.js',
  //   'ol/layer.js',
  //   'ol/source/Vector.js',
  //   'ol/Map.js',
  //   'ol/View.js',
  // ],

  // globals: {
  //   'ol/source/ImageWMS':'ol/source/ImageWMS',
  //   'ol/layer/Image':'ol/layer/Image',
  //   'ol/source/OSM':'ol/source/OSM',
  //   'ol/layer/Tile':'ol/layer/Tile',
  //   'ol/geom/Point':'ol/geom/Point',
  //   'ol/Feature':'ol/Feature',
  //   'ol/proj':'ol/proj',
  //   'ol/layer':'ol/layer',
  //   'ol/source/Vector':'ol/source/Vector',
  //   'ol/Map':'ol/Map',
  //   'ol/View':'ol/View',
  // },
  external: function (a) {
    return a.indexOf('node_modules/ol') >= 0;
  },
  input,
  output: [
    { file: pckg.main + '.js', format: 'umd', name: 'OlMapAdapter', sourcemap: true }
  ],
  plugins: [builtins(), typescript(), commonjs(), node(), sourcemaps()]
  // plugins: [typescript(), builtins(), commonjs(), node(), uglify()]
}
