import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

import packageJson from './package.json' assert { type: "json" };

export default {
    input: 'index.tsx',
    output: [
        {
            file: packageJson.main,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [peerDepsExternal(), typescript()],
};


