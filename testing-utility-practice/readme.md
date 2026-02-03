# testing and utility practice

this project demonstrates node.js testing and utility usage.
it covers unit testing with jest and mocha, and uses libraries like joi, lodash, and luxon.

## project structure

- src/utils: utility functions (math, lodash, luxon)
- src/validation: validation schemas (joi)
- tests/jest: jest unit tests
- tests/mocha: mocha unit tests
- src/index.js: playground script to run examples

## installation

1. clone the repository
2. run `npm install` to install dependencies

## running tests

- run all tests: `npm test`
- run jest tests only: `npm run test:jest`
- run mocha tests only: `npm run test:mocha`
- check test coverage: `npm run test:coverage`

## running the playground

to see the utilities in action without a test runner:
`node src/index.js`

## dependencies

- jest: testing framework
- mocha: testing framework
- chai: assertion library for mocha
- lodash: utility library for arrays, numbers, objects, etc.
- luxon: library for working with dates and times
- joi: object schema validation

refer to `study_guide.md` for a detailed explanation of the concepts and architecture.
