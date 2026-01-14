import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FlagComparison.css';

interface FlagComparisonProps {
  drawnImageData: ImageData;
  flagSrc: string;
  aspectRatio: number;
}

const TOLERANCE = 50; // ±50 per RGB channel - generous for hand-drawn comparisons

// Check if a pixel is magic color (RGB: 255, 0, 255)
function isMagicPixel(r: number, g: number, b: number): boolean {
  return r === 255 && g === 0 && b === 255;
}

// Helper to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

export default function FlagComparison({
  drawnImageData,
  flagSrc,
  aspectRatio,
}: FlagComparisonProps) {
  const { t } = useTranslation();
  const [percentage, setPercentage] = useState<number | null>(null);
  const [coverage, setCoverage] = useState<number | null>(null);
  const [diffDataUrl, setDiffDataUrl] = useState<string>('');
  const flagCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawnCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawnOverlayRef = useRef<HTMLCanvasElement>(null);
  const magicMaskRef = useRef<ImageData | null>(null);
  const animationRef = useRef<number>(0);

  const displayHeight = 150;
  const displayWidth = Math.round(displayHeight * aspectRatio);

  // Set up comparison and extract magic pixel mask
  useEffect(() => {
    const compareFlags = async () => {
      // Draw the original image to the drawn canvas
      const drawnCanvas = drawnCanvasRef.current;
      if (!drawnCanvas) return;

      drawnCanvas.width = drawnImageData.width;
      drawnCanvas.height = drawnImageData.height;
      const drawnCtx = drawnCanvas.getContext('2d');
      if (!drawnCtx) return;
      drawnCtx.putImageData(drawnImageData, 0, 0);

      // Create magic pixel mask
      const maskData = new ImageData(drawnImageData.width, drawnImageData.height);
      const mask = maskData.data;
      const drawnData = drawnImageData.data;
      let hasMagicPixels = false;

      for (let i = 0; i < drawnData.length; i += 4) {
        if (isMagicPixel(drawnData[i], drawnData[i + 1], drawnData[i + 2])) {
          mask[i + 3] = 255;
          hasMagicPixels = true;
        }
      }
      magicMaskRef.current = hasMagicPixels ? maskData : null;

      // Set up overlay canvas
      const overlay = drawnOverlayRef.current;
      if (overlay) {
        overlay.width = drawnImageData.width;
        overlay.height = drawnImageData.height;
      }

      // Load and rasterize the SVG flag
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const flagCanvas = flagCanvasRef.current;
        if (!flagCanvas) return;

        // Set flag canvas to same size as drawn canvas
        flagCanvas.width = drawnImageData.width;
        flagCanvas.height = drawnImageData.height;

        const flagCtx = flagCanvas.getContext('2d');
        if (!flagCtx) return;

        // Draw flag to canvas (rasterize SVG)
        flagCtx.drawImage(img, 0, 0, flagCanvas.width, flagCanvas.height);

        // Get flag image data
        const flagImageData = flagCtx.getImageData(
          0,
          0,
          flagCanvas.width,
          flagCanvas.height
        );

        // Compare pixels
        const flagData = flagImageData.data;
        const totalPixels = drawnData.length / 4;

        // Create diff canvas
        const diffCanvas = document.createElement('canvas');
        diffCanvas.width = drawnImageData.width;
        diffCanvas.height = drawnImageData.height;
        const diffCtx = diffCanvas.getContext('2d');
        if (!diffCtx) return;

        const diffImageData = diffCtx.createImageData(
          drawnImageData.width,
          drawnImageData.height
        );
        const diffData = diffImageData.data;

        let matchingPixels = 0;
        let magicPixels = 0;

        for (let i = 0; i < drawnData.length; i += 4) {
          const r = drawnData[i];
          const g = drawnData[i + 1];
          const b = drawnData[i + 2];

          // Check if this pixel is magic color
          if (isMagicPixel(r, g, b)) {
            magicPixels++;
            // Gray for magic pixels (excluded from comparison)
            diffData[i] = 128;
            diffData[i + 1] = 128;
            diffData[i + 2] = 128;
            diffData[i + 3] = 255;
            continue;
          }

          const rDiff = Math.abs(r - flagData[i]);
          const gDiff = Math.abs(g - flagData[i + 1]);
          const bDiff = Math.abs(b - flagData[i + 2]);

          const isMatch =
            rDiff <= TOLERANCE && gDiff <= TOLERANCE && bDiff <= TOLERANCE;

          if (isMatch) {
            matchingPixels++;
            // Green for match
            diffData[i] = 0;
            diffData[i + 1] = 200;
            diffData[i + 2] = 0;
            diffData[i + 3] = 255;
          } else {
            // Red for mismatch
            diffData[i] = 200;
            diffData[i + 1] = 0;
            diffData[i + 2] = 0;
            diffData[i + 3] = 255;
          }
        }

        diffCtx.putImageData(diffImageData, 0, 0);
        setDiffDataUrl(diffCanvas.toDataURL());

        // Calculate match percentage (excluding magic pixels)
        const comparedPixels = totalPixels - magicPixels;
        const matchPercentage = comparedPixels > 0
          ? Math.round((matchingPixels / comparedPixels) * 100)
          : 0;
        setPercentage(matchPercentage);

        // Calculate coverage (how much is NOT magic)
        const coveragePercentage = Math.round(((totalPixels - magicPixels) / totalPixels) * 100);
        setCoverage(coveragePercentage);
      };

      img.src = flagSrc;
    };

    compareFlags();
  }, [drawnImageData, flagSrc]);

  // Animation loop for magic pixels on drawn image - sliding rainbow gradient
  useEffect(() => {
    const animate = () => {
      const overlay = drawnOverlayRef.current;
      const mask = magicMaskRef.current;

      if (!overlay || !mask) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const overlayCtx = overlay.getContext('2d');
      if (!overlayCtx) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const canvasWidth = overlay.width;

      // Time offset for 2-second cycle (matches button animation)
      const timeOffset = ((Date.now() % 2000) / 2000) * 360;

      // Create colored overlay where magic pixels are
      const overlayData = overlayCtx.createImageData(overlay.width, overlay.height);
      const overlayPixels = overlayData.data;
      const maskPixels = mask.data;

      for (let i = 0; i < maskPixels.length; i += 4) {
        if (maskPixels[i + 3] === 255) {
          // Calculate x position for this pixel
          const pixelIndex = i / 4;
          const x = pixelIndex % canvasWidth;

          // Hue based on x position (rainbow gradient) plus time offset (sliding)
          const hue = ((x / canvasWidth) * 360 + timeOffset) % 360;
          const [r, g, b] = hslToRgb(hue, 1, 0.5);

          overlayPixels[i] = r;
          overlayPixels[i + 1] = g;
          overlayPixels[i + 2] = b;
          overlayPixels[i + 3] = 255;
        }
      }

      overlayCtx.putImageData(overlayData, 0, 0);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="flag-comparison">
      <div className="comparison-images">
        <div className="comparison-item">
          <h3>{t('game.yourDrawing')}</h3>
          <div className="drawn-image-container" style={{ width: displayWidth, height: displayHeight }}>
            <canvas
              ref={drawnCanvasRef}
              className="drawn-canvas"
            />
            <canvas
              ref={drawnOverlayRef}
              className="drawn-overlay"
            />
          </div>
        </div>

        <div className="comparison-item">
          <h3>{t('game.realFlag')}</h3>
          <canvas
            ref={flagCanvasRef}
            style={{ width: displayWidth, height: displayHeight }}
          />
        </div>

        <div className="comparison-item">
          <h3>{t('game.difference')}</h3>
          {diffDataUrl && (
            <img
              src={diffDataUrl}
              alt="Difference"
              style={{ width: displayWidth, height: displayHeight }}
            />
          )}
        </div>
      </div>

      <div className="stats-container">
        {percentage !== null && (
          <div className="match-percentage">
            <span className="percentage-value">{percentage}%</span>
            <span className="percentage-label">{t('game.match')}</span>
          </div>
        )}
        {coverage !== null && coverage < 100 && (
          <div className="coverage-percentage">
            <span className="coverage-value">{coverage}%</span>
            <span className="coverage-label">{t('game.coverage')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
