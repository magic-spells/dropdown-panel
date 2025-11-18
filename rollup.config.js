import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;
const name = 'dropdown-panel';

// css processing configuration
const cssConfig = {
	extract: true,
	minimize: production,
	sourceMap: !production,
};

// rollup configuration
export default [
	// esm version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.esm.js`,
			format: 'es',
			sourcemap: !production,
		},
		plugins: [
			resolve(),
			postcss({
				...cssConfig,
				extract: `${name}.css`,
			}),
			copy({
				targets: [
					{
						src: 'src/dropdown-component.scss',
						dest: 'dist',
						rename: 'dropdown-panel.scss',
					},
				],
			}),
			!production &&
				serve({
					open: true,
					contentBase: ['dist', 'demo'],
					host: 'localhost',
					port: 3000,
				}),
		],
	},
	// cjs version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.cjs.js`,
			format: 'cjs',
			sourcemap: !production,
		},
		plugins: [
			resolve(),
			postcss({
				...cssConfig,
				extract: false,
			}),
		],
	},
	// umd version (for direct browser usage and more compatibility)
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.js`,
			format: 'umd',
			name: 'DropdownPanel',
			sourcemap: !production,
		},
		plugins: [
			resolve(),
			postcss({
				...cssConfig,
				extract: false,
			}),
		],
	},
	// minified umd version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.min.js`,
			format: 'umd',
			name: 'DropdownPanel',
			sourcemap: !production,
		},
		plugins: [
			resolve(),
			postcss({
				...cssConfig,
				extract: `${name}.min.css`,
			}),
			terser({
				format: {
					comments: false,
				},
			}),
			// Additional copy plugin at the end to copy files for GitHub Pages demo
			copy({
				targets: [
					{
						src: 'dist/dropdown-panel.esm.js',
						dest: 'demo',
					},
					{
						src: 'dist/dropdown-panel.esm.js.map',
						dest: 'demo',
					},
					{
						src: 'dist/dropdown-panel.min.css',
						dest: 'demo',
					},
				],
				hook: 'writeBundle', // Run this after all output files are written
			}),
		],
	},
];
