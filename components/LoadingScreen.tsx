import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 border-8 border-purple-100 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🎓
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
        졸업사진을 만들고 있어요...
      </h2>
      <p className="text-gray-500 text-center max-w-sm">
        얼굴을 분석하고 예쁜 학사모를 씌우는 중입니다.<br/>
        잠시만 기다려주세요! (약 10~20초 소요)
      </p>

      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
};

export default LoadingScreen;