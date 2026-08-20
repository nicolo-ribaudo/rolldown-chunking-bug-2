// Which rolldown chunk-optimization pass is responsible? Toggle each one on the same graph.
// Both passes are enabled by default (experimental.chunkOptimization); the split only
// disappears when neither pass runs into its order-dependence, which never happens here.
import { rolldown } from 'rolldown';
import path from 'node:path';

const input = path.join(import.meta.dirname, 'src/entry.js');
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

for (const [label, chunkOptimization] of [
  ['default (both passes on)', undefined],
  ['avoidRedundantChunkLoads: false', { avoidRedundantChunkLoads: false }],
  ['mergeCommonChunks: false', { mergeCommonChunks: false }],
  ['chunkOptimization: false', false],
]) {
  const b = await rolldown({ input, experimental: chunkOptimization === undefined ? {} : { chunkOptimization } });
  console.log(`### ${label}\n${summarize((await b.generate(outputOptions)).output)}`);
  await b.close();
}
