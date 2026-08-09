import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: './dist',
  format: 'esm',
  external: ['react', 'react-dom', 'next', 'lucide-react'],
});
