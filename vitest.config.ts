import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Prefer sibling source when checked out alongside this repo (local dev); else the
// published @sudobility/characterbuilder_{types,client} from node_modules.
const alias: Record<string, string> = {};
const types = fileURLToPath(
  new URL('../characterbuilder_types/src/index.ts', import.meta.url)
);
const client = fileURLToPath(
  new URL('../characterbuilder_client/src/index.ts', import.meta.url)
);
if (existsSync(types)) alias['@sudobility/characterbuilder_types'] = types;
if (existsSync(client)) alias['@sudobility/characterbuilder_client'] = client;

export default defineConfig({
  resolve: { alias },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    environment: 'node',
    testTimeout: 15000,
  },
});
