import { rmSync } from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;
const name = 'dropdown-panel';
const demoDir = 'demo/dist';

let distCleaned = false;

/**
 * Wipes dist once per production build. Sourcemaps written by an earlier
 * `npm run dev` otherwise survive into a published package, pointing at
 * code that no longer exists.
 */
const cleanDist = () => ({
	name: 'clean-dist',
	buildStart() {
		if (distCleaned || !production) return;
		distCleaned = true;
		rmSync('dist', { recursive: true, force: true });
	},
});

/**
 * A css-only build still needs a javascript entry chunk. postcss
 * extracts the real stylesheet and leaves an empty stub behind; delete
 * it so it never ends up in the published tarball.
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
 * Copies build output into the demo folder. Every copy is attached to
 * the config that writes the file it copies, so a failed build can never
 * silently republish stale demo assets.
 * @param {string[]} sources - glob patterns relative to the repo root
 */
const copyToDemo = (sources) =>
	copy({
		targets: sources.map((src) => ({ src, dest: demoDir })),
		hook: 'writeBundle',
	});

/**
 * One stylesheet build.
 * @param {Object} options - build options
 * @param {string} options.input - source css file
 * @param {string} options.file - output file name inside dist
 * @param {boolean} options.minimize - whether to minify
 * @param {Array} [options.extraPlugins] - plugins appended to the build
 */
const cssBuild = ({ input, file, minimize, extraPlugins = [] }) => {
	const stub = `dist/_stub-${file}.js`;

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
				sourceMap: !production,
			}),
			removeStub(stub),
			...extraPlugins,
		],
	};
};

// rollup configuration
export default [
	// esm version (JavaScript only)
	{
		input: 'src/index.js',
		output: {
			file: `dist/${name}.esm.js`,
			format: 'es',
			sourcemap: !production,
		},
		plugins: [
			cleanDist(),
			resolve(),
			copyToDemo([`dist/${name}.esm.js*`]),
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
		plugins: [resolve()],
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
		plugins: [resolve()],
	},
	// minified umd version (JavaScript only)
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
			terser({
				format: {
					comments: false,
				},
			}),
		],
	},
	// core css (unminified)
	cssBuild({
		input: `src/${name}.css`,
		file: `${name}.css`,
		minimize: false,
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
			copyToDemo([`dist/${name}.css*`]),
		],
	}),
	// core css (minified)
	cssBuild({
		input: `src/${name}.css`,
		file: `${name}.min.css`,
		minimize: true,
		extraPlugins: [copyToDemo([`dist/${name}.min.css*`])],
	}),
	// effects css (unminified)
	cssBuild({
		input: `src/${name}.effects.css`,
		file: `${name}.effects.css`,
		minimize: false,
		extraPlugins: [copyToDemo([`dist/${name}.effects.css*`])],
	}),
	// effects css (minified)
	cssBuild({
		input: `src/${name}.effects.css`,
		file: `${name}.effects.min.css`,
		minimize: true,
		extraPlugins: [copyToDemo([`dist/${name}.effects.min.css*`])],
	}),
];
