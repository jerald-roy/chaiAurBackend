/*
what are we trying to do here ?
- here we are trying to create the wrapper wrapper of async and try and catch for any function (this function can be talking to the db or even connection to the db itself)
*/
/*
here we are just accepting a function and return a async function wrapper outside of the incoming function 
- this only gets run when asyncHandler is called
- here req and res are just keyword but not related to this file only but it takes the details from the route calls 
*/
/*
The reason next can be ignored is because of its position as the third parameter.

If next were the first parameter, like this:

asyncHandler(async (next, req, res) => {   
    res.send("Hello, world!");
});
Then Express would pass req into next's position, breaking everything! You'd be forced to always include it.

But since it's the third parameter, JavaScript allows it to be skipped when not needed, while still passing req and res properly.

*/
/*
const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
        await fn(req,res,next)
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message:error.message
            })
    }
} }
*/

/*
the above code written using async await but we will try to understand and write the same code using Promises
- ✅ Express automatically calls the callback function passed to app.get(), so we don’t need .then() manually.
✅ Promise.resolve() is just wrapping the function execution to ensure errors are caught.
✅ requestHandler(req, res, next) is the actual function that gets executed.
-the reason we can use Promise.resolve directly because we know it can be a promise that can be executed irrespective of the errors because all the previous condition would have checked by the express routes and middlewares
-We need a wrapper that actually waits for requestHandler: ✅ Using async-await wrapper → Ensures try-catch actually works. ✅ Using Promise.resolve() → Automatically catches errors.because requestHandler itself is an async code so
*/

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
        //this below code wont work
        // try {
        //     requestHandler(req,res,next)
        // } catch (err) {
        //     next(err)
        // }
    }
}



export { asyncHandler }
/*
-this is an part of (ES6 MODULE SYSTEM )
-When you export a function, variable, or object using {} (curly braces), it’s a named export.
-to import you must use destructuring - import {asyncHandler}} from "./utils.js"
--------------------------------
default export looks somthing like this:
- export default asyncHandler
you need to import it like this :
- import asyncHandler from "./utils.js"
-used named exports when you have to export multiple things from the file 
*/