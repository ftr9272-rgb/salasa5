// Salasa5 Platform Frontend JavaScript
class Salasa5App {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
        this.baseURL = '/api';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Navigation events
        document.getElementById('login-btn').addEventListener('click', () => this.showLogin());
        document.getElementById('register-btn').addEventListener('click', () => this.showRegister());
        document.getElementById('back-to-landing').addEventListener('click', () => this.showLanding());
        document.getElementById('back-to-landing-2').addEventListener('click', () => this.showLanding());
        document.getElementById('dashboard-btn').addEventListener('click', () => this.showDashboard());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Form events
        document.getElementById('login-form-element').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form-element').addEventListener('submit', (e) => this.handleRegister(e));
    }

    checkAuthStatus() {
        if (this.token) {
            this.getCurrentUser();
        } else {
            this.showLanding();
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.makeRequest('/auth/me', 'GET');
            if (response.ok) {
                this.currentUser = await response.json();
                this.updateUI();
                this.showDashboard();
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Error getting current user:', error);
            this.logout();
        }
    }

    updateUI() {
        if (this.currentUser) {
            document.getElementById('auth-buttons').style.display = 'none';
            document.getElementById('user-menu').style.display = 'flex';
            document.getElementById('user-name').textContent = this.currentUser.name;
        } else {
            document.getElementById('auth-buttons').style.display = 'flex';
            document.getElementById('user-menu').style.display = 'none';
        }
    }

    showSection(sectionId) {
        const sections = ['landing', 'login-form', 'register-form', 'dashboard'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    showLanding() {
        this.showSection('landing');
    }

    showLogin() {
        this.showSection('login-form');
    }

    showRegister() {
        this.showSection('register-form');
    }

    async showDashboard() {
        if (!this.currentUser) return;
        
        this.showSection('dashboard');
        await this.loadDashboard();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await this.makeRequest('/auth/login', 'POST', {
                email,
                password
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('token', this.token);
                this.updateUI();
                this.showDashboard();
                this.showSuccess('تم تسجيل الدخول بنجاح');
            } else {
                this.showError(data.error || 'خطأ في تسجيل الدخول');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('خطأ في الاتصال');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;
        const companyName = document.getElementById('register-company').value;

        try {
            const response = await this.makeRequest('/auth/register', 'POST', {
                name,
                email,
                password,
                role,
                companyName
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول');
                this.showLogin();
            } else {
                this.showError(data.error || 'خطأ في إنشاء الحساب');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showError('خطأ في الاتصال');
        }
    }

    async loadDashboard() {
        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = '<div class="loading">جاري التحميل...</div>';

        try {
            const endpoint = this.getDashboardEndpoint();
            const response = await this.makeRequest(endpoint, 'GET');
            
            if (response.ok) {
                const data = await response.json();
                this.renderDashboard(data);
            } else {
                dashboardContent.innerHTML = '<div class="error">خطأ في تحميل البيانات</div>';
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            dashboardContent.innerHTML = '<div class="error">خطأ في الاتصال</div>';
        }
    }

    getDashboardEndpoint() {
        switch (this.currentUser.role) {
            case 'supplier':
                return '/suppliers/dashboard';
            case 'retailer':
                return '/retailers/dashboard';
            case 'shipping':
                return '/shipping/dashboard';
            default:
                return '/products';
        }
    }

    renderDashboard(data) {
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (this.currentUser.role === 'supplier') {
            this.renderSupplierDashboard(dashboardContent, data);
        } else if (this.currentUser.role === 'retailer') {
            this.renderRetailerDashboard(dashboardContent, data);
        } else if (this.currentUser.role === 'shipping') {
            this.renderShippingDashboard(dashboardContent, data);
        }
    }

    renderSupplierDashboard(container, data) {
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${data.statistics.totalProducts}</h3>
                    <p>إجمالي المنتجات</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.totalOrders}</h3>
                    <p>إجمالي الطلبات</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.pendingOrders}</h3>
                    <p>طلبات معلقة</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.completedOrders}</h3>
                    <p>طلبات مكتملة</p>
                </div>
            </div>
            
            <h3>المنتجات</h3>
            ${this.renderProductsTable(data.products)}
            
            <h3>الطلبات الحديثة</h3>
            ${this.renderOrdersTable(data.orders)}
        `;
    }

    renderRetailerDashboard(container, data) {
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${data.statistics.totalOrders}</h3>
                    <p>إجمالي طلباتي</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.pendingOrders}</h3>
                    <p>طلبات معلقة</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.processingOrders}</h3>
                    <p>طلبات قيد المعالجة</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.completedOrders}</h3>
                    <p>طلبات مكتملة</p>
                </div>
            </div>
            
            <h3>المنتجات المتاحة</h3>
            ${this.renderProductsTable(data.availableProducts, true)}
            
            <h3>طلباتي</h3>
            ${this.renderOrdersTable(data.orders)}
        `;
    }

    renderShippingDashboard(container, data) {
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${data.statistics.totalShipments}</h3>
                    <p>إجمالي الشحنات</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.pendingShipments}</h3>
                    <p>شحنات معلقة</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.inTransitShipments}</h3>
                    <p>شحنات في الطريق</p>
                </div>
                <div class="stat-card">
                    <h3>${data.statistics.deliveredShipments}</h3>
                    <p>شحنات مسلمة</p>
                </div>
            </div>
            
            <h3>الطلبات المتاحة للشحن</h3>
            ${this.renderOrdersTable(data.availableOrders)}
            
            <h3>شحناتي</h3>
            ${this.renderShipmentsTable(data.shipments)}
        `;
    }

    renderProductsTable(products, showOrderButton = false) {
        if (!products || products.length === 0) {
            return '<p>لا توجد منتجات</p>';
        }

        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>اسم المنتج</th>
                        <th>السعر</th>
                        <th>الكمية</th>
                        <th>الفئة</th>
                        ${showOrderButton ? '<th>إجراء</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.price} ر.س</td>
                            <td>${product.quantity}</td>
                            <td>${product.category}</td>
                            ${showOrderButton ? `<td><button class="btn btn-primary" onclick="app.orderProduct('${product.id}')">طلب</button></td>` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderOrdersTable(orders) {
        if (!orders || orders.length === 0) {
            return '<p>لا توجد طلبات</p>';
        }

        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>المنتج</th>
                        <th>الكمية</th>
                        <th>المبلغ</th>
                        <th>الحالة</th>
                        <th>التاريخ</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.productName}</td>
                            <td>${order.quantity}</td>
                            <td>${order.totalAmount} ر.س</td>
                            <td><span class="status ${order.status}">${this.getStatusText(order.status)}</span></td>
                            <td>${new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderShipmentsTable(shipments) {
        if (!shipments || shipments.length === 0) {
            return '<p>لا توجد شحنات</p>';
        }

        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>رقم الشحنة</th>
                        <th>رقم التتبع</th>
                        <th>الحالة</th>
                        <th>الموقع الحالي</th>
                        <th>تاريخ التوصيل المتوقع</th>
                    </tr>
                </thead>
                <tbody>
                    ${shipments.map(shipment => `
                        <tr>
                            <td>${shipment.id}</td>
                            <td>${shipment.trackingNumber}</td>
                            <td><span class="status ${shipment.status}">${this.getStatusText(shipment.status)}</span></td>
                            <td>${shipment.currentLocation || 'غير محدد'}</td>
                            <td>${new Date(shipment.estimatedDeliveryDate).toLocaleDateString('ar-SA')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'معلق',
            'accepted': 'مقبول',
            'rejected': 'مرفوض',
            'processing': 'قيد المعالجة',
            'ready': 'جاهز للشحن',
            'shipped': 'تم الشحن',
            'delivered': 'تم التوصيل',
            'completed': 'مكتمل',
            'in_transit': 'في الطريق',
            'out_for_delivery': 'خارج للتوصيل',
            'failed': 'فشل'
        };
        return statusMap[status] || status;
    }

    async orderProduct(productId) {
        const quantity = prompt('كم الكمية المطلوبة؟');
        const address = prompt('عنوان التوصيل:');
        
        if (!quantity || !address) return;

        try {
            const response = await this.makeRequest('/retailers/orders', 'POST', {
                productId,
                quantity: parseInt(quantity),
                shippingAddress: address
            });

            if (response.ok) {
                this.showSuccess('تم إنشاء الطلب بنجاح');
                this.loadDashboard();
            } else {
                const data = await response.json();
                this.showError(data.error || 'خطأ في إنشاء الطلب');
            }
        } catch (error) {
            console.error('Order error:', error);
            this.showError('خطأ في الاتصال');
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        this.updateUI();
        this.showLanding();
    }

    async makeRequest(endpoint, method = 'GET', body = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        return fetch(this.baseURL + endpoint, config);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// Initialize the app
const app = new Salasa5App();