// src/client/app/products/search.js
import ProductService from './product.mock.service.js';
import Product from './product.js';

const productList = document.querySelector('#product-list tbody');
const products = ProductService.getProducts();

console.log('Products loaded:', products); // Debugging line

if (products.length === 0) {
    productList.innerHTML = '<tr><td colspan="5" class="text-center">No products available.</td></tr>';
} else {
    // Render products in a table
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct('${product.id}')">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Function to delete a product
window.deleteProduct = function(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        ProductService.deleteProduct(id);
        window.location.reload(); // Refresh the page to reflect changes
    }
};

// Function to edit a product
window.editProduct = function(id) {
    window.location.href = `create.html?edit=${id}`;
};