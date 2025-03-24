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

