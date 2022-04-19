// x: page-scaled x, relative to page
// y: page-scaled y, relative to page
// radius: page-scaled circle radius
interface TargetCircleData {
  x: number; // page-scaled x, relative to scene
  y: number; // page-scaled y, relative to scene
  radius: number; // page-scaled circle radius
}

const TargetCircle = (props: TargetCircleData) => {
  const diameter = props.radius * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: props.x - props.radius,
        top: props.y - props.radius,
        width: diameter,
        height: diameter,
        borderRadius: props.radius,
        border: '5px solid green',
      }}
    ></div>
  );
};

export type { TargetCircleData };
export default TargetCircle;
