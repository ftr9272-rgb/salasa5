import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

// Mock AI service for image description
const analyzeImage = async (imageFile) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock descriptions based on common product types
  const mockDescriptions = [
    "صورة منتج عالي الجودة تظهر تفاصيل واضحة مع إضاءة ممتازة. المنتج يبدو جديداً ومعروضاً بطريقة احترافية.",
    "منتج مكتبي باللون الأبيض والأسود، يتميز بتصميم عصري وأنيق. الصورة تُظهر المنتج من زاوية مثالية.",
    "معدات تقنية حديثة تظهر في الصورة بوضوح عالي. التصميم يبدو متطوراً ومناسباً للاستخدام المهني.",
    "أثاث مكتبي بتصميم أنيق ولون محايد. الصورة تُبرز جودة المواد المستخدمة في التصنيع.",
    "منتج إلكتروني بتصميم حديث وألوان جذابة. الصورة توضح الميزات الرئيسية للمنتج بوضوح."
  ];
  
  return mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
};

const ImageDescription = ({ image, onDescriptionGenerated }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!image) {
      setError('يرجى تحديد صورة أولاً');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await analyzeImage(image);
      setDescription(result);
      if (onDescriptionGenerated) {
        onDescriptionGenerated(result);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          وصف الصورة بالذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {image && (
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {typeof image === 'string' ? (
                <img 
                  src={image} 
                  alt="معاينة الصورة" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="معاينة الصورة" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full max-w-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جاري تحليل الصورة...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  تحليل ووصف الصورة
                </>
              )}
            </Button>
          </div>
        )}

        {!image && (
          <div className="text-center text-gray-500 py-8">
            <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <p>قم بتحميل صورة أولاً لتحليلها ووصفها</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-blue-900 mb-2">وصف الصورة:</h4>
            <p className="text-blue-800 leading-relaxed">{description}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageDescription;