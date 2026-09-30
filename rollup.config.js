import { rmSync } from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';

/*
 * Two builds that never touch each other's files:
 *
 *   npm run build  (rollup -c)          → dist/ only, no sourcemaps
 *   npm run dev    (rollup -c --watch)  → demo/dist/ only, with sourcemaps
 *
 * so switching between them leaves no churn in git.
 */
const dev = Boolean(process.env.ROLLUP_WATCH);
const name = 'dropdown-panel';

let distCleaned = false;

/**
 * Wipes dist once per production build, so nothing left over from an
 * older config can end up in the published tarball.
 */
const cleanDist = () => ({
	name: 'clean-dist',
	buildStart() {
		if (distCleaned) return;
		distCleaned = true;
		rmSync('dist', { recursive: true, force: true });
	},
});

/**
 * A css-only build still needs a javascript entry chunk. postcss
 * extracts the real stylesheet and leaves an empty stub behind; delete
 * it so it never ends up in the published tarball or the demo.
 * @param {string} file - path of the stub chunk
 */
const removeStub = (file) => ({
	name: 'remove-css-stub',
	writeBundle() {
		rmSync(file, { force: true });
		rmSync(`${file}.map`, { force: true });
	},
});

/**
 * cssnano 5 keeps the line break and indent of a descendant combinator
 * in a selector that prettier wrapped over several lines, so a .min.css
 * comes out multi-line. Fold those breaks into a single space first.
 * A raw newline cannot sit inside a quoted CSS string, so this is safe.
 */
const foldSelectorBreaks = () => ({
	postcssPlugin: 'fold-selector-breaks',
	Rule(rule) {
		rule.selector = rule.selector.replace(/\s*\n\s*/g, ' ');
	},
});
foldSelectorBreaks.postcss = true;

/**
 * One stylesheet build.
 * @param {Object} options - build options
 * @param {string} options.input - source css file
 * @param {string} options.dir - output directory
 * @param {string} options.file - output file name inside dir
 * @param {boolean} [options.minimize] - whether to minify
 * @param {boolean} [options.sourceMap] - whether to emit a sourcemap
 * @param {Array} [options.extraPlugins] - plugins appended to the build
 */
const cssBuild = ({
	input,
	dir,
	file,
	minimize = false,
	sourceMap = false,
	extraPlugins = [],
}) => {
	const stub = `${dir}/_stub-${file}.js`;

	return {
		input,
		output: {
			file: stub,
			format: 'es',
		},
		plugins: [
			postcss({
				extract: file,
				minimize,
				sourceMap,
				plugins: minimize ? [foldSelectorBreaks()] : [],
			}),
			removeStub(stub),
			...extraPlugins,
		],
	};
};

// npm run dev - only what demo/index.html loads, into demo/dist.
// A function, because serve() starts its server the moment it is called.
const devConfig = () => [
	{
		input: 'src/index.js',
		output: {
			file: `demo/dist/${name}.esm.js`,
			format: 'es',
			sourcemap: true,
		},
		plugins: [
			resolve(),
			serve({
				open: true,
				contentBase: 'demo',
				host: 'localhost',
				port: 3000,
			}),
		],
	},
	cssBuild({
		input: `src/${name}.css`,
		dir: 'demo/dist',
		file: `${name}.css`,
		sourceMap: true,
	}),
	cssBuild({
		input: `src/${name}.effects.css`,
		dir: 'demo/dist',
		file: `${name}.effects.css`,
		sourceMap: true,
	}),
];

// npm run build - the published files, into dist
const buildConfig = () => [
	// esm version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.esm.js`,
			format: 'es',
		},
		plugins: [cleanDist(), resolve()],
	},
	// cjs version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.cjs.js`,
			format: 'cjs',
		},
		plugins: [resolve()],
	},
	// umd version (for direct browser usage and more compatibility)
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.js`,
			format: 'umd',
			name: 'DropdownPanel',
		},
		plugins: [resolve()],
	},
	// minified umd version
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.min.js`,
			format: 'umd',
			name: 'DropdownPanel',
		},
		plugins: [
			resolve(),
			terser({
				format: {
					comments: false,
				},
			}),
		],
	},
	// core css (unminified), plus an untouched source copy
	cssBuild({
		input: `src/${name}.css`,
		dir: 'dist',
		file: `${name}.css`,
		extraPlugins: [
			copy({
				targets: [
					{
						src: `src/${name}.css`,
						dest: 'dist',
						rename: `${name}.src.css`,
					},
				],
				hook: 'writeBundle',
			}),
		],
	}),
	// core css (minified)
	cssBuild({
		input: `src/${name}.css`,
		dir: 'dist',
		file: `${name}.min.css`,
		minimize: true,
	}),
	// effects css (unminified)
	cssBuild({
		input: `src/${name}.effects.css`,
		dir: 'dist',
		file: `${name}.effects.css`,
	}),
	// effects css (minified)
	cssBuild({
		input: `src/${name}.effects.css`,
		dir: 'dist',
		file: `${name}.effects.min.css`,
		minimize: true,
	}),
];

export default dev ? devConfig() : buildConfig();
