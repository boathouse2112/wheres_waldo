import useSize from '@react-hook/size';
import {
  MouseEvent as SyntheticMouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { CharacterName, NaturalCoord, PageCoord, RelativeCoord } from './App';
import { doesTargetMatchCharacter, setStartTime } from './firebase';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';
import TargetMenu, { TargetMenuData } from './TargetMenu';
import TargetOptions from './TargetOptions';

const BEACH_NATURAL_WIDTH = 1920;
const BEACH_NATURAL_HEIGHT = 1080;
const TARGET_CIRCLE_NATURAL_RADIUS = 70;

const Scene = () => {
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const [currentWidth, currentHeight] = useSize(imgRef);

  const [targetMenuData, setTargetMenuData] = useState<
    TargetMenuData | undefined
  >(undefined);
  const [successMarkerData, setSuccessMarkerData] = useState<TargetMenuData[]>(
    []
  );

  useEffect(() => {
    setStartTime();
  }, []);

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

    doesTargetMatchCharacter(naturalCoords, 'waldo').then((doesMatch) => {
      if (doesMatch) {
        console.log('matching character: waldo');
      }
    });

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

    const doesMatch = await doesTargetMatchCharacter(naturalCoords, name);
    console.log(
      `coords: [${naturalCoords.x}, ${naturalCoords.y}]\tmatch: ${doesMatch}`
    );
    if (doesMatch) {
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
