import { useState, useCallback } from 'react';
import type { Country, Continent } from '../data/countries';
import { getRandomCountry } from '../data/countries';

export type GameScreen = 'menu' | 'drawing' | 'result';

interface GameResult {
  imageData: ImageData;
  percentage: number;
}

interface UseFlagGameReturn {
  screen: GameScreen;
  country: Country | null;
  continent: Continent | null;
  brushColor: string;
  brushSize: number;
  result: GameResult | null;
  startGame: (continent?: Continent) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  submitDrawing: (imageData: ImageData) => void;
  playAgain: () => void;
  backToMenu: () => void;
}

export function useFlagGame(): UseFlagGameReturn {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [country, setCountry] = useState<Country | null>(null);
  const [continent, setContinent] = useState<Continent | null>(null);
  const [brushColor, setBrushColorState] = useState<string>('#000000');
  const [brushSize, setBrushSizeState] = useState<number>(20);
  const [result, setResult] = useState<GameResult | null>(null);

  const startGame = useCallback((selectedContinent?: Continent) => {
    const newCountry = getRandomCountry(selectedContinent);
    setCountry(newCountry);
    setContinent(selectedContinent || null);
    // Set initial brush color to first color of the flag
    setBrushColorState(newCountry.colors[0]);
    setBrushSizeState(20);
    setResult(null);
    setScreen('drawing');
  }, []);

  const setColor = useCallback((color: string) => {
    setBrushColorState(color);
  }, []);

  const setBrushSize = useCallback((size: number) => {
    setBrushSizeState(size);
  }, []);

  const submitDrawing = useCallback((imageData: ImageData) => {
    // For now, we'll just store the image data
    // The percentage will be calculated by the FlagComparison component
    setResult({ imageData, percentage: 0 });
    setScreen('result');
  }, []);

  const playAgain = useCallback(() => {
    // Play again with same continent filter
    startGame(continent || undefined);
  }, [continent, startGame]);

  const backToMenu = useCallback(() => {
    setScreen('menu');
    setCountry(null);
    setContinent(null);
    setResult(null);
  }, []);

  return {
    screen,
    country,
    continent,
    brushColor,
    brushSize,
    result,
    startGame,
    setColor,
    setBrushSize,
    submitDrawing,
    playAgain,
    backToMenu,
  };
}
