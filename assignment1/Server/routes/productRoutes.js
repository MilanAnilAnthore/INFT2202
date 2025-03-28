import express from 'express';
import { body } from 'express-validator';
import { productController } from '../controllers/productController.js';
import { checkValidation } from '../middleWare/validation.js';

const router = express.Router();

// Define validation rules
const productValidationRules = [
    body('name')
        .notEmpty().withMessage('Product name is required')
        .trim(),
    body('description')
        .notEmpty().withMessage('Product description is required')
        .trim(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a positive integer')
];

// Routes
router.get('/', productController.getProducts);
router.get('/name/:name', productController.getProductByName);
router.post('/', checkValidation(productValidationRules), productController.addProduct);
router.put('/:id', checkValidation(productValidationRules), productController.updateProduct);
router.put('/name/:name', checkValidation(productValidationRules), productController.updateProductByName);
router.delete('/:id', productController.deleteProduct);
router.delete('/name/:name', productController.deleteProductByName);

export default router;






