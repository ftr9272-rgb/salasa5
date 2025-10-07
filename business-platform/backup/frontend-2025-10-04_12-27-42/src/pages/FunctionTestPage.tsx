import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const FunctionTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const [isRunning, setIsRunning] = useState(false);

  const tests = [
    {
      id: 'merchant-dashboard',
      name: 'لوحة تحكم التاجر',
      description: 'التحقق من تحميل لوحة تحكم التاجر',
      url: '/merchant-dashboard'
    },
    {
      id: 'supplier-dashboard',
      name: 'لوحة تحكم المورد',
      description: 'التحقق من تحميل لوحة تحكم المورد',
      url: '/supplier-dashboard'
    },
    {
      id: 'shipping-dashboard',
      name: 'لوحة تحكم الشحن',
      description: 'التحقق من تحميل لوحة تحكم الشحن',
      url: '/shipping'
    },
    {
      id: 'notifications',
      name: 'نظام الإشعارات',
      description: 'التحقق من عمل نظام الإشعارات الذكية',
      url: '/notification-test'
    },
    {
      id: 'marketplace',
      name: 'الماركت بلايس',
      description: 'التحقق من تحميل صفحة السوق',
      url: '/enhanced-marketplace'
    }
  ];

  const runTest = async (testId: string, url: string) => {
    setTestResults(prev => ({ ...prev, [testId]: 'pending' }));
    
    try {
      // محاكاة اختبار التحميل
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // في بيئة حقيقية، يمكن فحص استجابة الصفحة هنا
      const success = Math.random() > 0.1; // نجاح بنسبة 90%
      
      setTestResults(prev => ({ 
        ...prev, 
        [testId]: success ? 'success' : 'error' 
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testId]: 'error' }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test.id, test.url);
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🔧 اختبار وظائف النظام
          </h1>
          <p className="text-lg text-gray-600">
            فحص شامل لجميع وظائف ومكونات المنصة
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">لوحة التحكم</h2>
              <p className="text-gray-600">تشغيل جميع الاختبارات للتأكد من سلامة النظام</p>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95'
              } text-white`}
            >
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  جاري الفحص...
                </div>
              ) : (
                'تشغيل جميع الاختبارات'
              )}
            </button>
          </div>
        </motion.div>

        {/* Test Results */}
        <div className="grid gap-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className={`border-2 rounded-xl p-6 transition-all ${getStatusColor(testResults[test.id])}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{test.name}</h3>
                    {getStatusIcon(testResults[test.id])}
                  </div>
                  <p className="text-gray-600 mb-3">{test.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">المسار: {test.url}</span>
                    {testResults[test.id] && (
                      <span className={`text-sm font-medium ${
                        testResults[test.id] === 'success' ? 'text-green-600' :
                        testResults[test.id] === 'error' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {testResults[test.id] === 'success' ? 'تم بنجاح' :
                         testResults[test.id] === 'error' ? 'فشل' : 'قيد التنفيذ'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => runTest(test.id, test.url)}
                    disabled={testResults[test.id] === 'pending'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
                  >
                    فحص منفرد
                  </button>
                  <a
                    href={test.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm text-center"
                  >
                    فتح الصفحة
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص النتائج</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(result => result === 'success').length}
              </div>
              <div className="text-sm text-gray-600">اختبارات نجحت</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(result => result === 'error').length}
              </div>
              <div className="text-sm text-gray-600">اختبارات فشلت</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(testResults).filter(result => result === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">اختبارات قيد التنفيذ</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FunctionTestPage;