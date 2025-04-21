1. **Authentication** (Who You Are) → Confirms your identity (e.g., logging in with a password or Google).

2. **Authorization** (What You Can Do) → Checks what permissions you have after logging in (e.g., can you edit a file or just view it?).

3. 
1️⃣ Traditional logins (username & password) were inconvenient and risky (password leaks).
2️⃣ OAuth 2.0 was created to let apps access user data without passwords (it issues tokens instead of storing passwords).
3️⃣ But OAuth 2.0 only handles authorization (permissions), not authentication (identity verification). i.e we were not able to create the new token we had to send extra info everytime along with the access token to the server
4️⃣ So, OpenID Connect (OIDC) was added on top of OAuth 2.0 to confirm who the user is before issuing tokens.i.e we now have the ability to create the new token without sending that extra info everytime we the access token 

In short:
🔹 OAuth 2.0 = "This app is allowed to access your data." (Authorization)
🔹 OIDC = "This user is really John." (Authentication)

Both work together to securely log in users and manage sessions without passwords!
----------------------------------------------

1. User logs in (username + password)
       |
       v
2. Server verifies credentials
       |
       v
3. Server sends back:
     - Access Token (short-lived)
     - Refresh Token (long-lived, secure)
       |
       v
4. Browser stores:
     - Access Token (in memory or localStorage)
     - Refresh Token (in HttpOnly cookie)
       |
       v
5. Client makes API request ➝ sends Access Token
       |
       v
6. Server verifies Access Token using secret key
       |
       v
7. If valid ➝ return data
   If expired ➝ client sends Refresh Token
       |
       v
8. Server checks Refresh Token
       |
       v
9. If valid ➝ issue new Access Token (valid for just intial token time)
       |
       v
10. Repeat until Refresh Token expires

by doing when even when the public key gets to the user it will be only valid to limited time which is time of the access token and refresh token time will be usally longer

---------------------------------------

Header → info about the token (e.g., algorithm used like HS256)

Payload → actual data like userId, role, and ✅ exp (expiry time) so that we can generate the new token access if the refresh token time is not completed

Signature → created by hashing (header + payload) with the secret key
--------------------------------------------------------
**JWTs were born out of OAuth-style ideas for authorization, but became super popular for authentication too.**

 OAuth (open autentication)is a protocol (principle) for authorization —

“Can this app do X on behalf of this user?”

that is where this idea kicks in :

You click “Login with Google”

You're redirected to Google’s login page

You log in (or already logged in)

Google shows: “Allow this app to access your email?”

You click Allow

Google sends an authorization code to the third-party app (temporary)

The third-party app exchanges that code for a token (like a JWT)

Now the app uses that token to make API calls on your behalf

so that it can take in the data whatever it needs on behalf of you where it gets your data like are you a real user ex: ur name , passsword , email

*** refresh tokens introduce state, even in a JWT-based system.***
-------------------------------------------------------------