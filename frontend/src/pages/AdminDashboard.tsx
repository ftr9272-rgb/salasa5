import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  Truck, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import './AdminDashboard.css';

// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

// StatCard Component
const StatCard = ({ title, value, icon, color, change }: StatCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 stat-card"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-arabic">{title}</p>
        <h3 className="text-xl font-bold text-foreground mt-1 font-arabic">{value}</h3>
        {change && (
          <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'} font-arabic`}>
            {change} منذ الأسبوع الماضي
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// UserRow Component
const UserRow = ({ user, onEdit, onDelete, onToggleStatus }: { user: User, onEdit: (user: User) => void, onDelete: (user: User) => void, onToggleStatus: (user: User) => void }) => (
  <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
    <td className="py-3 px-4 text-xs font-arabic">{user.name}</td>
    <td className="py-3 px-4 text-xs text-muted-foreground font-arabic">{user.email}</td>
    <td className="py-3 px-4">
      <span className={`px-2 py-1 rounded-full text-xs font-arabic status-badge ${
        user.role === 'merchant' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
        user.role === 'supplier' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
        user.role === 'shipping_company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
        user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      }`}>
        {user.role === 'merchant' ? 'تاجر' : 
         user.role === 'supplier' ? 'مورد' : 
         user.role === 'shipping_company' ? 'شركة شحن' : 
         user.role === 'admin' ? 'مدير' : user.role}
      </span>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-arabic status-badge mr-2 ${
          user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {user.status === 'active' ? 'نشط' : 'غير نشط'}
        </span>
        <button 
          onClick={() => onToggleStatus(user)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full ${
            user.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
            user.status === 'active' ? 'translate-x-4' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </td>
    <td className="py-3 px-4 text-xs text-muted-foreground font-arabic">
      {new Date(user.lastActive).toLocaleDateString('ar-SA')}
    </td>
    <td className="py-3 px-4">
      <div className="flex space-x-2 space-x-reverse">
        <button 
          onClick={() => onEdit(user)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-arabic"
        >
          تعديل
        </button>
        <button 
          onClick={() => onDelete(user)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-arabic"
        >
          حذف
        </button>
      </div>
    </td>
  </tr>
);

// OrderRow Component
const OrderRow = ({ order, onEdit, onDelete }: { order: Order, onEdit: (order: Order) => void, onDelete: (order: Order) => void }) => (
  <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
    <td className="py-3 px-4 text-xs font-mono font-arabic">#{order.id}</td>
    <td className="py-3 px-4 text-xs font-arabic">{order.customer}</td>
    <td className="py-3 px-4 text-xs font-arabic">{order.amount.toLocaleString()} ريال</td>
    <td className="py-3 px-4">
      <span className={`px-2 py-1 rounded-full text-xs font-arabic status-badge ${
        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
        order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {order.status === 'pending' ? 'معلق' :
         order.status === 'processing' ? 'قيد المعالجة' :
         order.status === 'shipped' ? 'تم الشحن' : 'تم التسليم'}
      </span>
    </td>
    <td className="py-3 px-4 text-xs text-muted-foreground font-arabic">
      {new Date(order.date).toLocaleDateString('ar-SA')}
    </td>
    <td className="py-3 px-4">
      <div className="flex space-x-2 space-x-reverse">
        <button 
          onClick={() => onEdit(order)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-arabic"
        >
          تعديل
        </button>
        <button 
          onClick={() => onDelete(order)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-arabic"
        >
          حذف
        </button>
      </div>
    </td>
  </tr>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // State for modals and forms
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'merchant',
    status: 'active' as 'active' | 'inactive'
  });
  const [newOrder, setNewOrder] = useState({
    customer: '',
    amount: 0,
    status: 'pending' as 'pending' | 'processing' | 'shipped' | 'delivered'
  });

  // Theme state
  const [theme, setTheme] = useState('light');
  const isDark = theme === 'dark';

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Mock data initialization
  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Mock users data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        role: 'merchant',
        status: 'active',
        lastActive: '2025-09-28'
      },
      {
        id: '2',
        name: 'سارة أحمد',
        email: 'sara@example.com',
        role: 'supplier',
        status: 'active',
        lastActive: '2025-09-29'
      },
      {
        id: '3',
        name: 'شركة الشحن السريع',
        email: 'shipping@example.com',
        role: 'shipping_company',
        status: 'inactive',
        lastActive: '2025-09-25'
      },
      {
        id: '4',
        name: 'محمد علي',
        email: 'mohamed@example.com',
        role: 'merchant',
        status: 'active',
        lastActive: '2025-09-30'
      },
      {
        id: '5',
        name: 'فاطمة خالد',
        email: 'fatima@example.com',
        role: 'supplier',
        status: 'active',
        lastActive: '2025-09-29'
      },
      {
        id: '6',
        name: 'مدير النظام',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        lastActive: '2025-09-30'
      }
    ];

    // Mock orders data
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customer: 'أحمد محمد',
        amount: 1250,
        status: 'delivered',
        date: '2025-09-28'
      },
      {
        id: 'ORD-002',
        customer: 'سارة أحمد',
        amount: 890,
        status: 'shipped',
        date: '2025-09-29'
      },
      {
        id: 'ORD-003',
        customer: 'محمد علي',
        amount: 2100,
        status: 'processing',
        date: '2025-09-30'
      },
      {
        id: 'ORD-004',
        customer: 'فاطمة خالد',
        amount: 650,
        status: 'pending',
        date: '2025-09-30'
      }
    ];

    setUsers(mockUsers);
    setOrders(mockOrders);
  }, [user, navigate]);

  // Handler functions for user actions
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const handleToggleUserStatus = (user: User) => {
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } as User
        : u
    );
    setUsers(updatedUsers);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteUserModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleAddOrder = () => {
    setIsAddOrderModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteOrderModalOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter(o => o.id !== selectedOrder.id));
      setIsDeleteOrderModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Form handlers
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value
      });
    }
  };

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleEditOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        [name]: name === 'amount' ? Number(value) : value
      });
    }
  };

  const submitNewUser = () => {
    const userToAdd: User = {
      id: `user-${Date.now()}`,
      ...newUser,
      lastActive: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, userToAdd]);
    setIsAddUserModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'merchant',
      status: 'active'
    });
  };

  const submitEditUser = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      );
      setUsers(updatedUsers);
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
    }
  };

  const submitNewOrder = () => {
    const orderToAdd: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, orderToAdd]);
    setIsAddOrderModalOpen(false);
    setNewOrder({
      customer: '',
      amount: 0,
      status: 'pending'
    });
  };

  const submitEditOrder = () => {
    if (selectedOrder) {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? selectedOrder : order
      );
      setOrders(updatedOrders);
      setIsEditOrderModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const saveSettings = () => {
    // In a real application, this would save to a backend
    console.log('Settings saved');
    // Show a success message
    alert('تم حفظ الإعدادات بنجاح');
  };

  // Stats data
  const stats = [
    { title: 'إجمالي المستخدمين', value: '1,248', icon: <Users className="w-5 h-5 text-white" />, color: 'bg-blue-500', change: '+12%' },
    { title: 'إجمالي الطلبات', value: '3,456', icon: <ShoppingCart className="w-5 h-5 text-white" />, color: 'bg-green-500', change: '+8%' },
    { title: 'إجمالي الإيرادات', value: '245,680 ريال', icon: <DollarSign className="w-5 h-5 text-white" />, color: 'bg-purple-500', change: '+15%' },
    { title: 'متوسط الطلب', value: '320 ريال', icon: <BarChart3 className="w-5 h-5 text-white" />, color: 'bg-orange-500', change: '+3%' }
  ];

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background admin-dashboard" dir="rtl">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-foreground font-arabic">لوحة التحكم الإدارية</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 space-x-reverse">
              <button 
                onClick={() => setActiveSection('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'dashboard' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                الإحصائيات
              </button>
              <button 
                onClick={() => setActiveSection('users')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'users' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                إدارة المستخدمين
              </button>
              <button 
                onClick={() => setActiveSection('orders')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'orders' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                إدارة الطلبات
              </button>
              <button 
                onClick={() => setActiveSection('merchants')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'merchants' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                التجار
              </button>
              <button 
                onClick={() => setActiveSection('suppliers')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'suppliers' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                الموردين
              </button>
              <button 
                onClick={() => setActiveSection('shipping')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'shipping' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                الشحن
              </button>
              <button 
                onClick={() => setActiveSection('settings')}
                className={`px-3 py-2 rounded-lg transition-colors font-arabic text-xs ${
                  activeSection === 'settings' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                الإعدادات
              </button>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الغامق"}
              >
                {isDark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
              </button>
              <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors relative">
                <Bell className="w-4 h-4 text-foreground" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative flex items-center gap-2">
                <div className="relative">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleProfile} className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center"><User className="w-3 h-3 text-white" /></div>
                    <span className="hidden sm:block text-xs font-arabic text-foreground">{user?.name}</span>
                  </motion.button>

                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs font-arabic text-foreground font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">مدير النظام</p>
                      </div>

                      <Link to="/profile" className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-xs text-foreground hover:bg-secondary transition-colors font-arabic" onClick={() => setIsProfileOpen(false)}>
                        <User className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>

                      <button onClick={handleLogout} className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-xs text-red-600 hover:bg-secondary transition-colors w-full font-arabic">
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button 
                className="md:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border py-4"
            >
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => { setActiveSection('dashboard'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'dashboard' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  الإحصائيات
                </button>
                <button 
                  onClick={() => { setActiveSection('users'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'users' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  إدارة المستخدمين
                </button>
                <button 
                  onClick={() => { setActiveSection('orders'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'orders' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  إدارة الطلبات
                </button>
                <button 
                  onClick={() => { setActiveSection('merchants'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'merchants' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  التجار
                </button>
                <button 
                  onClick={() => { setActiveSection('suppliers'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'suppliers' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  الموردين
                </button>
                <button 
                  onClick={() => { setActiveSection('shipping'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'shipping' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  الشحن
                </button>
                <button 
                  onClick={() => { setActiveSection('settings'); setMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-colors font-arabic text-sm text-right ${
                    activeSection === 'settings' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  الإعدادات
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Background overlay for closing menus */}
      {(mobileMenuOpen || isProfileOpen) && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => { setMobileMenuOpen(false); setIsProfileOpen(false); }} />
      )}

      {/* Dashboard Content */}
      <div className="container mx-auto p-4 md:p-6">
        {/* Stats Grid */}
        {activeSection === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  change={stat.change}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl shadow-sm"
              >
                <div className="p-5 border-b border-border flex justify-between items-center">
                  <h3 className="text-base font-bold text-foreground font-arabic">أحدث المستخدمين</h3>
                  <button 
                    onClick={handleAddUser}
                    className="flex items-center space-x-1 space-x-reverse px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الاسم</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">البريد الإلكتروني</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الدور</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <UserRow 
                          key={user.id} 
                          user={user} 
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          onToggleStatus={handleToggleUserStatus}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border">
                  <Link to="#" className="text-primary hover:underline text-xs font-arabic">عرض جميع المستخدمين</Link>
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-xl shadow-sm"
              >
                <div className="p-5 border-b border-border flex justify-between items-center">
                  <h3 className="text-base font-bold text-foreground font-arabic">أحدث الطلبات</h3>
                  <button 
                    onClick={handleAddOrder}
                    className="flex items-center space-x-1 space-x-reverse px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">رقم الطلب</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">العميل</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">المبلغ</th>
                        <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <OrderRow 
                          key={order.id} 
                          order={order} 
                          onEdit={handleEditOrder}
                          onDelete={handleDeleteOrder}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border">
                  <Link to="#" className="text-primary hover:underline text-xs font-arabic">عرض جميع الطلبات</Link>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Users Management Section */}
        {activeSection === 'users' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-base font-bold text-foreground font-arabic mb-4 md:mb-0">إدارة المستخدمين</h3>
              <div className="flex space-x-2 space-x-reverse">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="البحث عن مستخدمين..."
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  />
                </div>
                <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  <Filter className="w-4 h-4" />
                  <span>تصفية</span>
                </button>
                <button 
                  onClick={handleAddUser}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مستخدم</span>
                </button>
                <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  <Download className="w-4 h-4" />
                  <span>تصدير</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الاسم</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">البريد الإلكتروني</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الدور</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الحالة</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">آخر نشاط</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      onToggleStatus={handleToggleUserStatus}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-arabic">عرض 1 إلى {users.length} من {users.length} مستخدم</p>
              <div className="flex space-x-2 space-x-reverse">
                <button className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  السابق
                </button>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-arabic text-xs">
                  التالي
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Management Section */}
        {activeSection === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-base font-bold text-foreground font-arabic mb-4 md:mb-0">إدارة الطلبات</h3>
              <div className="flex space-x-2 space-x-reverse">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="البحث عن طلبات..."
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  />
                </div>
                <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  <Filter className="w-4 h-4" />
                  <span>تصفية</span>
                </button>
                <button 
                  onClick={handleAddOrder}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة طلب</span>
                </button>
                <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  <Download className="w-4 h-4" />
                  <span>تصدير</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">رقم الطلب</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">العميل</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">المبلغ</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">الحالة</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">التاريخ</th>
                    <th className="py-3 px-4 text-right text-xs font-arabic text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderRow 
                      key={order.id} 
                      order={order} 
                      onEdit={handleEditOrder}
                      onDelete={handleDeleteOrder}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-arabic">عرض 1 إلى {orders.length} من {orders.length} طلب</p>
              <div className="flex space-x-2 space-x-reverse">
                <button className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors font-arabic text-xs">
                  السابق
                </button>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-arabic text-xs">
                  التالي
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Merchants Section */}
        {activeSection === 'merchants' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">إدارة التجار</h3>
              <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs">
                <Plus className="w-4 h-4" />
                <span>إضافة تاجر</span>
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
                <Store className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 font-arabic">لا توجد بيانات تجار</h4>
              <p className="text-muted-foreground mb-4 font-arabic">ابدأ بإضافة تجار جدد لإدارتهم من هنا</p>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                إضافة تاجر جديد
              </button>
            </div>
          </motion.div>
        )}

        {/* Suppliers Section */}
        {activeSection === 'suppliers' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">إدارة الموردين</h3>
              <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs">
                <Plus className="w-4 h-4" />
                <span>إضافة مورد</span>
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/50 mb-4">
                <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 font-arabic">لا توجد بيانات موردين</h4>
              <p className="text-muted-foreground mb-4 font-arabic">ابدأ بإضافة موردين جدد لإدارتهم من هنا</p>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                إضافة مورد جديد
              </button>
            </div>
          </motion.div>
        )}

        {/* Shipping Section */}
        {activeSection === 'shipping' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">إدارة الشحن</h3>
              <button className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-xs">
                <Plus className="w-4 h-4" />
                <span>إضافة شركة شحن</span>
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-4">
                <Truck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 font-arabic">لا توجد بيانات شحن</h4>
              <p className="text-muted-foreground mb-4 font-arabic">ابدأ بإضافة شركات شحن جديدة لإدارتها من هنا</p>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                إضافة شركة شحن جديدة
              </button>
            </div>
          </motion.div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-border">
              <h3 className="text-base font-bold text-foreground font-arabic">إعدادات النظام</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary/30 rounded-lg p-5">
                  <h4 className="font-bold text-foreground mb-4 font-arabic">إعدادات عامة</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">اسم النظام</label>
                      <input
                        type="text"
                        defaultValue="منصة أعمالي"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                        id="system-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        defaultValue="admin@business-platform.com"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                        id="admin-email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">اللغة الافتراضية</label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic">
                        <option>العربية</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-arabic text-foreground">تفعيل التسجيل</p>
                        <p className="text-xs text-muted-foreground font-arabic">السماح للمستخدمين الجدد بالتسجيل</p>
                      </div>
                      <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-green-500">
                        <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-5">
                  <h4 className="font-bold text-foreground mb-4 font-arabic">إعدادات التصميم</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">لون النظام</label>
                      <div className="flex space-x-2 space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-blue-500"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer border-2 border-transparent hover:border-green-300"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer border-2 border-transparent hover:border-purple-300"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer border-2 border-transparent hover:border-orange-300"></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">حجم الخط</label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic">
                        <option>صغير</option>
                        <option selected>متوسط</option>
                        <option>كبير</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-arabic text-foreground">الوضع الليلي</p>
                        <p className="text-xs text-muted-foreground font-arabic">تفعيل الوضع الليلي تلقائياً</p>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className="relative inline-flex h-5 w-9 items-center rounded-full bg-green-500"
                      >
                        <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-5 md:col-span-2">
                  <h4 className="font-bold text-foreground mb-4 font-arabic">إعدادات الأمان</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">فترة صلاحية الجلسة (بالساعات)</label>
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">عدد محاولات تسجيل الدخول</label>
                      <input
                        type="number"
                        defaultValue="3"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-arabic text-foreground mb-2">فترة الحظر (بالدقائق)</label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-arabic text-foreground">تفعيل المصادقة الثنائية</p>
                      <p className="text-xs text-muted-foreground font-arabic">زيادة أمان الحسابات</p>
                    </div>
                    <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                      <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={saveSettings}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </motion.div>
        )}
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">إضافة مستخدم جديد</h3>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل الاسم"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الدور</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="merchant">تاجر</option>
                  <option value="supplier">مورد</option>
                  <option value="shipping_company">شركة شحن</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الحالة</label>
                <select
                  name="status"
                  value={newUser.status}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={submitNewUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                إضافة
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">تعديل المستخدم</h3>
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleEditUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل الاسم"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleEditUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الدور</label>
                <select
                  name="role"
                  value={selectedUser.role}
                  onChange={handleEditUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="merchant">تاجر</option>
                  <option value="supplier">مورد</option>
                  <option value="shipping_company">شركة شحن</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الحالة</label>
                <select
                  name="status"
                  value={selectedUser.status}
                  onChange={handleEditUserFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsEditUserModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={submitEditUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                حفظ التغييرات
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">تأكيد الحذف</h3>
              <button 
                onClick={() => setIsDeleteUserModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-foreground font-arabic">
                هل أنت متأكد من رغبتك في حذف المستخدم <span className="font-bold">{selectedUser.name}</span>؟
              </p>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsDeleteUserModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-arabic text-sm"
              >
                حذف
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Order Modal */}
      {isAddOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">إضافة طلب جديد</h3>
              <button 
                onClick={() => setIsAddOrderModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">اسم العميل</label>
                <input
                  type="text"
                  name="customer"
                  value={newOrder.customer}
                  onChange={handleOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">المبلغ (ريال)</label>
                <input
                  type="number"
                  name="amount"
                  value={newOrder.amount}
                  onChange={handleOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الحالة</label>
                <select
                  name="status"
                  value={newOrder.status}
                  onChange={handleOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="pending">معلق</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsAddOrderModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={submitNewOrder}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                إضافة
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">تعديل الطلب</h3>
              <button 
                onClick={() => setIsEditOrderModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">رقم الطلب</label>
                <input
                  type="text"
                  value={selectedOrder.id}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic opacity-70"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">اسم العميل</label>
                <input
                  type="text"
                  name="customer"
                  value={selectedOrder.customer}
                  onChange={handleEditOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">المبلغ (ريال)</label>
                <input
                  type="number"
                  name="amount"
                  value={selectedOrder.amount}
                  onChange={handleEditOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div>
                <label className="block text-xs font-arabic text-foreground mb-2">الحالة</label>
                <select
                  name="status"
                  value={selectedOrder.status}
                  onChange={handleEditOrderFormChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-xs font-arabic"
                >
                  <option value="pending">معلق</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsEditOrderModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={submitEditOrder}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-arabic text-sm"
              >
                حفظ التغييرات
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {isDeleteOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-arabic">تأكيد الحذف</h3>
              <button 
                onClick={() => setIsDeleteOrderModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-foreground font-arabic">
                هل أنت متأكد من رغبتك في حذف الطلب <span className="font-bold">#{selectedOrder.id}</span>؟
              </p>
            </div>
            <div className="p-5 border-t border-border flex justify-end space-x-2 space-x-reverse">
              <button 
                onClick={() => setIsDeleteOrderModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-arabic text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-arabic text-sm"
              >
                حذف
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;