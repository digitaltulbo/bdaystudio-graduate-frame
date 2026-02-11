'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GraduationOptions, SchoolLevel, GownColor, BackgroundStyle, ConfettiType } from '@/types';
import PhotoUploader from '@/components/PhotoUploader';
import OptionSelector from '@/components/OptionSelector';
import ResultDisplay from '@/components/ResultDisplay';
import LoadingScreen from '@/components/LoadingScreen';

import { compressImage } from '@/utils/image';

export default function Home() {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

    useEffect(() => {
        const savedAuth = sessionStorage.getItem('is_authenticated');
        if (savedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, []);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput }),
            });

            const data = await res.json();

            if (data.success) {
                setIsAuthenticated(true);
                sessionStorage.setItem('is_authenticated', 'true');
            } else {
                setAuthError('비밀번호가 올바르지 않습니다.');
            }
        } catch (err) {
            setAuthError('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelected = useCallback((base64: string) => {
        setOriginalImage(base64);
        setResultImage(null);
        setError(null);
    }, []);

    const handleGenerate = async () => {
        if (!originalImage) return;

        setIsLoading(true);
        setError(null);

        try {
            // Compress image for API to avoid payload limit (413)
            // Preview remains high quality (originalImage)
            const compressedBase64 = await compressImage(originalImage, 1024, 0.8);

            const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));

            // Call server-side API route instead of client-side Gemini SDK
            const generatePromise = fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send compressed image to API
                body: JSON.stringify({ imageBase64: compressedBase64, options }),
            }).then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || '이미지 생성 중 오류가 발생했습니다.');
                return data.imageBase64;
            });

            const [generatedBase64] = await Promise.all([generatePromise, minLoadTime]);

            setResultImage(generatedBase64);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        setOptions(defaultOptions);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isCheckingAuth) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#Fdfcf8] text-slate-800 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 max-w-md w-full text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">접속 권한 확인</h1>
                    <p className="text-gray-500 mb-8">서비스 이용을 위해 비밀번호를 입력해주세요.</p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="비밀번호 입력"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                            autoFocus
                        />
                        {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? '확인 중...' : '입력 완료'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#Fdfcf8] text-slate-800 pb-20">
            {isLoading && <LoadingScreen />}

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

            <main className="max-w-4xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                        <span>⚠️</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {!resultImage ? (
                    <div className="space-y-10 animate-fade-in-up">
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
                    <ResultDisplay
                        originalImage={originalImage!}
                        resultImage={resultImage}
                        onDownload={handleDownload}
                        onReset={handleReset}
                    />
                )}
            </main>

            <footer className="text-center text-gray-400 text-sm py-8">
                <p>© 2024 Graduation Photo Generator v2.0</p>
            </footer>
        </div>
    );
}
