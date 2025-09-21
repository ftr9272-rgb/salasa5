// Simple in-memory database simulation
// In a real application, this would be replaced with a proper database like MongoDB, PostgreSQL, etc.

class Database {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.shipments = [];
  }

  // User operations
  createUser(user) {
    const newUser = { ...user, id: this.generateId(), createdAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  // Product operations
  createProduct(product) {
    const newProduct = { ...product, id: this.generateId(), createdAt: new Date() };
    this.products.push(newProduct);
    return newProduct;
  }

  findProducts(filters = {}) {
    let result = this.products;
    
    if (filters.supplierId) {
      result = result.filter(product => product.supplierId === filters.supplierId);
    }
    
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return result;
  }

  findProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates, updatedAt: new Date() };
      return this.products[index];
    }
    return null;
  }

  // Order operations
  createOrder(order) {
    const newOrder = { 
      ...order, 
      id: this.generateId(), 
      status: 'pending',
      createdAt: new Date() 
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  findOrders(filters = {}) {
    let result = this.orders;
    
    if (filters.supplierId) {
      result = result.filter(order => order.supplierId === filters.supplierId);
    }
    
    if (filters.retailerId) {
      result = result.filter(order => order.retailerId === filters.retailerId);
    }
    
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    return result;
  }

  updateOrder(id, updates) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updates, updatedAt: new Date() };
      return this.orders[index];
    }
    return null;
  }

  // Shipment operations
  createShipment(shipment) {
    const newShipment = { 
      ...shipment, 
      id: this.generateId(), 
      status: 'pending',
      createdAt: new Date() 
    };
    this.shipments.push(newShipment);
    return newShipment;
  }

  findShipments(filters = {}) {
    let result = this.shipments;
    
    if (filters.shippingCompanyId) {
      result = result.filter(shipment => shipment.shippingCompanyId === filters.shippingCompanyId);
    }
    
    if (filters.orderId) {
      result = result.filter(shipment => shipment.orderId === filters.orderId);
    }
    
    if (filters.status) {
      result = result.filter(shipment => shipment.status === filters.status);
    }
    
    return result;
  }

  updateShipment(id, updates) {
    const index = this.shipments.findIndex(shipment => shipment.id === id);
    if (index !== -1) {
      this.shipments[index] = { ...this.shipments[index], ...updates, updatedAt: new Date() };
      return this.shipments[index];
    }
    return null;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new Database();