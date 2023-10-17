import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

import packageJson from './package.json' assert { type: "json" };

/**
 * usually you have a package.json in the root (package configuration)
 * and a rollup.config.js in the root (compiler configuration)
 * index.ts (source code)
 * tsconfig.json (TypeScript configuration)
 * 
 * -> index.js
 * 
 * import Toast, { setToastMessage } from 'remix-toasted-react';
 * 
 * server code => node code (toast cookie logic)
 * React code (server+client) => React code (toast cookie logic)
 */
export default {
    input: 'src/index.tsx',
    output: [
        {
            file: packageJson.main,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [peerDepsExternal(), typescript()],
};
