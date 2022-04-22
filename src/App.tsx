import React from 'react';
import styles from './App.module.css';
import Scene from './Scene';

const CHARACTER_NAMES = ['odlaw', 'waldo', 'whitebeard'] as const;
type CharacterName = typeof CHARACTER_NAMES[number];

interface CharacterData {
  x: number;
  y: number;
  radius: number;
}

// Coordinate definitions
// Absolute position on page
interface PageCoord {
  x: number;
  y: number;
}

// Position relative to image origin. Page-scale
interface RelativeCoord {
  x: number;
  y: number;
}

// Position relative to image origin. Scaled to the image's natural size (eg. 1920x1080)
interface NaturalCoord {
  x: number;
  y: number;
}

function App() {
  return (
    <div className={styles['app']}>
      <Scene />
    </div>
  );
}

export type {
  CharacterData,
  CharacterName,
  PageCoord,
  RelativeCoord,
  NaturalCoord,
};
export { CHARACTER_NAMES };
export default App;
