import React, { useState, useCallback } from 'react';
import { Eye, FileText, Copy, Volume2 } from 'lucide-react';
// motion is used via JSX tags; ESLint's no-unused-vars may false-positive here
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { generateImageDescription, generateAccessibleDescription, isValidDescription } from '../../utils/imageDescriber';

/**
 * ImageDescriber Component
 * Provides interactive image description functionality
 */
const ImageDescriber = ({ 
  src, 
  alt = '', 
  context = '', 
  userType = 'merchant',
  currentSection = 'dashboard',
  lang = 'ar',
  showControls = true,
  className = '',
  ...props 
}) => {
  const [isDescribing, setIsDescribing] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionMode, setDescriptionMode] = useState('basic'); // 'basic', 'accessible', 'detailed'

  // Generate description based on current mode
  const generateDescription = useCallback(() => {
    setIsDescribing(true);
    
    setTimeout(() => {
      let newDescription;
      const businessContext = `${userType}-${currentSection}`;
      
      switch (descriptionMode) {
        case 'accessible':
          newDescription = generateAccessibleDescription(src, alt, context || businessContext, {
            lang,
            includeContext: true,
            verbose: false
          });
          break;
        case 'detailed':
          newDescription = generateAccessibleDescription(src, alt, context || businessContext, {
            lang,
            includeContext: true,
            verbose: true
          });
          break;
        default:
          newDescription = generateImageDescription(src, alt, context || businessContext, lang);
      }
      
      setDescription(newDescription);
      setIsDescribing(false);
    }, 500); // Simulate processing time
  }, [src, alt, context, userType, currentSection, lang, descriptionMode]);

  // Copy description to clipboard
  const copyDescription = useCallback(async () => {
    if (description) {
      try {
        await navigator.clipboard.writeText(description);
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy description:', err);
      }
    }
  }, [description]);

  // Text-to-speech functionality
  const speakDescription = useCallback(() => {
    if (description && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [description, lang]);

  // Auto-generate description on mount
  React.useEffect(() => {
    if (src) {
      generateDescription();
    }
  }, [generateDescription, src]);

  return (
    <div className={`image-describer relative ${className}`}>
      {/* Main Image */}
      <img
        src={src}
        alt={description || alt}
        className="w-full h-auto rounded-lg shadow-md"
        {...props}
      />
      
      {/* Controls Overlay */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-2 flex gap-2"
        >
          {/* Description Mode Toggle */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            <select
              value={descriptionMode}
              onChange={(e) => setDescriptionMode(e.target.value)}
              className="text-xs border-none bg-transparent focus:outline-none"
              title={lang === 'ar' ? 'نوع الوصف' : 'Description type'}
            >
              <option value="basic">{lang === 'ar' ? 'أساسي' : 'Basic'}</option>
              <option value="accessible">{lang === 'ar' ? 'إمكانية الوصول' : 'Accessible'}</option>
              <option value="detailed">{lang === 'ar' ? 'مفصل' : 'Detailed'}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm flex gap-1">
            <button
              onClick={generateDescription}
              disabled={isDescribing}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={lang === 'ar' ? 'إعادة وصف الصورة' : 'Re-describe image'}
            >
              <Eye className="h-3 w-3" />
            </button>
            
            {description && (
              <>
                <button
                  onClick={copyDescription}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={lang === 'ar' ? 'نسخ الوصف' : 'Copy description'}
                >
                  <Copy className="h-3 w-3" />
                </button>
                
                <button
                  onClick={speakDescription}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={lang === 'ar' ? 'قراءة الوصف' : 'Read description'}
                >
                  <Volume2 className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Description Panel */}
      {description && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-gray-50 rounded-lg border"
        >
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {lang === 'ar' ? 'وصف الصورة:' : 'Image Description:'}
              </div>
              <div className="text-sm text-gray-800 leading-relaxed">
                {isDescribing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-600 rounded-full"></div>
                    <span>{lang === 'ar' ? 'جاري تحليل الصورة...' : 'Analyzing image...'}</span>
                  </div>
                ) : (
                  description
                )}
              </div>
              
              {/* Validation indicator */}
              {!isDescribing && description && (
                <div className="mt-2 flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${
                    isValidDescription(description) ? 'bg-green-500' : 'bg-amber-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {isValidDescription(description) 
                      ? (lang === 'ar' ? 'وصف مفيد' : 'Meaningful description')
                      : (lang === 'ar' ? 'وصف عام' : 'Generic description')
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageDescriber;