import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: './dist/commonjs/LocalStorageDb.js',
      format: 'cjs',
      inlineDynamicImports: true,
      name: 'LocalStorageDb',
    },
    {
      file: './dist/umd/LocalStorageDb.js',
      format: 'umd',
      inlineDynamicImports: true,
      name: 'LocalStorageDb',
    }
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    commonjs()
  ]
};