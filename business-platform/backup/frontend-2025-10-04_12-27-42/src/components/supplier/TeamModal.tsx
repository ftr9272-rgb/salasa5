import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  X, Users, UserPlus, Mail, Phone, Shield, 
  Edit, Trash2, Search, Filter, MoreVertical,
  Crown, Star, AlertCircle, Check, Eye, EyeOff
} from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamData: TeamMember[]) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'viewer';
  department: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  permissions: string[];
}

const roles = [
  { 
    value: 'owner', 
    label: 'المالك', 
    color: 'bg-purple-100 text-purple-800',
    icon: Crown,
    description: 'صلاحيات كاملة'
  },
  { 
    value: 'admin', 
    label: 'مدير عام', 
    color: 'bg-red-100 text-red-800',
    icon: Shield,
    description: 'إدارة النظام والمستخدمين'
  },
  { 
    value: 'manager', 
    label: 'مدير قسم', 
    color: 'bg-blue-100 text-blue-800',
    icon: Star,
    description: 'إدارة الفريق والمشاريع'
  },
  { 
    value: 'employee', 
    label: 'موظف', 
    color: 'bg-green-100 text-green-800',
    icon: Users,
    description: 'صلاحيات أساسية'
  },
  { 
    value: 'viewer', 
    label: 'مشاهد', 
    color: 'bg-gray-100 text-gray-800',
    icon: Eye,
    description: 'عرض فقط'
  }
];

const departments = [
  'المبيعات', 'التسويق', 'المالية', 'الموارد البشرية', 
  'تقنية المعلومات', 'خدمة العملاء', 'اللوجستية', 'الشؤون القانونية'
];

const permissions = [
  { id: 'view_products', label: 'عرض المنتجات' },
  { id: 'edit_products', label: 'تعديل المنتجات' },
  { id: 'view_orders', label: 'عرض الطلبات' },
  { id: 'edit_orders', label: 'تعديل الطلبات' },
  { id: 'view_customers', label: 'عرض العملاء' },
  { id: 'edit_customers', label: 'تعديل العملاء' },
  { id: 'view_reports', label: 'عرض التقارير' },
  { id: 'export_data', label: 'تصدير البيانات' },
  { id: 'manage_inventory', label: 'إدارة المخزون' },
  { id: 'financial_access', label: 'الوصول المالي' }
];

function TeamModal({ isOpen, onClose, onSave }: TeamModalProps) {
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@company.com',
      phone: '966501234567',
      role: 'owner',
      department: 'الإدارة',
      avatar: '👨‍💼',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      permissions: permissions.map(p => p.id)
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'fatima@company.com',
      phone: '966507654321',
      role: 'admin',
      department: 'المبيعات',
      avatar: '👩‍💼',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      permissions: ['view_products', 'edit_products', 'view_orders', 'edit_orders', 'view_reports']
    },
    {
      id: '3',
      name: 'خالد عبدالله',
      email: 'khalid@company.com',
      phone: '966509876543',
      role: 'manager',
      department: 'التسويق',
      avatar: '👨‍💻',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-18',
      permissions: ['view_products', 'view_customers', 'view_reports', 'export_data']
    }
  ]);

  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: '',
    permissions: []
  });

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const validateMember = (member: Partial<TeamMember>): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!member.name?.trim()) newErrors.name = 'الاسم مطلوب';
    if (!member.email?.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!member.department?.trim()) newErrors.department = 'القسم مطلوب';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (member.email && !emailRegex.test(member.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    // Check if email already exists (for new members)
    if (!editingMember && member.email && teamMembers.some(m => m.email === member.email)) {
      newErrors.email = 'البريد الإلكتروني موجود بالفعل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = () => {
    if (validateMember(newMember)) {
      const memberToAdd: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name!,
        email: newMember.email!,
        phone: newMember.phone || '',
        role: newMember.role as any,
        department: newMember.department!,
        avatar: '👤',
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: 'لم يسجل دخول بعد',
        permissions: newMember.permissions || []
      };
      
      setTeamMembers(prev => [...prev, memberToAdd]);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        department: '',
        permissions: []
      });
      setShowAddMember(false);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setNewMember(member);
    setShowAddMember(true);
  };

  const handleUpdateMember = () => {
    if (validateMember(newMember) && editingMember) {
      setTeamMembers(prev => prev.map(m => 
        m.id === editingMember.id 
          ? { ...m, ...newMember as TeamMember }
          : m
      ));
      setEditingMember(null);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        department: '',
        permissions: []
      });
      setShowAddMember(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const toggleMemberPermission = (permission: string) => {
    setNewMember(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...(prev.permissions || []), permission]
    }));
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[4];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      default: return 'غير محدد';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">إدارة الفريق</h2>
                  <p className="text-blue-100">إدارة أعضاء الفريق والصلاحيات</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في الفريق..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">جميع الأدوار</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddMember(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                إضافة عضو
              </button>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredMembers.map((member) => {
                const roleInfo = getRoleInfo(member.role);
                const RoleIcon = roleInfo.icon;
                
                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.department}</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{member.email}</span>
                      </div>
                      
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{member.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleInfo.label}
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {getStatusLabel(member.status)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      <p>انضم في: {member.joinDate}</p>
                      <p>آخر دخول: {member.lastLogin}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        تعديل
                      </button>
                      
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Team Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {roles.map(role => {
                const count = teamMembers.filter(m => m.role === role.value).length;
                const IconComponent = role.icon;
                
                return (
                  <div key={role.value} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{role.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{count}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add/Edit Member Modal */}
          <AnimatePresence>
            {showAddMember && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4"
                onClick={() => setShowAddMember(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      {editingMember ? 'تعديل عضو الفريق' : 'إضافة عضو جديد'}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الاسم الكامل *
                          </label>
                          <input
                            type="text"
                            value={newMember.name || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="أحمد محمد"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            البريد الإلكتروني *
                          </label>
                          <input
                            type="email"
                            value={newMember.email || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="ahmed@company.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رقم الهاتف
                          </label>
                          <input
                            type="tel"
                            value={newMember.phone || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="966501234567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            القسم *
                          </label>
                          <select
                            value={newMember.department || ''}
                            onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              errors.department ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">اختر القسم</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          {errors.department && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.department}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          الدور الوظيفي
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {roles.filter(role => role.value !== 'owner' || editingMember?.role === 'owner').map(role => {
                            const IconComponent = role.icon;
                            return (
                              <label key={role.value} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="role"
                                  value={role.value}
                                  checked={newMember.role === role.value}
                                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as any }))}
                                  className="sr-only"
                                />
                                <div className={`p-3 rounded-xl border-2 transition-all ${
                                  newMember.role === role.value 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color}`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800">{role.label}</h4>
                                      <p className="text-xs text-gray-600">{role.description}</p>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          الصلاحيات
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4">
                          {permissions.map(permission => (
                            <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newMember.permissions?.includes(permission.id) || false}
                                onChange={() => toggleMemberPermission(permission.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowAddMember(false)}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        إلغاء
                      </button>
                      
                      <button
                        onClick={editingMember ? handleUpdateMember : handleAddMember}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {editingMember ? 'حفظ التغييرات' : 'إضافة العضو'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إغلاق
            </button>
            
            <button
              onClick={() => onSave(teamMembers)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              حفظ إعدادات الفريق
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TeamModal;