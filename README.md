# Salasa5 - منصة تربط بين الموردين وتجار التجزئة وشركات الشحن

## نظرة عامة

Salasa5 هي منصة شاملة تربط بين الموردين وتجار التجزئة وشركات الشحن، مما يسهل عمليات التجارة الإلكترونية وإدارة سلسلة التوريد.

## المميزات

### للموردين
- إضافة وإدارة المنتجات
- متابعة الطلبات والمبيعات
- تحديث حالة الطلبات
- لوحة تحكم شاملة للإحصائيات

### لتجار التجزئة
- تصفح كتالوج المنتجات
- إنشاء طلبات جديدة
- متابعة حالة الطلبات
- تتبع الشحنات

### لشركات الشحن
- قبول طلبات الشحن
- تتبع الشحنات
- تحديث حالة التوصيل
- إدارة أرقام التتبع

## التقنيات المستخدمة

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل تطبيقات الويب
- **JWT** - المصادقة والترخيص
- **bcryptjs** - تشفير كلمات المرور
- **CORS** - مشاركة الموارد عبر المصادر
- **Helmet** - الأمان

### Frontend
- **HTML5** - هيكل الصفحات
- **CSS3** - التصميم والتنسيق (RTL للعربية)
- **JavaScript** - التفاعل والوظائف
- **Fetch API** - التواصل مع الخادم

### أدوات التطوير
- **ESLint** - فحص جودة الكود
- **Jest** - اختبار الوحدات
- **Supertest** - اختبار API
- **Nodemon** - إعادة تشغيل التطوير

## التثبيت والتشغيل

### متطلبات النظام
- Node.js 14+ 
- npm 6+

### خطوات التثبيت

1. **استنساخ المشروع**
   ```bash
   git clone https://github.com/ftr9272-rgb/salasa5.git
   cd salasa5
   ```

2. **تثبيت التبعيات**
   ```bash
   npm install
   ```

3. **تشغيل الخادم**
   ```bash
   # للتطوير
   npm run dev
   
   # للإنتاج
   npm start
   ```

4. **الوصول للمنصة**
   - الواجهة الأمامية: http://localhost:3000
   - فحص صحة النظام: http://localhost:3000/health

## API Documentation

### Authentication

#### تسجيل مستخدم جديد
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@supplier.com",
  "password": "password123",
  "role": "supplier", // supplier, retailer, shipping
  "companyName": "شركة أحمد للتوريد"
}
```

#### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@supplier.com",
  "password": "password123"
}
```

### Products

#### عرض جميع المنتجات
```http
GET /api/products
```

#### إضافة منتج جديد (للموردين فقط)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "أجهزة كمبيوتر محمولة",
  "description": "أجهزة كمبيوتر محمولة عالية الجودة",
  "price": 2500,
  "category": "إلكترونيات",
  "quantity": 50
}
```

### Orders

#### إنشاء طلب جديد (لتجار التجزئة)
```http
POST /api/retailers/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 5,
  "shippingAddress": "الرياض، حي الملز"
}
```

#### تتبع طلب
```http
GET /api/orders/{orderId}/track?email=retailer@email.com
```

### Shipping

#### إنشاء شحنة
```http
POST /api/shipping/shipments
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id",
  "estimatedDeliveryDate": "2025-09-23",
  "shippingCost": 150
}
```

## سير العمل

### 1. المورد
1. تسجيل حساب كمورد
2. إضافة منتجات للكتالوج
3. استقبال طلبات من تجار التجزئة
4. قبول/رفض الطلبات
5. تحديث حالة الطلب إلى "جاهز للشحن"

### 2. تاجر التجزئة
1. تسجيل حساب كتاجر تجزئة
2. تصفح المنتجات المتاحة
3. إنشاء طلبات جديدة
4. متابعة حالة الطلبات
5. تتبع الشحنات

### 3. شركة الشحن
1. تسجيل حساب كشركة شحن
2. عرض الطلبات الجاهزة للشحن
3. قبول طلبات الشحن
4. إنشاء رقم تتبع
5. تحديث حالة الشحنة

## الاختبار

### تشغيل الاختبارات
```bash
# جميع الاختبارات
npm test

# فحص جودة الكود
npm run lint
```

### اختبار API يدوياً

```bash
# فحص صحة النظام
curl http://localhost:3000/health

# تسجيل مورد
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Supplier","email":"test@supplier.com","password":"password123","role":"supplier"}'

# تسجيل دخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@supplier.com","password":"password123"}'
```

## البنية التقنية

```
salasa5/
├── models/
│   └── database.js          # نموذج قاعدة البيانات (في الذاكرة)
├── routes/
│   ├── auth.js             # مسارات المصادقة
│   ├── products.js         # مسارات المنتجات
│   ├── suppliers.js        # مسارات الموردين
│   ├── retailers.js        # مسارات تجار التجزئة
│   ├── shipping.js         # مسارات الشحن
│   └── orders.js           # مسارات الطلبات
├── middleware/
│   └── auth.js             # وسطاء المصادقة
├── public/
│   ├── index.html          # الواجهة الأمامية
│   ├── style.css           # التصميم
│   └── app.js              # منطق التطبيق
├── tests/
│   └── api.test.js         # اختبارات API
├── server.js               # الخادم الرئيسي
└── package.json            # تبعيات المشروع
```

## الأمان

- تشفير كلمات المرور باستخدام bcrypt
- مصادقة باستخدام JWT tokens
- تحكم في الوصول حسب الأدوار
- حماية من CORS
- رؤوس أمان باستخدام Helmet

## التطوير المستقبلي

- [ ] قاعدة بيانات حقيقية (MongoDB/PostgreSQL)
- [ ] رفع الملفات للصور
- [ ] نظام دفع متكامل
- [ ] إشعارات فورية
- [ ] تطبيق موبايل
- [ ] تحليلات وتقارير متقدمة
- [ ] دعم متعدد اللغات
- [ ] API Gateway
- [ ] حاويات Docker

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل، يرجى إنشاء issue في المستودع.

---

© 2024 Salasa5. جميع الحقوق محفوظة.
