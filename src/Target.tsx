import { PropsWithChildren } from 'react';
import styles from './Target.module.css';
import TargetCircle from './TargetCircle';

interface TargetData {
  x: number; // page-scaled x, relative to scene
  y: number; // page-scaled y, relative to scene
  radius: number; // page-scaled circle radius
  color: string; // color of the circle
}

const Target = (props: PropsWithChildren<TargetData>) => {
  return (
    <div
      className={styles['target']}
      style={{
        left: props.x - props.radius,
        top: props.y - props.radius,
        gap: props.radius * 0.25,
      }}
    >
      <TargetCircle {...props} />
      {props.children}
    </div>
  );
};

export type { TargetData };

export default Target;
