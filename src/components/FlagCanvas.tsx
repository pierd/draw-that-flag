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
}

interface FlagCanvasProps {
  aspectRatio: number; // width / height
  brushColor: string;
  brushSize: number;
  height?: number;
  startingColor?: string; // Background color for the canvas
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
  ({ aspectRatio, brushColor, brushSize, height = 300, startingColor = '#FFFFFF' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const magicMaskRef = useRef<ImageData | null>(null);
    const animationRef = useRef<number>(0);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    const width = Math.round(height * aspectRatio);

    // Check if current brush is magic color
    const isMagicBrush = brushColor === MAGIC_COLOR;

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
    }));

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

      // Update mask if drawing with magic color
      if (isMagicBrush) {
        updateMagicMask();
      }
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

      // Update mask if drawing with magic color
      if (isMagicBrush) {
        updateMagicMask();
      }
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
