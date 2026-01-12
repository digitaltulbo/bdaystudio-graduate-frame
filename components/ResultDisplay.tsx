import React from 'react';

interface ResultDisplayProps {
  originalImage: string;
  resultImage: string;
  onDownload: () => void;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, resultImage, onDownload, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🎉 졸업사진이 완성되었습니다!</h2>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          
          {/* Before */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">원본</span>
            <div className="relative w-48 h-64 md:w-64 md:h-80 rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
              <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-3xl text-purple-300 transform rotate-90 md:rotate-0">
             ➜
          </div>

          {/* After */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-bold text-white bg-purple-600 px-3 py-1 rounded-full shadow-lg">졸업사진</span>
            <div className="relative w-48 h-64 md:w-64 md:h-80 rounded-xl overflow-hidden shadow-2xl border-4 border-purple-200 ring-4 ring-purple-50">
              <img src={resultImage} alt="Generated Graduation Photo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            🔄 다시 만들기
          </button>
          
          <button 
            onClick={onDownload}
            className="px-8 py-4 rounded-2xl bg-green-500 text-white font-bold text-lg shadow-lg hover:bg-green-600 hover:shadow-green-200/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            💾 이미지 저장하기
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          * AI 생성 이미지는 실제와 다를 수 있으며, 얼굴이 100% 보존되도록 최선을 다했습니다.
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;