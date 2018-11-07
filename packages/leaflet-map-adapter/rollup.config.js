import node from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';
const path = require('path');

const globals = {
  'lefalet': 'L'
}

const pckg = require('./package');
const input = 'src/leaflet-map-adapter.ts';

export default {
  // external: id => id.indexOf('ol') !== -1 && !(path.isAbsolute(id) || id.startsWith(".")),
  external: ['leaflet', 'leaflet.wms'],
  input,
  output: [
    { file: pckg.main, format: 'umd', name: 'LeafletMapAdapter', sourcemap: true, globals }],
  watch: {
    include: 'src/**',
  },

  plugins: [
    // Allows the node builtins to be required/imported
    builtins(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    node(),
    // Resolve source maps to the original source
    sourcemaps(),
    // uglify()
  ],
}
