import React, { useRef, useState } from 'react';

interface PhotoUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative overflow-hidden rounded-2xl border-4 border-dashed cursor-pointer transition-all duration-300
          ${selectedImage ? 'border-purple-300 bg-purple-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
          ${isDragging ? 'scale-105 border-purple-500 bg-purple-100' : ''}
          shadow-sm h-64 flex flex-col items-center justify-center text-center
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt="Uploaded Preview" 
            className="w-full h-full object-contain p-2 rounded-xl"
          />
        ) : (
          <div className="space-y-3 p-4">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              📷
            </div>
            <div>
              <p className="text-lg font-bold text-gray-700">사진 업로드</p>
              <p className="text-sm text-gray-500">클릭하거나 사진을 드래그하세요</p>
            </div>
            <p className="text-xs text-purple-600 font-medium bg-purple-50 py-1 px-3 rounded-full inline-block">
              ★ 얼굴이 잘 나온 정면 사진 추천
            </p>
          </div>
        )}

        {selectedImage && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">사진 변경하기</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;