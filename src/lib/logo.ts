// Turn an uploaded image file into a small, self-contained WebP data URL.
// Downscaling keeps localStorage well under its ~5MB budget and freezes the
// logo into the resume so it never depends on an external host.

const MAX_DIM = 256;

export async function fileToLogoDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  // WebP keeps transparency and is compact.
  return canvas.toDataURL('image/webp', 0.85);
}
