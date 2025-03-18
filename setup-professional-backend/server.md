 1. **app.listen(port,callback)** we use this to setup the server on the particular port
  - this callback is not required if you dont need it

2. **app.on** it only catches the startup errors it means for any reason server did not start as expected we can catch the error using it

3. Whenever a client (like a browser or Postman) sends a request to your Express server, it also sends extra information along with it.
👉 This extra information is stored in req.headers.

Think of headers like labels on a package 📦—they tell the server who is sending the request and what they need.
 - for every request **request headers** can be different

 4. **cookies** talking about cookies its something that server generates using the users credentials and pass it to the browser so within that particular seesion which depends using this cookie an browser can make request on the server without needing to provide the username and the password and what cookies contains is session id

 5. **cookie-parser** When a browser sends cookies, they come as a raw string in req.headers.cookie.
 - cookie-parser parses this string into a JavaScript object, making it easier to work with.
 - the concept of parsing cookies exists in all backend frameworks. However:

- cookie-parser is a middleware for Express.js.
Other frameworks have their own ways of handling cookies.

6. **cors** 🔹 Technically, you can't run the frontend and backend on the same port because a single port can only be used by one service at a time.
-🔹 Since the frontend and backend are on different origins (because of different ports or domains), the browser's Same-Origin Policy (SOP) blocks requests from frontend to backend.
- 🔹 CORS helps overcome SOP by allowing the backend to accept requests from specific origins.

- ✅ So, CORS is needed to let the frontend communicate with the backend when they are running on different origins.
- this is also where cors comes into play : In cases like payment gateways, third-party APIs, and social media logins, the frontend interacts with both its own backend and an external API.
- ***cors as a package*** lets you define which origins, methods, and headers are permitted directly on the server.

7. **proxy** Frontend Proxy (Development Only) → We fake the origin so the frontend can talk to the backend without CORS issues.
 - Backend Proxy (Production) → We hide the real backend behind a proxy server (API Gateway, Nginx, Cloudflare) to secure, balance, and optimize traffic.
- In production, we always use backend proxies (reverse proxies) to manage real-world traffic efficiently!

