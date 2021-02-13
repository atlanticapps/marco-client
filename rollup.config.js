import pkg from './package.json';
import {terser} from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const extensions = ['.js', '.ts'];

const name = 'marco';

export default {
    input: './src/index.ts',
    external: [
        'rxjs', 'rxjs/operators'
    ],
    plugins: [
        resolve({extensions}),
        babel({
            extensions,
            babelHelpers: 'bundled',
            include: ['src/**/*'],
        }),
        terser()
    ],
    output: [{
        file: pkg.main,
        format: 'cjs',
    }, {
        file: pkg.browser,
        format: 'umd',
        globals: {
            rxjs: 'rxjs',
            'rxjs/operators': 'rxjs.operators'
        },
        name
    }, {
        file: pkg.umd,
        format: 'umd',
        globals: {
            rxjs: 'rxjs',
            'rxjs/operators': 'rxjs.operators'
        },
        name,
    }],
};
