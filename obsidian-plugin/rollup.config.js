import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

const isProd = (process.env.BUILD === 'production');

export default {
  input: 'main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
  },
  external: ['obsidian'],
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !isProd }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !isProd
      },
      emitCss: true, // we'll handle CSS separately
    }),
    typescript({
      sourceMap: !isProd,
      inlineSources: !isProd
    }),
    nodeResolve({ browser: true }),
    commonjs(),
  ]
};
