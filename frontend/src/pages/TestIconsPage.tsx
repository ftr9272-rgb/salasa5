import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Shield, BarChart3, Globe, Zap, Truck, ShoppingCart, Package, Award, Clock, Headphones, LogIn } from 'lucide-react';

const TestIconsPage = () => {
  const icons = [
    { Icon: ArrowRight, name: 'ArrowRight' },
    { Icon: CheckCircle, name: 'CheckCircle' },
    { Icon: Star, name: 'Star' },
    { Icon: Users, name: 'Users' },
    { Icon: TrendingUp, name: 'TrendingUp' },
    { Icon: Shield, name: 'Shield' },
    { Icon: BarChart3, name: 'BarChart3' },
    { Icon: Globe, name: 'Globe' },
    { Icon: Zap, name: 'Zap' },
    { Icon: Truck, name: 'Truck' },
    { Icon: ShoppingCart, name: 'ShoppingCart' },
    { Icon: Package, name: 'Package' },
    { Icon: Award, name: 'Award' },
    { Icon: Clock, name: 'Clock' },
    { Icon: Headphones, name: 'Headphones' },
    { Icon: LogIn, name: 'LogIn' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 اختبار أيقونات Lucide React
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            جميع الأيقونات المستخدمة في LandingPage
          </p>
          <Link 
            to="/test" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للاختبار
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {icons.map(({ Icon, name }) => (
            <div key={name} className="bg-white rounded-lg p-4 shadow-md text-center">
              <Icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
              <p className="text-sm text-gray-600">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestIconsPage;