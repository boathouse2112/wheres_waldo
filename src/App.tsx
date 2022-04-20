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

function App() {
  return (
    <div className={styles['app']}>
      <Scene />
    </div>
  );
}

export type { CharacterData, CharacterName };
export { CHARACTER_NAMES };
export default App;
