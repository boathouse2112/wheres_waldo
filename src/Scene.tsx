import { MouseEvent as SyntheticMouseEvent } from 'react';
import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';

const Scene = () => {
  const handleClick = (e: SyntheticMouseEvent<Element, MouseEvent>) => {
    // TODO: Using pageX and pageY breaks if the scene doesn't start at (0, 0) in the page.
    console.log(`x: ${e.pageX}\ty: ${e.pageY}`);
  };

  return (
    <div onClick={handleClick}>
      <img
        src={beachImage}
        alt="Where's Waldo scene"
        className={styles['scene-img']}
      />
    </div>
  );
};

export default Scene;
