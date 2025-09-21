from src.models.supplier import db, User
from src.models.merchant import Merchant
from src.main import app

with app.app_context():
    user = User.query.filter_by(username='test_migrated').first()
    if not user:
        print('User test_migrated not found')
    else:
        merchant = Merchant.query.filter_by(user_id=user.id).first()
        if merchant:
            print('Merchant profile already exists for test_migrated')
        else:
            merchant = Merchant(
                user_id=user.id,
                store_name='Test Migrant Store',
                store_address='Test Address',
                store_type='general'
            )
            db.session.add(merchant)
            db.session.commit()
            print('Created merchant profile with id', merchant.id)
