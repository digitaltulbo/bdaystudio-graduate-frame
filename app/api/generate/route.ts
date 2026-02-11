import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createHash } from 'crypto';
import { GraduationOptions } from '@/types';

const MODEL_NAME = 'gemini-3-pro-image-preview';

// --- Upload Logging (to macOS Docker) ---
async function sendUploadLog(
    base64Data: string,
    ip: string,
    options: GraduationOptions
): Promise<void> {
    const uploadUrl = process.env.UPLOAD_API_URL;
    const uploadKey = process.env.UPLOAD_API_KEY;

    if (!uploadUrl || !uploadKey) {
        console.warn('[Upload Log] UPLOAD_API_URL or UPLOAD_API_KEY not set, skipping');
        return;
    }

    try {
        const sha256Hash = createHash('sha256').update(base64Data).digest('hex');
        const fileSize = Math.ceil(base64Data.length * 3 / 4); // approximate decoded size

        await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${uploadKey}`,
            },
            body: JSON.stringify({
                imageBase64: base64Data,
                ip,
                fileSize,
                sha256Hash,
                options: {
                    schoolLevel: options.schoolLevel,
                    gownColor: options.gownColor,
                    background: options.background,
                    confetti: options.confetti,
                },
                timestamp: new Date().toISOString(),
            }),
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });
    } catch (error) {
        console.error('[Upload Log] Failed to send:', error);
        // Non-blocking: don't throw, Gemini generation continues
    }
}

// --- Rate Limiting (IP-based, in-memory) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW_MS = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
        return false;
    }

    if (entry.count >= RATE_LIMIT) {
        return true;
    }

    entry.count++;
    return false;
}

// Cleanup old entries periodically (prevent memory leak)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60 * 1000);

export async function POST(request: NextRequest) {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요.' },
            { status: 429 }
        );
    }

    // Validate API key exists on server
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in environment variables');
        return NextResponse.json(
            { error: '서버 설정 오류입니다. 관리자에게 문의해주세요.' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { imageBase64, options } = body as {
            imageBase64: string;
            options: GraduationOptions;
        };

        if (!imageBase64 || !options) {
            return NextResponse.json(
                { error: '이미지와 옵션이 필요합니다.' },
                { status: 400 }
            );
        }

        // Clean base64 string
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

        // --- Upload logging (non-blocking, failure-tolerant) ---
        sendUploadLog(base64Data, ip, options);

        const prompt = `
    ACT AS: "Graduation Photo Generator v2.0". 
    TASK: Generate a high-quality graduation photo based on the uploaded image.
    
    [CRITICAL INSTRUCTION - IDENTITY LOCK]
    Use the EXACT same face from the uploaded photo. Do NOT change ANY facial features. Lock onto every pixel of the face.
    - Eyes, Nose, Mouth, Eyebrows: Must be 100% identical to the original.
    - Skin texture, moles, scars: Preserve perfectly.
    - Facial shape, jawline: Do NOT slim or alter.
    - Expression: Keep the exact original expression.
    - DO NOT BEAUTIFY OR "FIX" THE FACE. It must look like the EXACT same person.

    [RENDERING DETAILS]
    1. SUBJECT: The person in the photo wearing a graduation gown and cap (mortarboard).
       - School Level: ${options.schoolLevel} (Adjust cap/gown size and style appropriately).
       - Gown Color: ${options.gownColor}.
       - Cap: Matching the gown, sitting naturally on the head. Tassel visible.
    
    2. BACKGROUND: ${options.background}.
       - If it's a solid color, make it professional studio lighting.
       - If it's a theme (like Cherry Blossom), apply a soft blur for depth.
    
    3. CONFETTI: ${options.confetti}
       ${options.confetti !== '없음' ? '- Scattered naturally in the background. DO NOT cover the face.' : '- No confetti.'}
    
    4. TEXT: 
       ${options.customText ? `- elegantly written at the bottom center: "${options.customText}"` : '- No text overlay.'}
    
    5. STYLE: Professional Studio Photography. High resolution, sharp focus on eyes, soft flattering lighting.
    
    6. ASPECT RATIO: 2:3 Portrait.
    `;

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data,
                        },
                    },
                ],
            },
            config: {
                imageConfig: {
                    aspectRatio: '3:4',
                    imageSize: '1K',
                },
            },
        });

        // Extract image from response
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
                return NextResponse.json({
                    imageBase64: `data:image/png;base64,${part.inlineData.data}`,
                });
            }
        }

        return NextResponse.json(
            { error: '이미지를 생성하지 못했습니다. 다시 시도해주세요.' },
            { status: 500 }
        );
    } catch (error: any) {
        console.error('Generate API Error:', error);
        return NextResponse.json(
            { error: error.message || '이미지 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
