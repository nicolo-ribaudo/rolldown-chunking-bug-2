// Same input, same options: rolldown 1.2.5 emits `leaf` as a separate common chunk,
// rollup 4.62.4 inlines it into the entry chunk (everything is already loaded by `entry.js`).
//
// Usage: node repro.mjs          (default options)
//        node repro.mjs vite     (preserveEntrySignatures: false, like Vite's client build)
import { rolldown } from 'rolldown';
import { rollup } from 'rollup';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const input = path.join(import.meta.dirname, 'src/entry.js');
const inputOptions = process.argv[2] === 'vite' ? { preserveEntrySignatures: false } : {};
const outputOptions = { format: 'es', entryFileNames: '[name].js', chunkFileNames: '[name].js' };

const summarize = (output) =>
  output
    .filter((o) => o.type === 'chunk')
    .map(
      (c) =>
        `  ${c.fileName.padEnd(10)} ${(c.isEntry ? 'entry' : c.isDynamicEntry ? 'dynamic-entry' : 'COMMON').padEnd(14)}` +
        ` imports=[${c.imports.join(', ')}] modules=[${Object.keys(c.modules).map((m) => path.basename(m, '.js')).join(', ')}]`,
    )
    .sort()
    .join('\n');

const rd = await rolldown({ input, ...inputOptions });
console.log(`rolldown ${require('rolldown/package.json').version}:`);
console.log(summarize((await rd.generate(outputOptions)).output));
await rd.close();

const ru = await rollup({ input, ...inputOptions, onwarn() {} });
console.log(`rollup ${require('rollup/package.json').version}:`);
console.log(summarize((await ru.generate(outputOptions)).output));
await ru.close();
