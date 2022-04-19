import useSize from '@react-hook/size';
import { MouseEvent as SyntheticMouseEvent, useRef } from 'react';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';

const BEACH_NATURAL_WIDTH = 1920;
const BEACH_NATURAL_HEIGHT = 1080;

const Scene = () => {
  const sceneRef = useRef(null);
  const [currentWidth, currentHeight] = useSize(sceneRef);

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

    console.log(`natural_x: ${naturalX}\tnatural_y: ${naturalY}`);
  };

  return (
    <div ref={sceneRef} onClick={handleClick} className={styles['scene']}>
      <img
        src={beachImage}
        alt="Where's Waldo scene"
        className={styles['scene-img']}
      />
    </div>
  );
};

export default Scene;
