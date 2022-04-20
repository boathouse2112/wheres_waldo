import useSize from '@react-hook/size';
import { MouseEvent as SyntheticMouseEvent, useRef, useState } from 'react';
import { CharacterName, CHARACTER_NAMES } from './App';
import { getCharacterData } from './firebase';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';
import TargetCircle, { TargetCircleData } from './TargetCircle';

const BEACH_NATURAL_WIDTH = 1920;
const BEACH_NATURAL_HEIGHT = 1080;
const TARGET_CIRCLE_NATURAL_RADIUS = 80;

// Returns a single matching character, or undefined if no character matched
const matchingCharacter = async (
  targetX: number,
  targetY: number
): Promise<CharacterName | undefined> => {
  for (const characterName of CHARACTER_NAMES) {
    const characterData = await getCharacterData(
      characterName as CharacterName
    );
    if (characterData !== undefined) {
      const { x, y, radius } = characterData;

      // Check if the target coord is within the character-radius of the character coord
      const xDistance = x - targetX;
      const yDistance = y - targetY;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

      if (distance <= radius) {
        return characterName as CharacterName;
      }
    }
  }

  return undefined;
};

const Scene = () => {
  const sceneRef = useRef(null);
  const [currentWidth, currentHeight] = useSize(sceneRef);

  const [targetCircleData, setTargetCircleData] = useState<
    TargetCircleData | undefined
  >(undefined);

  const handleClick = (e: SyntheticMouseEvent<Element, MouseEvent>) => {
    // Get relative click coords inside the Scene div
    const currentTargetRect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.pageX - currentTargetRect.left;
    const relativeY = e.pageY - currentTargetRect.top;

    // Get click coords scaled up to the natural size of the image.
    const naturalX = Math.floor(
      (BEACH_NATURAL_WIDTH / currentWidth) * relativeX
    );
    const naturalY = Math.floor(
      (BEACH_NATURAL_HEIGHT / currentHeight) * relativeY
    );

    console.log(`x: ${naturalX}\ty: ${naturalY}`);
    matchingCharacter(naturalX, naturalY).then((character) =>
      console.log('matching character: ', character)
    );

    // Create a TargetCircle with absolute position and window-scaled radius.
    const windowScaledRadius =
      (currentWidth / BEACH_NATURAL_WIDTH) * TARGET_CIRCLE_NATURAL_RADIUS;

    setTargetCircleData({
      x: e.pageX,
      y: e.pageY,
      radius: windowScaledRadius,
    });
  };

  return (
    <div ref={sceneRef} onClick={handleClick} className={styles['scene']}>
      <img
        src={beachImage}
        alt="Where's Waldo scene"
        className={styles['scene-img']}
      />
      {targetCircleData && <TargetCircle {...targetCircleData} />}
    </div>
  );
};

export default Scene;
