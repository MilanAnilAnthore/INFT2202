// src/client/app/products/create.js
import ProductService from './product.mock.service.js';
import Product from './product.js';

const params = new URLSearchParams(window.location.search);
const editId = params.get('edit');

// Function to validate the form
function validateForm(name, description, stock, price) {
    let isValid = true;

    // Clear previous error messages
    document.getElementById('productNameError').textContent = '';
    document.getElementById('productDescriptionError').textContent = '';
    document.getElementById('productStockError').textContent = '';
    document.getElementById('productPriceError').textContent = '';

    // Validate product name
    if (!name) {
        document.getElementById('productNameError').textContent = 'Product name is required.';
        isValid = false;
    }

    // Validate product description
    if (!description) {
        document.getElementById('productDescriptionError').textContent = 'Product description is required.';
        isValid = false;
    }

    // Validate product stock
    if (!stock) {
        document.getElementById('productStockError').textContent = 'Stock is required.';
        isValid = false;
    } else if (isNaN(stock)) {
        document.getElementById('productStockError').textContent = 'Stock must be a number.';
        isValid = false;
    } else if (stock < 0) {
        document.getElementById('productStockError').textContent = 'Stock must be a positive number.';
        isValid = false;
    }

    // Validate product price
    if (!price) {
        document.getElementById('productPriceError').textContent = 'Price is required.';
        isValid = false;
    } else if (isNaN(price)) {
        document.getElementById('productPriceError').textContent = 'Price must be a number.';
        isValid = false;
    } else if (price < 0) {
        document.getElementById('productPriceError').textContent = 'Price must be a positive number.';
        isValid = false;
    }

    return isValid;
}

// Function to auto-fill the form when editing
function autoFillForm(product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productPrice').value = product.price;
    document.querySelector('h1').textContent = 'Edit Product';
    document.querySelector('button[type="submit"]').textContent = 'Save Changes';
}

// Auto-fill the form if editing
if (editId) {
    const product = ProductService.getProducts().find(p => p.id === editId);
    if (product) {
        autoFillForm(product);
    }
}

// Handle form submission
document.getElementById('create-product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const price = parseFloat(document.getElementById('productPrice').value);

    // Validate the form
    if (!validateForm(name, description, stock, price)) {
        return;
    }

    const newProduct = new Product(name, description, stock, price);

    if (editId) {
        // Update existing product
        ProductService.updateProduct(editId, newProduct);
        alert('Product updated successfully!');
    } else {
        // Add new product
        ProductService.addProduct(newProduct);
        alert('Product created successfully!');
    }

    window.location.href = 'search.html';
});