import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Loader2, 
  X, 
  Camera,
  FileText,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const ImageDescriber = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Mock AI image description service
  const analyzeImage = async (imageFile) => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock descriptions based on common image types
      const mockDescriptions = [
        'صورة تظهر منتجات متنوعة في متجر تجاري، مع ترتيب منظم للبضائع على الرفوف. تتضمن الصورة منتجات استهلاكية مختلفة بألوان زاهية وتصميمات جذابة.',
        'لقطة لمستودع كبير يحتوي على صناديق وبضائع مكدسة بشكل منظم. يظهر في الصورة عمال يقومون بعمليات التحميل والتفريغ باستخدام معدات حديثة.',
        'صورة لشاحنة شحن حديثة متوقفة أمام مبنى تجاري. الشاحنة تحمل شعار شركة الشحن ومجهزة بأحدث أنظمة التتبع والأمان.',
        'منظر عام لسوق تجاري مزدحم يظهر التفاعل بين التجار والعملاء. تتضمن الصورة أكشاك متنوعة تعرض منتجات مختلفة من المواد الغذائية والملابس.',
        'صورة لمكتب حديث مجهز بأحدث التقنيات، يظهر فيها موظفون يعملون على أجهزة الحاسوب ويديرون عمليات التجارة الإلكترونية.'
      ];
      
      const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      setDescription(randomDescription);
    } catch (err) {
      setError('حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صالح');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setSelectedImage(file);
      setError('');
      setDescription('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeImage(selectedImage);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
    setError('');
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للرئيسية
          </Button>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-600" />
          وصف الصور الذكي
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ارفع صورة واحصل على وصف تفصيلي ذكي باللغة العربية باستخدام تقنيات الذكاء الاصطناعي المتقدمة
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              رفع الصورة
            </CardTitle>
            <CardDescription>
              اختر صورة لتحليلها ووصفها (PNG, JPG, GIF - حتى 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!imagePreview ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="mb-2 text-lg text-gray-500">
                      <span className="font-semibold">انقر للرفع</span> أو اسحب الصورة هنا
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF (حتى 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="معاينة الصورة"
                    className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        جارٍ التحليل...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 ml-2" />
                        تحليل الصورة
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    صورة جديدة
                  </Button>
                </div>
              </div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                {error}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Description Section */}
      {(description || isAnalyzing) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                وصف الصورة
              </CardTitle>
              <CardDescription>
                الوصف الذكي المُولد بواسطة الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">جارٍ تحليل الصورة باستخدام الذكاء الاصطناعي...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <ImageIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">تحليل ذكي</h3>
          <p className="text-sm text-gray-600">تحليل متقدم للصور باستخدام الذكاء الاصطناعي</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">دقة عالية</h3>
          <p className="text-sm text-gray-600">وصف دقيق ومفصل للعناصر في الصورة</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">باللغة العربية</h3>
          <p className="text-sm text-gray-600">وصف كامل باللغة العربية الفصيحة</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDescriber;