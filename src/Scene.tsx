import beachImage from './resources/beach.jpg';
import styles from './Scene.module.css';

const Scene = () => {
  return (
    <div>
      <img
        src={beachImage}
        alt="Where's Waldo scene"
        className={styles['scene-img']}
      />
    </div>
  );
};

export default Scene;
