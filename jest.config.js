module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
	  '^.+\\.ts': 'ts-jest',
	},
	// An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
	transformIgnorePatterns: [
		'<rootDir>/node_modules/'
	],
	testPathIgnorePatterns: ['\\\\node_modules\\\\'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)',
	moduleFileExtensions: ['ts', 'js', 'jsx', 'json', 'node'],
	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	collectCoverageFrom: ['src/**/*.{ts,js,jsx,mjs}'],

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

  }