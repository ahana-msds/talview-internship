
# generators and advanced iteration in javascript

this folder contains practice programs to understand how javascript handles iteration using generator functions, custom iterators, and async generators for asynchronous data flows.

---

## objectives

* understand how generator functions work using the yield keyword
* learn how iteration can be controlled step by step
* explore advanced iteration patterns using iterators
* practice handling asynchronous sequences using async generators

---

## topics covered

* generator functions using function* syntax
* yielding multiple values over time
* manual iteration using next() method
* for...of loop with generators and iterables
* custom iteration logic using iterators
* async generator functions using async function*
* consuming async generators using for await...of

---

## files overview

| file name               | purpose                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `generators.js`         | demonstrates basic generator functions and how values are yielded one by one |
| `advanced-iteration.js` | shows custom iteration patterns and deeper control over iteration behavior   |
| `async-generators.js`   | demonstrates async generators for handling asynchronous data streams         |

---

## what i learned by implementing these

* how generators pause and resume execution using yield
* how iteration does not need full data upfront
* how custom iterators give full control over traversal logic
* how async generators combine promises with iteration
* how for await...of simplifies async data consumption

---

## summary

* generators allow lazy and controlled data generation.
* iterators define how data structures are traversed.
* async generators are useful for streams, apis, and timed data.
* advanced iteration improves performance and memory usage.
* these concepts are important for building efficient async systems.

---

