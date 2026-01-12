import React, { useState, useCallback } from 'react';
import { GraduationOptions, SchoolLevel, GownColor, BackgroundStyle, ConfettiType } from './types';
import PhotoUploader from './components/PhotoUploader';
import OptionSelector from './components/OptionSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingScreen from './components/LoadingScreen';
import { generateGraduationPhoto } from './services/geminiService';

const App: React.FC = () => {
  // Application State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default Options
  const defaultOptions: GraduationOptions = {
    schoolLevel: SchoolLevel.UNIVERSITY,
    gownColor: GownColor.BLACK,
    background: BackgroundStyle.GRADIENT_GRAY,
    confetti: ConfettiType.NONE,
    customText: '',
  };

  const [options, setOptions] = useState<GraduationOptions>(defaultOptions);

  const handleImageSelected = useCallback((base64: string) => {
    setOriginalImage(base64);
    setResultImage(null); // Reset result if new image uploaded
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate min loading time for UX (so user sees the loading screen)
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      const generationPromise = generateGraduationPhoto(originalImage, options);
      
      const [generatedBase64] = await Promise.all([generationPromise, minLoadTime]);
      
      setResultImage(generatedBase64);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `graduation_photo_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    setOptions(defaultOptions); // Reset options to default
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#Fdfcf8] text-slate-800 pb-20">
      {/* Loading Overlay */}
      {isLoading && <LoadingScreen />}

      {/* Header */}
      <header className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">졸업사진 생성기 v2.0</h1>
              <p className="text-xs text-purple-600 font-medium">스튜디오 전용 | 얼굴 100% 보존</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-purple-600 transition-colors"
          >
            처음으로
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* View Switcher: Input vs Result */}
        {!resultImage ? (
          <div className="space-y-10 animate-fade-in-up">
            
            {/* 1. Upload Section */}
            <section>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">사진을 올려주세요</h2>
                <p className="text-gray-500">정면이 잘 나온 사진일수록 결과가 좋습니다</p>
              </div>
              <PhotoUploader 
                onImageSelected={handleImageSelected} 
                selectedImage={originalImage} 
              />
            </section>

            {/* 2. Options Section (Only visible if image is uploaded) */}
            {originalImage && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-100">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">스타일을 선택해주세요</h2>
                  <div className="h-1 w-20 bg-purple-200 mx-auto rounded-full"></div>
                </div>
                
                <OptionSelector options={options} setOptions={setOptions} />

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                  <button
                    onClick={handleGenerate}
                    className="
                      w-full max-w-sm bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all
                      text-white text-xl font-bold py-5 rounded-2xl shadow-lg shadow-blue-200
                      flex items-center justify-center gap-3
                    "
                  >
                    <span>✨</span>
                    졸업사진 만들기
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Result View */
          <ResultDisplay 
            originalImage={originalImage!} 
            resultImage={resultImage} 
            onDownload={handleDownload} 
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-8">
        <p>© 2024 Graduation Photo Generator v2.0</p>
      </footer>
    </div>
  );
};

export default App;