import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import { MAGIC_COLOR } from './ColorPicker';
import './FlagCanvas.css';

export interface FlagCanvasHandle {
  getImageData: () => ImageData | null;
  clear: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  paintHint: () => void;
}

interface FlagCanvasProps {
  aspectRatio: number; // width / height
  brushColor: string;
  brushSize: number;
  height?: number;
  startingColor?: string; // Background color for the canvas
  flagSrc: string; // URL of the flag image for hint detection
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

const FlagCanvas = forwardRef<FlagCanvasHandle, FlagCanvasProps>(
  ({ aspectRatio, brushColor, brushSize, height = 300, startingColor = '#FFFFFF', flagSrc }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const magicMaskRef = useRef<ImageData | null>(null);
    const animationRef = useRef<number>(0);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    const width = Math.round(height * aspectRatio);

    // Initialize canvas with starting color background
    const initCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = startingColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear magic mask
      magicMaskRef.current = null;

      // Clear overlay canvas
      const overlay = overlayRef.current;
      if (overlay) {
        const overlayCtx = overlay.getContext('2d');
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        }
      }
    }, [startingColor]);

    useEffect(() => {
      initCanvas();
    }, [initCanvas, width, height]);

    // Update magic pixel mask from main canvas
    const updateMagicMask = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Create mask tracking magic pixel positions
      const maskData = new ImageData(canvas.width, canvas.height);
      const mask = maskData.data;
      let hasMagicPixels = false;

      for (let i = 0; i < data.length; i += 4) {
        // Check if pixel is magic color (RGB: 255, 0, 255)
        if (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 255) {
          mask[i + 3] = 255; // Mark as magic pixel
          hasMagicPixels = true;
        }
      }

      magicMaskRef.current = hasMagicPixels ? maskData : null;
    }, []);

    // Calculate color difference (Euclidean distance in RGB space)
    const colorDifference = (
      r1: number, g1: number, b1: number,
      r2: number, g2: number, b2: number
    ): number => {
      return Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2)
      );
    };

    // Paint hint edges on the canvas
    const paintHint = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !flagSrc) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load the flag image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Create temporary canvas to get flag pixel data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Draw flag to temp canvas
        tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const flagData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const data = flagData.data;

        // Parameters for edge detection
        const radius = 3; // Check pixels within this radius
        const colorTolerance = 30; // Color difference threshold (accounts for antialiasing)

        // Find edge pixels
        const edgePixels: Array<{ x: number; y: number }> = [];

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r1 = data[idx];
            const g1 = data[idx + 1];
            const b1 = data[idx + 2];

            let isEdge = false;

            // Check neighboring pixels within radius
            for (let dy = -radius; dy <= radius && !isEdge; dy++) {
              for (let dx = -radius; dx <= radius && !isEdge; dx++) {
                if (dx === 0 && dy === 0) continue;

                const nx = x + dx;
                const ny = y + dy;

                // Skip out of bounds
                if (nx < 0 || nx >= canvas.width || ny < 0 || ny >= canvas.height) continue;

                // Only check pixels within circular radius
                if (dx * dx + dy * dy > radius * radius) continue;

                const nIdx = (ny * canvas.width + nx) * 4;
                const r2 = data[nIdx];
                const g2 = data[nIdx + 1];
                const b2 = data[nIdx + 2];

                const diff = colorDifference(r1, g1, b1, r2, g2, b2);
                if (diff > colorTolerance) {
                  isEdge = true;
                }
              }
            }

            if (isEdge) {
              edgePixels.push({ x, y });
            }
          }
        }

        // Paint edge pixels with magic color
        ctx.fillStyle = MAGIC_COLOR;
        for (const { x, y } of edgePixels) {
          ctx.fillRect(x, y, 1, 1);
        }

        // Update magic mask after painting
        updateMagicMask();
      };

      img.src = flagSrc;
    }, [flagSrc, updateMagicMask]);

    // Animation loop for magic pixels
    useEffect(() => {
      const animate = () => {
        const overlay = overlayRef.current;
        const mask = magicMaskRef.current;

        if (!overlay || !mask) {
          // Clear overlay if no magic pixels
          const overlayCtx = overlay?.getContext('2d');
          if (overlayCtx && overlay) {
            overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
          }
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const overlayCtx = overlay.getContext('2d');
        if (!overlayCtx) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        // Calculate current hue based on time (cycles every 2 seconds)
        const hue = (Date.now() / 20) % 360;
        const [r, g, b] = hslToRgb(hue, 1, 0.5);

        // Create colored overlay where magic pixels are
        const overlayData = overlayCtx.createImageData(overlay.width, overlay.height);
        const overlayPixels = overlayData.data;
        const maskPixels = mask.data;

        for (let i = 0; i < maskPixels.length; i += 4) {
          if (maskPixels[i + 3] === 255) {
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

    useImperativeHandle(ref, () => ({
      getImageData: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
      },
      clear: () => {
        initCanvas();
      },
      getCanvas: () => canvasRef.current,
      paintHint,
    }), [initCanvas, paintHint]);

    const getPosition = (
      e: React.MouseEvent | React.TouchEvent
    ): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const drawLine = (
      from: { x: number; y: number },
      to: { x: number; y: number }
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Update mask after any drawing (to handle painting over magic pixels)
      updateMagicMask();
    };

    const drawDot = (pos: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = brushColor;
      ctx.fill();

      // Update mask after any drawing (to handle painting over magic pixels)
      updateMagicMask();
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getPosition(e);
      lastPosRef.current = pos;
      drawDot(pos);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current || !lastPosRef.current) return;

      const pos = getPosition(e);
      drawLine(lastPosRef.current, pos);
      lastPosRef.current = pos;
    };

    const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    return (
      <div className="flag-canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="flag-canvas"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
        />
        <canvas
          ref={overlayRef}
          width={width}
          height={height}
          className="magic-overlay"
        />
      </div>
    );
  }
);

FlagCanvas.displayName = 'FlagCanvas';

export default FlagCanvas;
