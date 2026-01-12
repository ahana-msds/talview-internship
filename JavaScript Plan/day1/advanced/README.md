
##  objectives

- understand how JavaScript handles non-blocking operations.
- learn different async patterns: callbacks, promises, and async/await.
- handle API requests and async failures safely.
- understand sequential vs parallel execution of async tasks.


##  topics covered

- callbacks and callback-based workflows
- callback hell and its limitations
- promises and chaining
- async/await syntax for cleaner async flow
- fetch API 
- parallel async execution using promise.all()



##  files overview

| file Name | concept demonstrated |
|--------|----------------------|
| `callback.js` | sequential async pipeline using callbacks |
| `callback-hell.js` | nested callbacks showing poor scalability |
| `promise.js` | promise chaining to handle dependent async steps |
| `async-await.js` | clean async flow using async/await and try–catch |
| `fetch-api.js` | fetching data from external API with error handling |
| `parallel-requests.js` | running multiple async tasks in parallel using Promise.all |



##  what i learned by implementing these

- callbacks work but become hard to manage as async steps increase.
- promises help flatten async flow but still rely on chaining.
- async/await makes asynchronous code readable and easier to debug.
- API calls must always be wrapped in proper error handling.
- some async tasks can be executed in parallel for performance improvement.
- understanding async execution is critical for AI pipelines and dashboards where multiple services run together.



##  summary 

- asynchronous programming allows JavaScript to perform long-running tasks without blocking execution.  
- callbacks were the earliest solution but do not scale well for complex workflows.  
- promises and async/await provide structured and readable ways to manage async logic and errors.  
- these patterns are essential for building real-world systems involving APIs, databases, and AI services.



