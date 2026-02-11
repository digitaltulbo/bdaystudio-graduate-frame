/**
 * Compress and resize an image from a base64 string.
 * @param base64Str The original image as a base64 string.
 * @param maxWidth The maximum width for the resized image (default: 1024px).
 * @param quality The JPEG quality (0 to 1, default: 0.8).
 * @returns A promise that resolves to the compressed base64 string (image/jpeg).
 */
export const compressImage = (
    base64Str: string,
    maxWidth = 1024,
    quality = 0.8
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions if image is larger than maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Draw image formatted to the new dimensions
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with specified quality
                // forcing jpeg to ensure compression works effectively
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => reject(error);
    });
};
