import * as esbuild from 'esbuild';
import { readdirSync, statSync, copyFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: './dist',
  format: 'esm',
  external: ['react', 'react-dom', 'next', 'lucide-react'],
});

// This package has no stylesheet of its own -- design tokens and the
// Tailwind utility/component classes these components use (arf-card-light,
// --color-arf-blue, etc.) live in the consuming app's globals.css, compiled
// by Next/Tailwind at the app level. Copy the app's compiled CSS chunk so
// there's a real stylesheet to point cfg.cssEntry at. Requires `next build`
// to have run at the repo root first (Turbopack content-hashes the filename,
// so pick the largest .css chunk rather than a fixed name).
//
// Preserve Next's own chunks/ + media/ sibling layout (dist/chunks/styles.css
// + dist/media/*.woff2) so the CSS's own `../media/<hash>.woff2` @font-face
// url()s resolve without rewriting a single byte of the stylesheet -- next/font
// self-hosts these fonts at the app level with content-hashed filenames, and
// they don't exist anywhere the design-sync converter would find them on its
// own (they're not shipped by this package, "@arf/ui", at all).
const chunksDir = '../../.next/static/chunks';
const mediaDir = '../../.next/static/media';
try {
  const cssFiles = readdirSync(chunksDir).filter((f) => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.warn('! no .css files in .next/static/chunks -- run `next build` at the repo root first');
  } else {
    const largest = cssFiles
      .map((f) => ({ f, size: statSync(join(chunksDir, f)).size }))
      .sort((a, b) => b.size - a.size)[0].f;
    mkdirSync('./dist/chunks', { recursive: true });
    copyFileSync(join(chunksDir, largest), './dist/chunks/styles.css');
    console.log(`Copied ${largest} -> dist/chunks/styles.css`);

    const css = readFileSync('./dist/chunks/styles.css', 'utf8');
    const fontRefs = [...css.matchAll(/\.\.\/media\/([^)'"]+\.woff2)/g)].map((m) => m[1]);
    const uniqueFonts = [...new Set(fontRefs)];
    if (uniqueFonts.length > 0) {
      mkdirSync('./dist/media', { recursive: true });
      let copied = 0;
      for (const file of uniqueFonts) {
        try {
          copyFileSync(join(mediaDir, file), join('./dist/media', file));
          copied++;
        } catch {
          console.warn(`! font file not found: ${file} (referenced by the CSS but missing from .next/static/media)`);
        }
      }
      console.log(`Copied ${copied}/${uniqueFonts.length} referenced font file(s) -> dist/media/`);
    }
  }
} catch (err) {
  console.warn(`! could not copy app styles (${err.message}) -- run \`next build\` at the repo root first`);
}
