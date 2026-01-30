/**
 * custom middleware for logging requests.
 * demonstrates how express middleware works: (req, res, next)
 */
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, url } = req;

    // log current request details
    console.log(`[${timestamp}] ${method} ${url}`);

    // call next() to pass control to the next middleware or route handler
    // if you forget this, the request will hang!
    next();
};

module.exports = logger;
