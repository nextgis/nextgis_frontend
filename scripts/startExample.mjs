import fs from 'node:fs';
import path from 'node:path';

import { createServer } from 'vite';

import { getExampleRequest } from './exampleUtils.mjs';
import { createExampleViteConfig } from './exampleViteConfig.mjs';

const { examplePath: root, adapter } = getExampleRequest();
if (!root) {
  throw new Error('Example path is required');
}
if (!fs.existsSync(path.join(root, 'index.html'))) {
  throw new Error(`Example index.html not found in ${root}`);
}

const server = await createServer({
  ...createExampleViteConfig(root, adapter),
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    open: true,
  },
});

await server.listen();
server.printUrls();
server.bindCLIShortcuts({ print: true });
