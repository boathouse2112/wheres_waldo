import useSize from '@react-hook/size';
import { MouseEvent as SyntheticMouseEvent, useRef, useState } from 'react';
import { CharacterName, CHARACTER_NAMES } from './App';
import { getCharacterData } from './firebase';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';
import Target, { TargetData } from './Target';
import TargetMenu from './TargetMenu';

const BEACH_NATURAL_WIDTH = 1920;
const BEACH_NATURAL_HEIGHT = 1080;
const TARGET_CIRCLE_NATURAL_RADIUS = 70;

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
  const imgRef = useRef(null);
  const [currentWidth, currentHeight] = useSize(imgRef);

  const [targetData, setTargetData] = useState<TargetData | undefined>(
    undefined
  );

  const [successMarkerData, setSuccessMarkerData] = useState<TargetData[]>([]);

  const createTarget = (x: number, y: number) => {
    // Create a Target with a menu
    const windowScaledRadius =
      (currentWidth / BEACH_NATURAL_WIDTH) * TARGET_CIRCLE_NATURAL_RADIUS;

    setTargetData({
      x,
      y,
      radius: windowScaledRadius,
      color: 'black',
    });
  };

  const createSuccessMarker = (x: number, y: number) => {
    const windowScaledRadius =
      (currentWidth / BEACH_NATURAL_WIDTH) * TARGET_CIRCLE_NATURAL_RADIUS;

    setSuccessMarkerData([
      { x, y, radius: windowScaledRadius, color: 'green' },
      ...successMarkerData,
    ]);
  };

  const drawSuccessMarkers = () => {
    return successMarkerData.map((data) => <Target {...data} />);
  };

  const naturalCoords = (x: number, y: number) => {
    const naturalX = Math.floor((BEACH_NATURAL_WIDTH / currentWidth) * x);
    const naturalY = Math.floor((BEACH_NATURAL_HEIGHT / currentHeight) * y);

    return { x: naturalX, y: naturalY };
  };

  const handleClick = (e: SyntheticMouseEvent<Element, MouseEvent>) => {
    // Get relative click coords inside the Scene div
    const currentTargetRect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.pageX - currentTargetRect.left;
    const relativeY = e.pageY - currentTargetRect.top;

    const { x: naturalX, y: naturalY } = naturalCoords(relativeX, relativeY);

    console.log(`x: ${naturalX}\ty: ${naturalY}`);
    matchingCharacter(naturalX, naturalY).then((character) =>
      console.log('matching character: ', character)
    );

    if (targetData === undefined) {
      createTarget(e.pageX, e.pageY);
    } else {
      setTargetData(undefined);
    }
  };

  const handleCharacterChoice = async (
    x: number,
    y: number,
    name: CharacterName
  ) => {
    // TODO: the coords are fucked.
    setTargetData(undefined);

    const { x: naturalX, y: naturalY } = naturalCoords(x, y);

    console.log(
      `Character choice --\tx: ${naturalX}\ty: ${naturalY}\tname: ${name}`
    );

    const match = await matchingCharacter(naturalX, naturalY);
    console.log(`match: ${match}`);
    if (match === name) {
      createSuccessMarker(x, y);
    }
  };

  return (
    <div onClick={handleClick} className={styles['scene']}>
      <img
        ref={imgRef}
        src={beachImage}
        alt="Where's Waldo scene"
        className={styles['scene-img']}
      />
      {successMarkerData.length !== 0 && drawSuccessMarkers()}
      {targetData && (
        <Target {...targetData}>
          <TargetMenu
            x={targetData.x}
            y={targetData.y}
            handleCharacterChoice={handleCharacterChoice}
          />
        </Target>
      )}
    </div>
  );
};

export default Scene;
