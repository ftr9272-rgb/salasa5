import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '٢٤٥,٨٩٠',
      unit: 'ر.س',
      change: '+١٢.٥%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'الطلبات الجديدة',
      value: '١,٢٣٤',
      unit: 'طلب',
      change: '+٨.٢%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'العملاء النشطون',
      value: '٨٩٢',
      unit: 'عميل',
      change: '+١٥.٣%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'المنتجات المباعة',
      value: '٣,٤٥٦',
      unit: 'منتج',
      change: '-٢.١%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      title: 'طلب جديد من شركة الأمل التجارية',
      description: 'طلب شراء بقيمة ١٢,٥٠٠ ر.س',
      time: 'منذ ٥ دقائق',
      status: 'جديد',
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'payment',
      title: 'تم استلام دفعة من مؤسسة النور',
      description: 'دفعة بقيمة ٨,٧٥٠ ر.س',
      time: 'منذ ١٥ دقيقة',
      status: 'مكتمل',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'quotation',
      title: 'عرض سعر جديد مطلوب',
      description: 'طلب عرض سعر من شركة الرياض للتجارة',
      time: 'منذ ٣٠ دقيقة',
      status: 'معلق',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      type: 'partner',
      title: 'شريك جديد انضم للمنصة',
      description: 'مؤسسة الخليج للمواد الغذائية',
      time: 'منذ ساعة',
      status: 'جديد',
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    {
      title: 'إنشاء طلب شراء',
      description: 'أنشئ طلب شراء جديد',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      action: 'create-order'
    },
    {
      title: 'إضافة شريك جديد',
      description: 'أضف شريك تجاري جديد',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      action: 'add-partner'
    },
    {
      title: 'طلب عرض سعر',
      description: 'اطلب عرض سعر من الشركاء',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      action: 'request-quote'
    },
    {
      title: 'عرض التقارير',
      description: 'اطلع على التقارير التفصيلية',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      action: 'view-reports'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">مرحباً بك، أحمد! 👋</h1>
              <p className="text-blue-100 text-lg">إليك نظرة سريعة على أداء متجرك اليوم</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">٩٨%</div>
                <div className="text-sm text-blue-100">معدل الرضا</div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <Badge 
                      variant={stat.trend === 'up' ? 'default' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      <TrendIcon className="h-3 w-3" />
                      {stat.change}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.unit}</p>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    الأنشطة الأخيرة
                  </CardTitle>
                  <CardDescription>آخر التحديثات على حسابك</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 group-hover:scale-110 transition-transform`}></div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <Badge variant="secondary" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
              <CardDescription>الإجراءات الأكثر استخداماً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 rounded-2xl hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              نظرة عامة على الأداء
            </CardTitle>
            <CardDescription>مقارنة الأداء مع الشهر الماضي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">نمو المبيعات</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">+٢٨%</p>
                <p className="text-sm text-muted-foreground">مقارنة بالشهر الماضي</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">عملاء جدد</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">+١٥٦</p>
                <p className="text-sm text-muted-foreground">هذا الشهر</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">تقييم العملاء</h3>
                <p className="text-3xl font-bold text-purple-600 mb-1">٤.٩</p>
                <p className="text-sm text-muted-foreground">من ٥ نجوم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
