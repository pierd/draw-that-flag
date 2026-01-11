import './BrushSizeSlider.css';

interface BrushSizeSliderProps {
  size: number;
  onSizeChange: (size: number) => void;
  min?: number;
  max?: number;
}

export default function BrushSizeSlider({
  size,
  onSizeChange,
  min = 5,
  max = 50,
}: BrushSizeSliderProps) {
  return (
    <div className="brush-size-slider">
      <div className="brush-size-controls">
        <input
          type="range"
          min={min}
          max={max}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="brush-slider"
        />
        <div className="brush-preview-container">
          <div
            className="brush-preview"
            style={{
              width: size,
              height: size,
            }}
          />
        </div>
      </div>
    </div>
  );
}
