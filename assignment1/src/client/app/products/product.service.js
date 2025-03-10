class ProductService {
    constructor() {
        this.host = 'https://inft2202.paclan.net/api/products';
        this.apiKey = '4ba5adec-7e93-46ca-80e8-3f7dc7cf8a39';
    }

    async addProduct(product) {
        try {
            const headers = new Headers({
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });

            // Log the request details for debugging
            console.log('Sending request to:', this.host);
            console.log('Request payload:', {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                stock: parseInt(product.stock)
            });

            const request = new Request(this.host, {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                credentials: 'omit', // Added to handle CORS
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    price: parseFloat(product.price),
                    stock: parseInt(product.stock)
                })
            });

            const response = await fetch(request);

            // Log response for debugging
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw new Error(`Failed to add product: ${error.message}`);
        }
    }

    async getProducts(page = 1, perPage = 10) {
        try {
            const url = new URL(this.host);
            const params = new URLSearchParams({
                page: page.toString(),
                perPage: perPage.toString()
            });
            url.search = params.toString();

            const headers = new Headers({
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });

            const request = new Request(url, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            });

            const response = await fetch(request);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
    }

    async updateProduct(id, product) {
        try {
            const url = `${this.host}/${id}`;
            const headers = new Headers({
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });

            const request = new Request(url, {
                method: 'PUT',
                headers: headers,
                mode: 'cors',
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    price: parseFloat(product.price),
                    stock: parseInt(product.stock)
                })
            });

            const response = await fetch(request);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const url = `${this.host}/${id}`;
            const headers = new Headers({
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });

            const request = new Request(url, {
                method: 'DELETE',
                headers: headers,
                mode: 'cors'
            });

            const response = await fetch(request);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.status === 204 ? null : await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
}

export default new ProductService();
