import node from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { uglify } from 'rollup-plugin-uglify';

const pckg = require('./package');
const input = pckg.main + '.ts';

export default {
  external: ['ol'],
  input,
  output: [
      {file: pckg.main + '.js', format: 'umd', name: 'NgwKit', sourcemap: true}
  ],
  plugins: [builtins(), typescript(),  commonjs(), node(), sourcemaps()]
  // plugins: [typescript(), builtins(), commonjs(), node(), uglify()]
}
