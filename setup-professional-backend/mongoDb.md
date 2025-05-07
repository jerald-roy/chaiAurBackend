1. so we got the **link to connect** to the mongo db atlas which is an cloud based db and we are not running this db locally 

2. we are give a **db a name** that is stored in the constants.js 
- we are storing it in constants but not in .env file because its just a general value not a sensitive thing or system specific (varaibles that depends on that particular environment ) for ex the above mongo db link it varies because everyone gets different link to connect to the db if they are running this project on their own 

3. there are two ways to connect to the db ok 
 - 1. store the function that connects to the db in the index file only so that the starting point that is the index file executes you function to connect to the db also runs
 - 2. create a file and store the function and there and then import to the index file 

 4. we can just connect to the db using the single line thats avaiable in the mongoose documentation but we can also use try / catch or async / await along with it!

 5. *Database* = a collection of related data (like a folder) (videotube)
   
6. *collection* = a table in the database (users)

7. *document* = {
  "_id": ObjectId("..."),
  "username": "jroy",
  "email": "jerald@gmail.com",
  ...
} // written in JSON FORMAT

8. **aggregation pipeline** : its a function that helps us to perform set of operations collectively where each operation is called a stage and an input for the each stage depends upon the result of the previous stage
- *$lookup* - is the operator that is used inside this aggregation function to do the left join as well the as the right join
- *left join* - its primarily depends upon two things
(1) which document feild is used inside which other document feild for example: a is the users document and b is the order document so a's feild is being used in b's document 
(2) upon which you use aggregate function you can use aggregate function upon a as well as b 
- if u use on a that means you try to search things on b i.e left join ex: where this the useid present in the orders (b) document see you are searching the b document here so its left join
- if u use aggregate on b that means you are seaching things on a i.e right join 

, even if you simulate a right join by using $lookup in a way that seems like it's coming from the right side, it still behaves like a left join because it appends data to the original collection you're aggregating on (the "root" structure).

note: sql can by default using structure itself can have left and right join to use can directly call on operator on that but here in mongo since its nosql we have use something called aggregation pipeline

9. **Object ID** - The string and ObjectId may look the same, but they’re different types — and while Mongoose auto-converts strings to ObjectIds in queries, native MongoDB does not, so you must convert them manually.
