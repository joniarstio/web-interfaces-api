const sqlite3 = require('sqlite3').verbose();

let db = null;

async function openDb(dbName)
{
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbName, function(error) {
      if(error !== null) {
        reject(error);
        return;
      }
      resolve();
    })
  });
}

async function closeDb()
{
  return new Promise((resolve, reject) => {
    db.close(function(error) {
      if(error !== null) {
        reject(error);
        return;
      }

      db = null;
      resolve();
    })
  });
}

async function createTables()
{
  return new Promise((resolve, reject) => {
    run(
      `CREATE TABLE IF NOT EXISTS "users" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "username" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "phoneNumber" TEXT NOT NULL,
      "dateOfBirth" TEXT NOT NULL
      )`,
      []
    )
    .then(() => {
      run(
        `CREATE TABLE IF NOT EXISTS "products" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "user" INTEGER NOT NULL,
        "title" TEXT NOT NULL,
        "description"	TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "images" TEXT NOT NULL,
        "price"	TEXT NOT NULL,
        "deliveryType" TEXT NOT NULL,
        "sellerName"	TEXT NOT NULL,
        "sellerPhone"	TEXT NOT NULL,
        "createdDateTime"	TEXT NOT NULL
        )`,
        []
      )
      .then(() => resolve())
    })
    .catch((error) => reject(error));
  });
}

/* Helper function which offers promisified version of the .run
   function of the sqlite API.
*/
async function run(query, params) {
  return new Promise((resolve, reject) => {
    db.run(
      query,
      params,
      function(error) {
        if(error !== null) {
          reject(error);
          return;
        }
        resolve({
          changes: this.changes,
          lastID: this.lastID,
          sql: this.sql
        });
      }
    );
  });
}


module.exports = {
  getDb: () => db,
  init: async (dbName) => {
    return openDb(dbName).then(() => createTables());
  },
  close: async () => {
    return closeDb();
  },
  run: run,
}