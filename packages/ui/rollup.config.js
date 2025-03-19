import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';

export default defineConfig({
    input: 'packages/ui/src/index.ts',
    output: [
        {
            file: 'dist/packages/ui/index.mjs',
            format: 'esm',
            sourcemap: true
        },
        {
            file: 'dist/packages/ui/index.cjs',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/packages/ui/index.umd.js',
            format: 'umd',
            name: 'SemantykUI',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM'
            },
            sourcemap: true
        }
    ],
    external: ['react', 'react-dom'],
    plugins: [
        swc({
            jsc: {
                parser: {
                    syntax: 'typescript',
                    tsx: true
                }
            }
        })
    ]
});