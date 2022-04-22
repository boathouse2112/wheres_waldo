import { PropsWithChildren } from 'react';
import { PageCoord } from './App';
import styles from './Target.module.css';
import TargetCircle from './TargetCircle';

interface TargetMenuData {
  coords: PageCoord; // circle center point
  radius: number; // circle radius
  color: string; // color of the circle
}

const TargetMenu = (props: PropsWithChildren<TargetMenuData>) => {
  return (
    <div
      className={styles['target']}
      style={{
        left: props.coords.x - props.radius,
        top: props.coords.y - props.radius,
        gap: props.radius * 0.25,
      }}
    >
      <TargetCircle {...props} />
      {props.children}
    </div>
  );
};

export type { TargetMenuData };

export default TargetMenu;
