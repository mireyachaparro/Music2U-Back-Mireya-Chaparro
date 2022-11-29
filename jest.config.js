/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    resolver: 'jest-ts-webcompat-resolver',
    coveragePathIgnorePatterns: ['src/entities'],
};
