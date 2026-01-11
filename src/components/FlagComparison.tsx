import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FlagComparison.css';

interface FlagComparisonProps {
  drawnImageData: ImageData;
  flagSrc: string;
  aspectRatio: number;
}

const TOLERANCE = 50; // ±50 per RGB channel - generous for hand-drawn comparisons

export default function FlagComparison({
  drawnImageData,
  flagSrc,
  aspectRatio,
}: FlagComparisonProps) {
  const { t } = useTranslation();
  const [percentage, setPercentage] = useState<number | null>(null);
  const [diffDataUrl, setDiffDataUrl] = useState<string>('');
  const [drawnDataUrl, setDrawnDataUrl] = useState<string>('');
  const flagCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const compareFlags = async () => {
      // Create a canvas from drawn image data
      const drawnCanvas = document.createElement('canvas');
      drawnCanvas.width = drawnImageData.width;
      drawnCanvas.height = drawnImageData.height;
      const drawnCtx = drawnCanvas.getContext('2d');
      if (!drawnCtx) return;
      drawnCtx.putImageData(drawnImageData, 0, 0);
      setDrawnDataUrl(drawnCanvas.toDataURL());

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
        const drawnData = drawnImageData.data;
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

        for (let i = 0; i < drawnData.length; i += 4) {
          const rDiff = Math.abs(drawnData[i] - flagData[i]);
          const gDiff = Math.abs(drawnData[i + 1] - flagData[i + 1]);
          const bDiff = Math.abs(drawnData[i + 2] - flagData[i + 2]);

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

        const matchPercentage = Math.round((matchingPixels / totalPixels) * 100);
        setPercentage(matchPercentage);
      };

      img.src = flagSrc;
    };

    compareFlags();
  }, [drawnImageData, flagSrc]);

  const displayHeight = 150;
  const displayWidth = Math.round(displayHeight * aspectRatio);

  return (
    <div className="flag-comparison">
      <div className="comparison-images">
        <div className="comparison-item">
          <h3>{t('game.yourDrawing')}</h3>
          {drawnDataUrl && (
            <img
              src={drawnDataUrl}
              alt="Your drawing"
              style={{ width: displayWidth, height: displayHeight }}
            />
          )}
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

      {percentage !== null && (
        <div className="match-percentage">
          <span className="percentage-value">{percentage}%</span>
          <span className="percentage-label">{t('game.match')}</span>
        </div>
      )}
    </div>
  );
}
