#!/usr/bin/env python3
"""فحص المستخدمين في قاعدة البيانات"""

import sys
import os

# إضافة المسار إلى sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from models.supplier import User, db
from main import app

def check_users():
    with app.app_context():
        users = User.query.all()
        print(f"عدد المستخدمين: {len(users)}")
        for user in users:
            print(f"- اسم المستخدم: {user.username}")
            print(f"  النوع: {user.user_type}")
            print(f"  نشط: {user.is_active}")
            print(f"  الإيميل: {user.email}")
            print("---")

if __name__ == "__main__":
    check_users()