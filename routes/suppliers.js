const express = require('express');
const db = require('../models/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get supplier dashboard - own products and orders
router.get('/dashboard', authenticateToken, requireRole(['supplier']), (req, res) => {
  try {
    const products = db.findProducts({ supplierId: req.user.id });
    const orders = db.findOrders({ supplierId: req.user.id });

    res.json({
      products,
      orders,
      statistics: {
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        completedOrders: orders.filter(order => order.status === 'completed').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', details: error.message });
  }
});

// Get orders for supplier
router.get('/orders', authenticateToken, requireRole(['supplier']), (req, res) => {
  try {
    const orders = db.findOrders({ supplierId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Update order status (suppliers can accept/reject orders)
router.patch('/orders/:id/status', authenticateToken, requireRole(['supplier']), (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'processing', 'ready'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = db.updateOrder(req.params.id, { status });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.supplierId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own orders' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
});

module.exports = router;