import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Target, CheckCircle, Star, Calendar } from 'lucide-react';

interface MarketPrediction {
  category: string;
  trend: 'up' | 'down' | 'stable';
  percentage: string;
  period: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  sendTo?: 'market';
}

interface MarketPredictionsProps {
  userType?: 'merchant' | 'supplier' | 'shipping';
}

const MarketPredictions: React.FC<MarketPredictionsProps> = ({ userType = 'merchant' }) => {
  const predictions: MarketPrediction[] = [
    {
      category: 'المواد الغذائية الأساسية',
      trend: 'up',
      percentage: '+15%',
      period: 'الشهر القادم',
      confidence: 'high',
      description: 'ازدياد الطلب على المواد الأساسية مع اقتراب الموسم',
      impact: 'فرصة ذهبية لزيادة المخزون',
      sendTo: 'market'
    },
    {
      category: 'المنتجات الموسمية',
      trend: 'up',
      percentage: '+25%',
      period: 'الأسبوعين القادمين',
      confidence: 'high',
      description: 'موسم الأعياد يزيد الطلب على المنتجات الموسمية',
      impact: 'أولوية عالية للتجهيز',
      sendTo: 'market'
    },
    {
      category: 'الإلكترونيات',
      trend: 'stable',
      percentage: '±3%',
      period: 'هذا الشهر',
      confidence: 'medium',
      description: 'استقرار نسبي في سوق الإلكترونيات',
      impact: 'فترة مناسبة للتخطيط',
      sendTo: 'market'
    },
    {
      category: 'منتجات التجميل',
      trend: 'down',
      percentage: '-8%',
      period: 'الشهر القادم',
      confidence: 'medium',
      description: 'انخفاض متوقع بعد انتهاء العروض الموسمية',
      impact: 'وقت مناسب للتخفيضات',
      sendTo: 'market'
    },
    {
      category: 'ملابس الشتاء',
      trend: 'up',
      percentage: '+30%',
      period: 'الشهرين القادمين',
      confidence: 'high',
      description: 'اقتراب فصل الشتاء يرفع الطلب بشدة',
      impact: 'فرصة استثنائية للربح',
      sendTo: 'market'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-amber-600" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-red-500 bg-red-50 border-red-200';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50';
      case 'down':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-amber-600 bg-amber-50';
    }
  };

  const getRecommendationsForUser = (userType: string) => {
    switch (userType) {
      case 'merchant':
        return [
          'ركز على المواد الغذائية الأساسية للشهر القادم',
          'جهز مخزون ملابس الشتاء مبكراً',
          'استغل الفترة المستقرة للإلكترونيات في التخطيط'
        ];
      case 'supplier':
        return [
          'اضبط سلاسل التوريد للمواد الموسمية',
          'تأكد من توفر المخزون للمنتجات عالية الطلب',
          'فكر في شراكات جديدة للمنتجات الرائجة'
        ];
      case 'shipping':
        return [
          'استعد لزيادة شحنات المواد الغذائية',
          'وفر سعة إضافية لموسم الأعياد',
          'خطط لمسارات توصيل محسنة للمناطق عالية الطلب'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-arabic">توقعات السوق</h2>
            <p className="text-sm text-muted-foreground">تحليل الاتجاهات والتنبؤات القادمة</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-arabic">تحديث يومي</span>
        </motion.button>
      </div>

      {/* بطاقات التوقعات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            {/* رأس البطاقة */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                {getTrendIcon(prediction.trend)}
                <h3 className="font-semibold text-foreground font-arabic text-sm">{prediction.category}</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(prediction.confidence)}`}>
                {prediction.confidence === 'high' ? 'عالية' : prediction.confidence === 'medium' ? 'متوسطة' : 'منخفضة'}
              </div>
            </div>

            {/* النسبة والفترة */}
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getTrendColor(prediction.trend)}`}>
                {prediction.percentage}
              </div>
              <span className="text-xs text-muted-foreground">{prediction.period}</span>
            </div>

            {/* الوصف */}
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed font-arabic">
              {prediction.description}
            </p>

            {/* التأثير */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start space-x-2 space-x-reverse">
                <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-primary font-medium font-arabic">
                  {prediction.impact}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* التوصيات المخصصة */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground font-arabic">توصيات مخصصة لك</h3>
        </div>
        
        <div className="space-y-2">
          {getRecommendationsForUser(userType).map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start space-x-3 space-x-reverse"
            >
              <Star className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-foreground font-arabic">{recommendation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MarketPredictions;