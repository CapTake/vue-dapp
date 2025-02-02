import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
import path from 'path'

import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      vue({
        target: 'browser',
        preprocessStyles: true,
        css: false,
        compileTemplate: true,
      }),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationMap: false,
          },
          exclude: ['tests', 'demo'],
        },
      }),
      replace({
        NODE_ENV: JSON.stringify('production'),
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true, // prevent build warning
      }),
      postcss(),
      peerDepsExternal(),
      json(), // for abi .json files
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'esm' }],
    plugins: [
      dts(),
      vue({
        target: 'browser',
        preprocessStyles: true,
        css: false,
        compileTemplate: true,
      }),
      json(), // for abi .json files
    ],
  },
]
