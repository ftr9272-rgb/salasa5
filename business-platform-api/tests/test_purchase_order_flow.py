import json
import os
import pytest

from src.main import app
from src.models.supplier import db, User, Supplier
from src.models.merchant import Merchant, PurchaseOrder, PurchaseOrderItem


@pytest.fixture(scope='module')
def test_client():
    # Ensure app uses a testing config
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    # Optionally allow token in response for test flow
    app.config['RETURN_RESET_TOKEN'] = True

    with app.test_client() as client:
        with app.app_context():
            yield client


def ensure_test_merchant():
    # Create or find user test_integration if not exists
    user = User.query.filter_by(username='test_integration').first()
    if not user:
        user = User(username='test_integration', email='test_integration@example.com', full_name='Test Integration', user_type='merchant', is_active=True)
        user.set_password('Password123!')
        db.session.add(user)
        db.session.commit()
    merchant = Merchant.query.filter_by(user_id=user.id).first()
    if not merchant:
        merchant = Merchant(user_id=user.id, store_name='Integration Store')
        db.session.add(merchant)
        db.session.commit()
    return user, merchant


def test_create_purchase_order_flow(test_client):
    with app.app_context():
        # ensure DB state
        user, merchant = ensure_test_merchant()
        # ensure a supplier exists
        supplier = Supplier.query.first()
        if not supplier:
            supplier = Supplier(user_id=user.id, company_name='Integration Supplier')
            db.session.add(supplier)
            db.session.commit()

    # login via API
    login_resp = test_client.post('/api/auth/login', json={'username': 'test_integration', 'password': 'Password123!'})
    assert login_resp.status_code == 200, f"login failed: {login_resp.data}"
    data = json.loads(login_resp.data)
    token = data.get('token')
    assert token, 'no token returned from login'

    # create purchase order
    headers = {'Authorization': f'Bearer {token}'}
    payload = {
        'supplier_id': supplier.id,
        'items': [
            {'product_name': 'Integration Item', 'quantity': 2, 'unit_price': 10.5}
        ],
        'currency': 'SAR',
        'payment_method': 'bank_transfer',
        'delivery_address': 'Test Address',
        'notes': 'Integration test order'
    }

    po_resp = test_client.post('/api/merchant/purchase-orders', json=payload, headers=headers)
    assert po_resp.status_code == 201, f"create PO failed: {po_resp.status_code} {po_resp.data}"
    po_data = json.loads(po_resp.data)
    assert 'purchase_order' in po_data
    po = po_data['purchase_order']
    assert po['supplier_id'] == supplier.id
    assert float(po['total_amount']) == 21.0

    # confirm DB row exists
    with app.app_context():
        created = PurchaseOrder.query.filter_by(id=po['id']).first()
        assert created is not None
        items = PurchaseOrderItem.query.filter_by(purchase_order_id=created.id).all()
        assert len(items) == 1
        assert items[0].product_name == 'Integration Item'
