import dataService from '../service/dataService.js';

const productService = dataService('products');

export const productController = {
    getProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 5;
            const result = await productService.load({ page, perPage });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addProduct: async (req, res) => {
        try {
            const product = req.body;
            const result = await productService.add(product);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = req.body;
            const result = await productService.update(id, product);

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateProductByName: async (req, res) => {
        try {
            const name = req.params.name;
            const updatedData = req.body;
            const result = await productService.updateByName(name, updatedData);

            if (!result.matchedCount) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await productService.delete(id);

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteProductByName: async (req, res) => {
        try {
            const { name } = req.params;
            const result = await productService.deleteByName(name);

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getProductByName: async (req, res) => {
        try {
            const { name } = req.params;
            const product = await productService.findByName(name);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};



