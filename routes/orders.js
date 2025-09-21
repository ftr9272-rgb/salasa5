const express = require('express');
const db = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all orders (with optional filters)
router.get('/', authenticateToken, (req, res) => {
  try {
    let filters = {};
    
    // Apply role-based filtering
    if (req.user.role === 'supplier') {
      filters.supplierId = req.user.id;
    } else if (req.user.role === 'retailer') {
      filters.retailerId = req.user.id;
    }
    
    // Add query filters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.supplierId && req.user.role !== 'supplier') filters.supplierId = req.query.supplierId;
    if (req.query.retailerId && req.user.role !== 'retailer') filters.retailerId = req.query.retailerId;

    const orders = db.findOrders(filters);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get specific order
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const orders = db.findOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'supplier' && order.supplierId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'retailer' && order.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Include shipment info if available
    if (order.shipmentId) {
      const shipment = db.findShipments().find(s => s.id === order.shipmentId);
      order.shipment = shipment;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// Track order (public endpoint with order ID and email verification)
router.get('/:id/track', (req, res) => {
  try {
    const { email } = req.query;
    const orders = db.findOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify email for security (in real app, you'd check retailer email)
    if (!email) {
      return res.status(400).json({ error: 'Email verification required for tracking' });
    }

    let trackingInfo = {
      orderId: order.id,
      status: order.status,
      createdAt: order.createdAt,
      productName: order.productName,
      quantity: order.quantity
    };

    // Include shipment tracking if available
    if (order.shipmentId) {
      const shipment = db.findShipments().find(s => s.id === order.shipmentId);
      if (shipment) {
        trackingInfo.tracking = {
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          currentLocation: shipment.currentLocation,
          estimatedDeliveryDate: shipment.estimatedDeliveryDate,
          statusHistory: shipment.statusHistory || []
        };
      }
    }

    res.json(trackingInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order', details: error.message });
  }
});

module.exports = router;