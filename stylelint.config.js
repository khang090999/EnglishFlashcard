export default {
	extends: ['stylelint-config-standard'],
	ignoreFiles: ['dist/**', 'node_modules/**'],
	rules: {
		'selector-class-pattern': null,
		// Component and responsive overrides intentionally follow base styles.
		'no-descending-specificity': null,
	},
};
