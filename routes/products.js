const express = require('express');
const db = require('../models/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all products (public endpoint for browsing)
router.get('/', (req, res) => {
  try {
    const filters = {
      supplierId: req.query.supplierId,
      category: req.query.category,
      search: req.query.search
    };

    const products = db.findProducts(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get specific product
router.get('/:id', (req, res) => {
  try {
    const product = db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

// Create product (suppliers only)
router.post('/', authenticateToken, requireRole(['supplier']), (req, res) => {
  try {
    const { name, description, price, category, quantity, specifications } = req.body;

    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ error: 'Name, description, price, and quantity are required' });
    }

    const product = db.createProduct({
      name,
      description,
      price: parseFloat(price),
      category: category || 'general',
      quantity: parseInt(quantity),
      specifications: specifications || {},
      supplierId: req.user.id,
      available: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// Update product (suppliers only, own products)
router.put('/:id', authenticateToken, requireRole(['supplier']), (req, res) => {
  try {
    const product = db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.supplierId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      category: req.body.category,
      quantity: req.body.quantity ? parseInt(req.body.quantity) : undefined,
      specifications: req.body.specifications,
      available: req.body.available
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) delete updates[key];
    });

    const updatedProduct = db.updateProduct(req.params.id, updates);

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

module.exports = router;