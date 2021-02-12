const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-http'))
const expect = require('chai').expect;
const assert = require('chai').assert;
const users = require('../services/users');
const products = require('../services/products');
const api = 'http://localhost:3000';
const dbService = require('../services/db');
const errorResponseSchema = require('../schemas/errorResponseSchema.json');
const allProductsSchema = require('../schemas/allProductsSchema.json');
const singleProductSchema = require('../schemas/singleProductSchema.json');
const apiServer = require('../server');
const jsonwebtoken = require('jsonwebtoken');

describe('Product HTTP Routes', function() {
  let userJwt = null;
  let decodedJwt = null;

  before(async function() {
    apiServer.start('test');

    await chai.request(api)
      .get('/users/login')
      .auth('HTTPTester1', 'HTTPTester1Password')
      .then(response => {
        userJwt = response.body.jwt;
        decodedJwt = jsonwebtoken.decode(userJwt, { complete: true });
      });
  });

  after(async function() {
    apiServer.close();
  });

  describe('Create new Product', function() {
    it('Should create a new Product', async function() {
      await chai.request(api)
        .post('/products')
        .set('Authorization', 'Bearer ' + userJwt)
        .send({
          "title": "Test product",
          "description": "Buy milk",
          "category": "Test category",
          "location": "Oulu, Finland",
          "images": "https://images.com",
          "price": 23.5,
          "deliveryType": "Posti",
          "sellerName": "Matti Myyjä",
          "sellerPhone": "+358401234567",
        })
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(201);
        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

  let storedProducts = null;

  describe('Get Product', function() {
    it('Should get this user products', async function() {
      await chai.request(api)
        .get('/products')
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.be.jsonSchema(allProductsSchema);
          expect(response.body.products).to.have.lengthOf(1);
          expect(response.body.products[0].title).to.equal("Test product");
          expect(response.body.products[0].description).to.equal("Buy milk");
          expect(response.body.products[0].category).to.equal("Test category");
          expect(response.body.products[0].location).to.equal("Oulu, Finland");
          expect(response.body.products[0].images).to.equal("https://images.com");
          expect(response.body.products[0].price).to.equal(23.5);
          expect(response.body.products[0].deliveryType).to.equal("Posti");
          expect(response.body.products[0].sellerName).to.equal("Matti Myyjä");
          expect(response.body.products[0].sellerPhone).to.equal("+358401234567");
          storedProducts = response.body.products;
        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

  describe('Get a single product', function() {
    it('should get a product with valid id', async function() {
      await chai.request(api)
        .get('/products/' + storedProducts[0].id)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.be.jsonSchema(singleProductSchema);
          expect(response.body.id).to.equal(storedProducts[0].id);

        })
        .catch(error => {
          assert.fail(error);
        });
    });

    it('should fail to get a product with invalid id', async function() {
      await chai.request(api)
        .get('/products/' + 34523402834029527)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);

        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

  describe('Get all products', function() {
    it('Should get all products', async function() {
      await chai.request(api)
        .get('/products/all')
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          expect(response.body).to.be.jsonSchema(allProductsSchema);
          storedProducts = response.body.products;
        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

  describe('Modify a Product', function() {
    it('Should modify a Product', async function() {
      await chai.request(api)
        .put('/products/' + storedProducts[0].id)
        .set('Authorization', 'Bearer ' + userJwt)
        .send({
          "title": "Modified product title",
          "description": "Modified product",
          "category": "Modified category",
          "location": "Helsinki, Finland",
          "images": "https://images.net",
          "price": 26.1,
          "deliveryType": "Pickup",
          "sellerName": "Mervi Myyjä",
          "sellerPhone": "+358407654321",
        })
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

  describe('Delete a Product', function() {
    it('Should delete a product', async function() {
      await chai.request(api)
        .delete('/products/' + storedProducts[0].id)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(200);
          return chai.request(api)
            .get('/products/' + storedProducts[0].id)
            .set('Authorization', 'Bearer ' + userJwt);
        })
        .then(checkResponse => {
          expect(checkResponse).to.have.property('status');
          expect(checkResponse.status).to.equal(404);
        })
        .catch(error => {
          assert.fail(error);
        });
    });

    it('Should fail to delete a non existing product', async function() {
      await chai.request(api)
        .delete('/products/' + 165713548951324)
        .set('Authorization', 'Bearer ' + userJwt)
        .then(response => {
          expect(response).to.have.property('status');
          expect(response.status).to.equal(404);
        })
        .catch(error => {
          assert.fail(error);
        });
    });
  });

});