import React from 'react';
import { SCHOOL_LEVELS, GOWN_COLORS, BACKGROUNDS, CONFETTI_OPTIONS } from '../constants';
import { GraduationOptions } from '../types';

interface OptionSelectorProps {
  options: GraduationOptions;
  setOptions: React.Dispatch<React.SetStateAction<GraduationOptions>>;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, setOptions }) => {
  
  const updateOption = <K extends keyof GraduationOptions>(key: K, value: GraduationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 px-4 w-full max-w-2xl mx-auto">
      
      {/* 1. School Level */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
          학교급 선택
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SCHOOL_LEVELS.map((item) => (
            <button
              key={item.value}
              onClick={() => updateOption('schoolLevel', item.value)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                ${options.schoolLevel === item.value 
                  ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'}
              `}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Gown Color */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
          가운 색상
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {GOWN_COLORS.map((item) => (
            <button
              key={item.value}
              onClick={() => updateOption('gownColor', item.value)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                ${options.gownColor === item.value 
                  ? 'border-purple-600 bg-purple-50 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white hover:border-purple-200'}
              `}
            >
              <div 
                className="w-8 h-8 rounded-full border shadow-sm mb-1" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Background */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
          배경 선택
        </h3>
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {BACKGROUNDS.map((item) => (
            <button
              key={item.value}
              onClick={() => updateOption('background', item.value)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-xl border-2 transition-all
                ${options.background === item.value 
                  ? 'border-purple-600 bg-purple-50 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white hover:border-purple-200'}
              `}
            >
              <div 
                className="w-full h-12 rounded-lg mb-2 border" 
                style={{ background: item.color }}
              />
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Confetti */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">4</span>
          컨페티 효과 ✨
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CONFETTI_OPTIONS.map((item) => (
            <button
              key={item.value}
              onClick={() => updateOption('confetti', item.value)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                ${options.confetti === item.value 
                  ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'}
              `}
            >
              <span className="text-xl mb-1">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Custom Text */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">5</span>
          축하 문구 (선택)
        </h3>
        <div className="relative">
          <input
            type="text"
            maxLength={30}
            placeholder="예: 2026 졸업을 축하합니다"
            value={options.customText}
            onChange={(e) => updateOption('customText', e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-gray-600 bg-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-center text-white placeholder-gray-400 font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {options.customText.length}/30
          </div>
        </div>
      </section>
    </div>
  );
};

export default OptionSelector;