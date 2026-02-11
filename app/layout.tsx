import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '졸업사진 생성기 v2.0',
    description: 'AI로 자연스러운 졸업사진을 만들어 보세요',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
                    rel="stylesheet"
                />
                <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
                <style>{`
          body {
            font-family: 'Noto Sans KR', sans-serif;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #c0a0e0;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #a080c0;
          }
        `}</style>
            </head>
            <body className="bg-[#Fdfcf8]">{children}</body>
        </html>
    );
}
