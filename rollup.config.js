import commonjs from 'rollup-plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'RTEventClient';

export default {
    input: './src/index.ts',
// Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
// https://rollupjs.org/guide/en#external-e-external
    external: [
        'rxjs'
    ],
    plugins: [
// Allows node_modules resolution
        resolve({jsnext: true, extensions}),
        commonjs({include: 'node_modules/**'}),
        typescript2(),
        babel({extensions, include: ['src/**/*']}),
        minify()
    ],

    output: [{
        file: pkg.main,
        format: 'cjs',
    }, {
        file: pkg.module,
        format: 'es',
    }, {
        file: pkg.browser,
        format: 'umd',
        name
    }, {
        file: pkg.umd,
        format: 'umd',
        name,
    }],
};
