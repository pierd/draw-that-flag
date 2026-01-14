import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from 'lessismore-react';
import { supportedLanguages, languageFlags } from './i18n';
import type { Continent } from './data/countries';
import { continentEmojis } from './data/countries';
import { getFlagSrc } from './data/flagImports';
import { useFlagGame } from './hooks/useFlagGame';
import FlagCanvas from './components/FlagCanvas';
import type { FlagCanvasHandle } from './components/FlagCanvas';
import ColorPicker from './components/ColorPicker';
import BrushSizeSlider from './components/BrushSizeSlider';
import FlagComparison from './components/FlagComparison';
import './App.css';

const continents: Continent[] = [
  'Europe',
  'Asia',
  'Africa',
  'North America',
  'South America',
  'Oceania',
];

function App() {
  const { t } = useTranslation();
  const canvasRef = useRef<FlagCanvasHandle>(null);
  const {
    screen,
    country,
    brushColor,
    brushSize,
    startingColor,
    result,
    startGame,
    setColor,
    setBrushSize,
    submitDrawing,
    playAgain,
    backToMenu,
  } = useFlagGame();

  const handleDone = () => {
    const imageData = canvasRef.current?.getImageData();
    if (imageData) {
      submitDrawing(imageData);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleHint = () => {
    canvasRef.current?.paintHint();
  };

  return (
    <div className="app">
      <div className="background-grid" />
      <div className="background-glow" />

      <LanguageSelector languages={supportedLanguages} flags={languageFlags} />

      <header className="header">
        <h1 className="title">
          <span className="title-icon">🎨</span>
          {t('app.title')}
        </h1>
        {screen === 'menu' && <p className="subtitle">{t('app.subtitle')}</p>}
      </header>

      <main className="main">
        {/* Menu Screen */}
        {screen === 'menu' && (
          <div className="menu-screen">
            <button
              className="play-button"
              onClick={() => startGame()}
            >
              <span className="play-icon">🌍</span>
              <span className="play-text">{t('game.play')}</span>
              <span className="play-description">{t('game.playDescription')}</span>
            </button>

            <div className="continent-buttons">
              <div className="continent-buttons-row">
                {continents.slice(0, 3).map((continent) => (
                  <button
                    key={continent}
                    className="continent-btn"
                    onClick={() => startGame(continent)}
                  >
                    <span className="continent-emoji">{continentEmojis[continent]}</span>
                    <span className="continent-name">{t(`continents.${continent}`)}</span>
                  </button>
                ))}
              </div>
              <div className="continent-buttons-row">
                {continents.slice(3).map((continent) => (
                  <button
                    key={continent}
                    className="continent-btn"
                    onClick={() => startGame(continent)}
                  >
                    <span className="continent-emoji">{continentEmojis[continent]}</span>
                    <span className="continent-name">{t(`continents.${continent}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drawing Screen */}
        {screen === 'drawing' && country && (
          <div className="drawing-screen">
            <h2 className="country-name">{t(`countries.${country.name}`)}</h2>

            <div className="canvas-container">
              <FlagCanvas
                ref={canvasRef}
                aspectRatio={country.aspectRatio}
                brushColor={brushColor}
                brushSize={brushSize}
                startingColor={startingColor}
                flagSrc={getFlagSrc(country.isoCode)}
              />
            </div>

            <div className="controls">
              <div className="controls-left">
                <ColorPicker
                  colors={country.colors}
                  selectedColor={brushColor}
                  onColorSelect={setColor}
                />
              </div>
              <div className="controls-right">
                <BrushSizeSlider
                  size={brushSize}
                  onSizeChange={setBrushSize}
                />
              </div>
            </div>

            <div className="action-buttons">
              <button className="button button-secondary" onClick={handleClear}>
                {t('game.clear')}
              </button>
              <button className="button button-secondary" onClick={handleHint}>
                {t('game.hint')}
              </button>
              <button className="button button-primary" onClick={handleDone}>
                {t('game.done')}
              </button>
            </div>

            <button className="button button-tertiary" onClick={backToMenu}>
              {t('game.backToMenu')}
            </button>
          </div>
        )}

        {/* Result Screen */}
        {screen === 'result' && country && result && (
          <div className="result-screen">
            <h2 className="country-name">{t(`countries.${country.name}`)}</h2>

            <FlagComparison
              drawnImageData={result.imageData}
              flagSrc={getFlagSrc(country.isoCode)}
              aspectRatio={country.aspectRatio}
            />

            <div className="result-buttons">
              <button className="button button-primary" onClick={playAgain}>
                {t('game.playAgain')}
              </button>
              <button className="button button-secondary" onClick={backToMenu}>
                {t('game.backToMenu')}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>{t('app.footer')}</span>
      </footer>
    </div>
  );
}

export default App;
