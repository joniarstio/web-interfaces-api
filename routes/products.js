const express = require('express');
const router = express.Router();
const products = require('../services/products');
const Validator = require('jsonschema').Validator;
const passportInstance = require('./passportAuthConfig');
const newProductSchema = require('../schemas/newProductSchema.json');

function validateNewOrEditedProductRequest(req, res, next)
{
  try {
    const v = new Validator();
    const validateResult = v.validate(req.body, newProductSchema);
    if(validateResult.errors.length > 0) {
      validateResult.errors.status = 400;
      next(validateResult.errors);
    }
  }
  catch(error) {
    error.status = 400;
    next(error);
  }
  next();
}

router.get('', 
passportInstance.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    console.log('GET user products')
    const p = await products.getProductsByUserId(req.user.id);
    res.json(p);
  } catch (error) {
    res.status(400).json({
      reason: error
    });
  

  }

})

/*router.get(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let myProducts = await products.getProductsByUserId(req.user.id);

      res.status(200).json({
        products: myProducts
      });
    } catch (error) {
      res.status(400).json({
        reason: error
      });
    }
});*/

router.get(
  '/all',
  async (req, res) => {
    try {
      let allProducts = await products.getAllProducts(req.body);

      res.status(200).json({
        products: allProducts
      });
    } catch (error) {
      res.status(400).json({
        reason: error
      });
    }
});

router.get(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Enforce that user can only query products owned by him
      const theProduct = await products.getProductById(req.params.id, req.user.id);

      if(theProduct === undefined) {
        res.status(404).send();
      }
      else {
        res.status(200).json(theProduct);
      }
    } catch (error) {
      res.status(400).json({
        reason: error
      });
    }
});

router.post(
  '',
  passportInstance.authenticate('jwt', { session: false }),
  validateNewOrEditedProductRequest,
  async (req, res) => {

    try {
      const now = new Date('05 October 2011 14:48 UTC');
      const result = await products.addNew({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        images: req.body.images,
        price: req.body.price,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        sellerPhone: req.body.sellerPhone,
        createdDateTime: now.toISOString(),
      });
      res.status(201).send();
    } catch (error) {
      res.status(400).json({
        reason: error
      });
    }
});

router.delete(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Enforce that user can only query products owned by him
      const result = await products.deleteProductById(req.params.id, req.user.id);

      res.status(200).send();
    } catch (error) {
      res.status(404).send();
    }
});

router.put(
  '/:id',
  passportInstance.authenticate('jwt', { session: false }),
  validateNewOrEditedProductRequest,
  async (req, res) => {
    try {
      // Enforce that user can only query products owned by him
      const result = await products.updateProductById(req.params.id, req.body);
      res.status(200).send();
    } catch (error) {
      res.status(404).send();
    }
});



module.exports = router;