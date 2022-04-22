interface TargetCircleData {
  radius: number; // page-scaled circle radius
  color: string; // color of the circle
}

const TargetCircle = (props: TargetCircleData) => {
  const diameter = props.radius * 2;

  return (
    <div
      style={{
        width: diameter,
        height: diameter,
        borderRadius: props.radius,
        border: `7px solid ${props.color}`,
      }}
    ></div>
  );
};

export type { TargetCircleData };
export default TargetCircle;
