module.exports = {
	roots: ['<rootDir>/src','<rootDir>/test'],
	transform: {
	  '^.+\\.ts': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)',
	moduleFileExtensions: ['ts', 'js', 'jsx', 'json', 'node'],
  }