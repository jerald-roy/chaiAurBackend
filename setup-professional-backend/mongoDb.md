1. so we got the **link to connect** to the mongo db atlas which is an cloud based db and we are not running this db locally 

2. we are give a **db a name** that is stored in the constants.js 
- we are storing it in constants but not in .env file because its just a general value not a sensitive thing or system specific (varaibles that depends on that particular environment ) for ex the above mongo db link it varies because everyone gets different link to connect to the db if they are running this project on their own 

3. there are two ways to connect to the db ok 
 - 1. store the function that connects to the db in the index file only so that the starting point that is the index file executes you function to connect to the db also runs
 - 2. create a file and store the function and there and then import to the index file 

 4. we can just connect to the db using the single line thats avaiable in the mongoose documentation but we can also use try / catch or async / await along with it!

 