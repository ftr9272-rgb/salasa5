#!/usr/bin/env python3
"""إنشاء البيانات التجريبية يدوياً"""

import sys
import os

# إضافة المسار إلى sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models.supplier import User, db
from main import app

def create_demo_users():
    with app.app_context():
        # فحص المستخدمين الموجودين
        existing_users = User.query.all()
        print(f"عدد المستخدمين الموجودين: {len(existing_users)}")
        
        # حذف قاعدة البيانات وإعادة إنشائها
        print("حذف وإعادة إنشاء قاعدة البيانات...")
        db.drop_all()
        db.create_all()
        
        # إنشاء مستخدم مورد
        supplier_user = User(
            username='supplier_demo',
            email='supplier@demo.com',
            full_name='شركة الإمدادات المتقدمة',
            phone='+966501234567',
            user_type='supplier',
            is_active=True
        )
        supplier_user.set_password('123456')
        db.session.add(supplier_user)
        
        # إنشاء مستخدم تاجر
        merchant_user = User(
            username='merchant_demo',
            email='merchant@demo.com',
            full_name='متجر الأسواق الحديثة',
            phone='+966502345678',
            user_type='merchant',
            is_active=True
        )
        merchant_user.set_password('123456')
        db.session.add(merchant_user)
        
        # إنشاء مستخدم شركة شحن
        shipping_user = User(
            username='shipping_demo',
            email='shipping@demo.com',
            full_name='شركة التوصيل السريع',
            phone='+966503456789',
            user_type='shipping',
            is_active=True
        )
        shipping_user.set_password('123456')
        db.session.add(shipping_user)
        
        # حفظ التغييرات
        db.session.commit()
        
        print("تم إنشاء المستخدمين التجريبيين:")
        print("- supplier_demo / 123456 (مورد)")
        print("- merchant_demo / 123456 (تاجر)")
        print("- shipping_demo / 123456 (شركة شحن)")

if __name__ == "__main__":
    create_demo_users()