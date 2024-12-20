module.exports = {
	root: true,
	// This tells ESLint to load the config from the package `eslint-config-custom`
	extends: ['@woovi-playground/custom'],
	settings: {
		next: {
			rootDir: ['apps/*/'],
		},
	},
	rules: {
		'import/no-default-export': 'off',
	},
};
