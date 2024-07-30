import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import nodeExternals from 'rollup-plugin-node-externals'

const inputs = {
  app: 'app/**/*.ts',
  core: 'core/**/*.ts',
}

export default Object.entries(inputs).map(([name, input]) => ({
	input,
	output: [
    { format: 'es', file: `.stone/${name}.js` }
  ],
  plugins: [
    multi(),
    nodeExternals(), // Must always be before `nodeResolve()`.
    nodePolyfills({ include: ['events'], sourceMap: true }),
    nodeResolve({
      extensions: ['.js', '.mjs', '.ts'],
      exportConditions: ['node', 'import', 'require', 'default']
    }),
    json(),
    commonjs(),
    babel({
      babelrc: false,
      configFile: false,
      babelHelpers: 'bundled',
      extensions: ['.js', '.mjs', '.ts'],
      presets: [
        '@babel/preset-typescript'
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
      ]
    })
  ]
}))