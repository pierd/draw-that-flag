import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
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

const FlagCanvas = forwardRef<FlagCanvasHandle, FlagCanvasProps>(
  ({ aspectRatio, brushColor, brushSize, height = 300, startingColor = '#FFFFFF' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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
    }, [startingColor]);

    useEffect(() => {
      initCanvas();
    }, [initCanvas, width, height]);

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
    );
  }
);

FlagCanvas.displayName = 'FlagCanvas';

export default FlagCanvas;
