import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import nodeExternals from 'rollup-plugin-node-externals'

export default {
	input: './bootstrap.mjs',
	output: [{ format: 'es', file: 'dist/stone.js' }],
  plugins: [
    nodeExternals({ deps: false }), // Must always be before `nodeResolve()`.
    nodePolyfills({ include: ['events'], sourceMap: true }),
    nodeResolve({
      extensions: ['.js', '.mjs', '.ts'],
      exportConditions: ['node', 'import', 'require', 'default']
    }),
    json(),
    commonjs()
  ]
}