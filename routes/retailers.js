const express = require('express');
const db = require('../models/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get retailer dashboard
router.get('/dashboard', authenticateToken, requireRole(['retailer']), (req, res) => {
  try {
    const orders = db.findOrders({ retailerId: req.user.id });
    const products = db.findProducts(); // All available products

    res.json({
      orders,
      availableProducts: products.filter(p => p.available && p.quantity > 0),
      statistics: {
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        processingOrders: orders.filter(order => order.status === 'processing').length,
        completedOrders: orders.filter(order => order.status === 'completed').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', details: error.message });
  }
});

// Get orders for retailer
router.get('/orders', authenticateToken, requireRole(['retailer']), (req, res) => {
  try {
    const orders = db.findOrders({ retailerId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Create new order
router.post('/orders', authenticateToken, requireRole(['retailer']), (req, res) => {
  try {
    const { productId, quantity, shippingAddress, notes } = req.body;

    if (!productId || !quantity || !shippingAddress) {
      return res.status(400).json({ error: 'Product ID, quantity, and shipping address are required' });
    }

    const product = db.findProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.available || product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient product quantity available' });
    }

    const totalAmount = product.price * quantity;

    const order = db.createOrder({
      productId,
      quantity: parseInt(quantity),
      totalAmount,
      shippingAddress,
      notes: notes || '',
      retailerId: req.user.id,
      supplierId: product.supplierId,
      productName: product.name
    });

    // Update product quantity
    db.updateProduct(productId, { 
      quantity: product.quantity - quantity 
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

module.exports = router;