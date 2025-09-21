const express = require('express');
const db = require('../models/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get shipping company dashboard
router.get('/dashboard', authenticateToken, requireRole(['shipping']), (req, res) => {
  try {
    const shipments = db.findShipments({ shippingCompanyId: req.user.id });
    const availableOrders = db.findOrders({ status: 'ready' }); // Orders ready for shipping

    res.json({
      shipments,
      availableOrders,
      statistics: {
        totalShipments: shipments.length,
        pendingShipments: shipments.filter(s => s.status === 'pending').length,
        inTransitShipments: shipments.filter(s => s.status === 'in_transit').length,
        deliveredShipments: shipments.filter(s => s.status === 'delivered').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', details: error.message });
  }
});

// Get shipments for shipping company
router.get('/shipments', authenticateToken, requireRole(['shipping']), (req, res) => {
  try {
    const shipments = db.findShipments({ shippingCompanyId: req.user.id });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments', details: error.message });
  }
});

// Accept a shipping job (create shipment from order)
router.post('/shipments', authenticateToken, requireRole(['shipping']), (req, res) => {
  try {
    const { orderId, estimatedDeliveryDate, shippingCost } = req.body;

    if (!orderId || !estimatedDeliveryDate || !shippingCost) {
      return res.status(400).json({ error: 'Order ID, estimated delivery date, and shipping cost are required' });
    }

    const order = db.findOrders().find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'ready') {
      return res.status(400).json({ error: 'Order is not ready for shipping' });
    }

    const shipment = db.createShipment({
      orderId,
      shippingCompanyId: req.user.id,
      estimatedDeliveryDate,
      shippingCost: parseFloat(shippingCost),
      pickupAddress: 'Supplier Address', // In real app, get from supplier
      deliveryAddress: order.shippingAddress,
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });

    // Update order status
    db.updateOrder(orderId, { status: 'shipped', shipmentId: shipment.id });

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment', details: error.message });
  }
});

// Update shipment status
router.patch('/shipments/:id/status', authenticateToken, requireRole(['shipping']), (req, res) => {
  try {
    const { status, location, notes } = req.body;
    
    if (!['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const shipment = db.findShipments().find(s => s.id === req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    if (shipment.shippingCompanyId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own shipments' });
    }

    const updates = { 
      status,
      currentLocation: location,
      lastUpdated: new Date(),
      statusHistory: [
        ...(shipment.statusHistory || []),
        {
          status,
          timestamp: new Date(),
          location,
          notes
        }
      ]
    };

    if (status === 'delivered') {
      updates.deliveredAt = new Date();
      // Update related order status
      const order = db.findOrders().find(o => o.id === shipment.orderId);
      if (order) {
        db.updateOrder(order.id, { status: 'completed' });
      }
    }

    const updatedShipment = db.updateShipment(req.params.id, updates);

    res.json({
      message: 'Shipment status updated successfully',
      shipment: updatedShipment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipment status', details: error.message });
  }
});

module.exports = router;