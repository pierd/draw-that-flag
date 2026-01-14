import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './ColorPicker.css';

// Magic color constant - used to identify "skip" pixels in comparison
export const MAGIC_COLOR = '#FF00FF';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ColorPicker({
  colors,
  selectedColor,
  onColorSelect,
}: ColorPickerProps) {
  const { t } = useTranslation();
  // Shuffle colors once when the colors array changes (new country)
  const shuffledColors = useMemo(() => shuffleArray(colors), [colors]);

  return (
    <div className="color-picker">
      {/* Magic color button - always first */}
      <button
        className={`color-btn color-btn-magic ${selectedColor === MAGIC_COLOR ? 'selected' : ''}`}
        onClick={() => onColorSelect(MAGIC_COLOR)}
        aria-label={t('game.magicColor')}
        title={t('game.magicColor')}
      />
      {shuffledColors.map((color) => (
        <button
          key={color}
          className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          aria-label={`Select color ${color}`}
          title={color}
        />
      ))}
    </div>
  );
}
