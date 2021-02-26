const uuidv4 = require('uuid/v4');
const sqlite3 = require('sqlite3').verbose();
const dbService = require('./db');


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
        resolve(rows);
      })
    });
  },

  addNew: async (product) => {
    return new Promise((resolve, reject) => {
      dbService.run('INSERT INTO products (user, title, description, category, location, images, price, deliveryType, sellerName, sellerPhone, createdDateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                   [product.user, product.title, product.description, product.category, product.location, product.images, product.price, product.deliveryType, product.sellerName, product.sellerPhone, product.createdDateTime])
      .then(result => {
        if(result.changes > 8) {
          resolve(true);
        }
        else {
          reject(false);
        }
      })
      .catch(error => reject(error));
    });
  },

  getProductById: async (productId, userId) => {
    return new Promise((resolve, reject) => {
      dbService.getDb().get('SELECT * FROM products WHERE id = ? AND user = ?', [productId, userId], function(error, rows) {
        error !== null ? reject(error) : null;
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
        'UPDATE products SET title = ?, description = ?, category = ?, location = ?, images = ?, price = ?, deliveryType = ?, sellerName = ?, sellerPhone = ? WHERE id = ?',
        [productContent.title, productContent.description, productContent.category, productContent.location, productContent.images, productContent.price, productContent.deliveryType, productContent.sellerName, productContent.sellerPhone, productId])
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