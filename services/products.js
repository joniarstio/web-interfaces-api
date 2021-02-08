const uuidv4 = require('uuid/v4');
const sqlite3 = require('sqlite3').verbose();
const dbService = require('./db');

function convertIsDoneFromIntegerToBoolean(arrayOfElements)
{
  arrayOfElements = arrayOfElements.map(r => {
    if(r.isDone) {
      r.isDone = true;
    } else {
      r.isDone = false;
    }
    return r;
  });
}

module.exports = {
  getAllProducts: async () => {
    return new Promise((resolve, reject) => {
      dbService.getDb().all('SELECT * FROM products', function(error, rows) {
        error !== null ? reject(error) : null;

        resolve(rows);
      })
    });
  },
  getProductsByUserId: async (userId) => {
    return new Promise((resolve, reject) => {
      dbService.getDb().all('SELECT * FROM products WHERE user = ?', [userId], function(error, rows) {
        error !== null ? reject(error) : null;

        // This datatype conversion is here because sqlite does not have boolean datatype, only integer
        convertIsDoneFromIntegerToBoolean(rows);

        resolve(rows);
      })
    });
  },
  addNew: async (product) => {
    return new Promise((resolve, reject) => {
      dbService.run('INSERT INTO products (user, description, isDone, dueDateTime, createdDateTime) VALUES(?, ?, ?, ?, ?)',
                   [product.user, product.description, product.isDone, product.dueDateTime, product.createdDateTime])
      .then(result => {
        if(result.changes == 1) {
          resolve(true);
        }
        else {
          reject(false);
        }
      })
      .catch(error => reject(error));
    });
    /*
    {
        description: req.body.description,
        dueDateTime: req.body.dueDateTime,
        createdDateTime: now.toISOString(),
        isDone: false
      }
    */

  },
  getProductById: async (productId, userId) => {
    return new Promise((resolve, reject) => {
      dbService.getDb().get('SELECT * FROM products WHERE id = ? AND user = ?', [productId, userId], function(error, rows) {
        error !== null ? reject(error) : null;

        if(rows != undefined) {
          // This datatype conversion is here because sqlite does not have boolean datatype, only integer
          convertIsDoneFromIntegerToBoolean([rows]);
        }


        resolve(rows);
      });
    });
  },
  deleteProductById: async (productId, userId) => {
    return new Promise((resolve, reject) => {
      dbService.run('DELETE FROM products WHERE id = ? AND user = ?', [productId, userId])
      .then(result => {
        if(result.changes == 1) {
          resolve(true);
        }
        else {
          reject(false);
        }
      })
      .catch(error => reject(error));
    });
  },
  updateProductById: async (productId, productContent) => {
    return new Promise((resolve, reject) => {
      dbService.run(
        'UPDATE products SET description = ?, isDone = ?, dueDateTime = ? WHERE id = ?',
        [productContent.description, productContent.isDone, productContent.dueDateTime, productId])
      .then(result => {
        if(result.changes == 1) {
          resolve(true);
        }
        else {
          reject(false);
        }
      })
      .catch(error => reject(error));
    });
  }
}