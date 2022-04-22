import useSize from '@react-hook/size';
import {
  MouseEvent as SyntheticMouseEvent,
  RefObject,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import {
  CharacterName,
  CHARACTER_NAMES,
  NaturalCoord,
  PageCoord,
  RelativeCoord,
} from './App';
import { getCharacterData } from './firebase';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';
import TargetMenu, { TargetMenuData } from './TargetMenu';
import TargetOptions from './TargetOptions';

const BEACH_NATURAL_WIDTH = 1920;
const BEACH_NATURAL_HEIGHT = 1080;
const TARGET_CIRCLE_NATURAL_RADIUS = 70;

// TODO: This shouldn't be here
// Returns a single matching character, or undefined if no character matched
const matchingCharacter = async (
  target: NaturalCoord
): Promise<CharacterName | undefined> => {
  const { x: targetX, y: targetY } = target;

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
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const [currentWidth, currentHeight] = useSize(imgRef);

  const [targetMenuData, setTargetMenuData] = useState<
    TargetMenuData | undefined
  >(undefined);
  const [successMarkerData, setSuccessMarkerData] = useState<TargetMenuData[]>(
    []
  );

  const createTargetMenu = (coords: PageCoord) => {
    // Create a Target with a menu
    const windowScaledRadius =
      (currentWidth / BEACH_NATURAL_WIDTH) * TARGET_CIRCLE_NATURAL_RADIUS;

    setTargetMenuData({
      coords,
      radius: windowScaledRadius,
      color: 'black',
    });
  };

  const clearTargetMenu = () => {
    setTargetMenuData(undefined);
  };

  const createSuccessMarker = (coords: RelativeCoord) => {
    const windowScaledRadius =
      (currentWidth / BEACH_NATURAL_WIDTH) * TARGET_CIRCLE_NATURAL_RADIUS;

    setSuccessMarkerData([
      {
        coords: getPageCoords(coords),
        radius: windowScaledRadius,
        color: 'green',
      },
      ...successMarkerData,
    ]);
  };

  const getPageCoords = (coords: RelativeCoord): PageCoord => {
    const { x, y } = coords;
    const imgRect = imgRef.current?.getBoundingClientRect();

    if (imgRect !== undefined) {
      const pageX = x + imgRect.left;
      const pageY = y + imgRect.top;
      return { x: pageX, y: pageY };
    } else {
      throw new Error('Scene imgRef is null.');
    }
  };

  const getRelativeCoords = (coords: PageCoord): RelativeCoord => {
    const { x, y } = coords;
    const imgRect = imgRef.current?.getBoundingClientRect();

    if (imgRect !== undefined) {
      const relativeX = x - imgRect.left;
      const relativeY = y - imgRect.top;
      return { x: relativeX, y: relativeY };
    } else {
      throw new Error('Scene imgRef is null.');
    }
  };

  const getNaturalCoords = (coords: RelativeCoord): NaturalCoord => {
    const { x, y } = coords;
    const naturalX = Math.floor((BEACH_NATURAL_WIDTH / currentWidth) * x);
    const naturalY = Math.floor((BEACH_NATURAL_HEIGHT / currentHeight) * y);

    return { x: naturalX, y: naturalY };
  };

  const handleClick = (e: SyntheticMouseEvent<Element, MouseEvent>) => {
    const pageCoords = { x: e.pageX, y: e.pageY };
    const relativeCoords = getRelativeCoords(pageCoords);
    const naturalCoords = getNaturalCoords(relativeCoords);

    console.log(`x: ${naturalCoords.x}\ty: ${naturalCoords.y}`);
    matchingCharacter(naturalCoords).then((character) =>
      console.log('matching character: ', character)
    );

    if (targetMenuData === undefined) {
      createTargetMenu(pageCoords);
    } else {
      clearTargetMenu();
    }
  };

  const handleCharacterChoice = async (
    coords: RelativeCoord,
    name: CharacterName
  ) => {
    const relativeCoords = coords;
    const naturalCoords = getNaturalCoords(relativeCoords);

    clearTargetMenu();

    console.log(
      `Character choice --\tx: ${naturalCoords.x}\ty: ${naturalCoords.y}\tname: ${name}`
    );

    const match = await matchingCharacter(naturalCoords);
    console.log(`match: ${match}`);
    if (match === name) {
      createSuccessMarker(relativeCoords);
    }
  };

  const drawSuccessMarkers = () => {
    return successMarkerData.map((data) => (
      <TargetMenu key={uuid()} {...data} />
    ));
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
      {targetMenuData && (
        <TargetMenu {...targetMenuData}>
          <TargetOptions
            handleCharacterChoice={(name) =>
              handleCharacterChoice(
                getRelativeCoords(targetMenuData.coords),
                name
              )
            }
          />
        </TargetMenu>
      )}
    </div>
  );
};

export default Scene;
