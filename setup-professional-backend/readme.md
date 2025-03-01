### this file uses markdown syntax

1. **package.json** file stores the metadata of the project
2. **gitkeep file** is used because we cant push empty folder inside the github 
3. **gitignore file** is used because we dont want to push sensitive data into github along with our normal push
4. there is also something called **github generators** which automatically give the file name thats usally will be added to the gitignore file based upon the kind of project like node js
5. **Environment variables** are global values that can be used across different parts of a project. You can set them in two ways:
 - *using terminal commands* , but available temporary for the session
 - *storing it in .env file* and you can load it to the node js file using the **dot env** package
 - Environment variables are meant to be global and not tied directly to the project files.

- They should not be committed to version control (e.g., Git) to avoid security risks.
Used but not stored 
- The project accesses them but doesn't keep them inside code files.
Deployment separation 
- When deploying, environment variables are set separately (e.g., in a server config, .env file, or cloud provider settings).

6. **source folder** it contains the actual application logic , write and manage the applications core functionality

7. the **common js** syntax (used in node js) and **ES MODULES** syntax (used in both the browser and the node js) latest way , the only purpose of these syntax is used to import and export modules (each file is a module)
 - common js : (require/module.exports)
 - ES modules : (import/export) 
 - when you add **"type":"module"** in package.json file you are overriding the node js default common js behaviou and telling it use ES modules
 8. **nodemon package** if you want to see the changes on the server file you need to stop the file and start the file once again so here is the package which watches your changes and reloads the file automatically!
 - whenever you save the file things are automatically getting updated on the server side
 9. **dev - dependencies** only used in the development and not on the production side just for the developing the project we use ex: nodemon
 10. **node_modules folder** it actually contains the js files required for your project to run
 11. **package-lock.json** it actually locks the installed package versions to ensure consistency across different environments 
 - prevents accidental updates that might break the project
 12. **Nodemon is only used to track the backend(server) changes in node.js
 - it does not track the frontend files like index.html or style.css 
 - frontend live reloading we use live server or react build-in dev server 
 13. **controllers directory** functionalities , generally used to define the logic or the function of the routes which will be exported and given to the route folder
 14. **db** database connetion
 15. **middlewares** things inbetween the frontend request and the actual server operation like fullfillment
 16. **model** blueprint of how the data is structured in the database
 17. **utils** short form of utilities
  - file upload can be an example of utilities
  - for ex: user can upload the file for the dp or the video he created for the video section , so its a utlity where we can use this in many places
  - utility means the state of being useful
  18. **prettier** as an dev dependency not as a vs code extension - it will automatically commit the code if someone commit or push the changes to so that we maintain the standard even when multiple people are working together 
   - **prettierrc** all the configuration of the prettierrc extension
   - **prettierignore file** which are files where prettier style should not apply
 19. **app.js** you can see the app.js file which is used to set up express server , middlewares and routes generally
 20. **mongoose package** to connect to the db
  - js cannot directly communicate with the mongo db server because mongodb is not builtin js
  -  The MongoDB package is like a raw API (low-level access).
 - The Mongoose package is like a wrapper API (adds extra features like schemas).
 21. **express package** to set up the server
 22. you can not only connect to the db from using the index.js file but in there only you can try to start the server also that is using the express js
23. Yes! If you load environment variables in index.js (the entry point), they will be available in all other files of your backend automatically.
24. **there are two ways to load the .env variables**
 - a. Explicitly call dotenv.config() inside your code.
 - b. Use -r dotenv/config in package.json scripts.
 - If your .env is not in the root directory, use dotenv.config().
- If your .env is in the root directory, the script method works fine.
 - but you are adding this extra bit inside the script because you are using the import syntax