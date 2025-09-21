const request = require('supertest');
const app = require('../server');

describe('Salasa5 Platform API Tests', () => {
  let supplierToken, retailerToken, shippingToken;
  let productId, orderId, shipmentId;

  test('Health check endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
    expect(response.body.message).toBe('Salasa5 Platform is running');
  });

  test('Register supplier', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Supplier',
        email: 'test@supplier.com',
        password: 'password123',
        role: 'supplier',
        companyName: 'Test Supply Co'
      })
      .expect(201);
    
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.role).toBe('supplier');
  });

  test('Login supplier', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@supplier.com',
        password: 'password123'
      })
      .expect(200);
    
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    supplierToken = response.body.token;
  });

  test('Supplier creates product', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${supplierToken}`)
      .send({
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        category: 'test',
        quantity: 10
      })
      .expect(201);
    
    expect(response.body.message).toBe('Product created successfully');
    expect(response.body.product.name).toBe('Test Product');
    productId = response.body.product.id;
  });

  test('Register retailer', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Retailer',
        email: 'test@retailer.com',
        password: 'password123',
        role: 'retailer',
        companyName: 'Test Retail Store'
      })
      .expect(201);
    
    expect(response.body.user.role).toBe('retailer');
  });

  test('Login retailer', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@retailer.com',
        password: 'password123'
      })
      .expect(200);
    
    retailerToken = response.body.token;
  });

  test('Retailer creates order', async () => {
    const response = await request(app)
      .post('/api/retailers/orders')
      .set('Authorization', `Bearer ${retailerToken}`)
      .send({
        productId,
        quantity: 2,
        shippingAddress: 'Test Address'
      })
      .expect(201);
    
    expect(response.body.message).toBe('Order created successfully');
    expect(response.body.order.quantity).toBe(2);
    orderId = response.body.order.id;
  });

  test('Get products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Track order (public endpoint)', async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}/track?email=test@retailer.com`)
      .expect(200);
    
    expect(response.body.orderId).toBe(orderId);
    expect(response.body.status).toBeDefined();
  });
});

module.exports = app;