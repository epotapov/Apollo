/**
 * conn.js
 *
 * Connects to database
 *
 * @source: https://www.mongodb.com/languages/mern-stack-tutorial
 *
 */

export async function connectToCluster(uri) {
   let mongoClient;

   try {
       mongoClient = new MongoClient(uri);
       console.log('Connecting to MongoDB Atlas cluster...');
       await mongoClient.connect();
       console.log('Successfully connected to MongoDB Atlas!');

       return mongoClient;
   } catch (error) {
       console.error('Connection to MongoDB Atlas failed!', error);
       process.exit();
   }
}






// const { MongoClient } = require("mongodb");


// async function main(callback) {
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://admin:ZoLZqB0yqRBlHyio@apollo.htun4s6.mongodb.net/?retryWrites=true&w=majority";
 

//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         await  listDatabases(client);
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

// main().catch(console.error);

// const { MongoClient } = require("mongodb");
// const Db = process.env.ATLAS_URI;
// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// module.exports = {
//   connectToServer: function (callback) {
//     try {
//       client.connect(function (err, db) {
//         listDatabases(client);
//         return callback(err);
//       });
//     } catch (e) {
//       console.error(e);
//     } finally {
//       client.close();
//     }
//   }
//   // getDb: function () {
//   //   return _db;
//   // },
// };
// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };


