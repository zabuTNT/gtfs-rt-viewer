import {defineConfig} from 'vite';

export default defineConfig({
  'root': '.',
  'server': {
    'port': 5179,
    'open': true
  },
  'build': {
    'outDir': 'dist',
    'sourcemap': true
  }
});
