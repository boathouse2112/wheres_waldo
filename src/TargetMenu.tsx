import { SyntheticEvent } from 'react';
import { CharacterName, CHARACTER_NAMES } from './App';

const TargetMenu = (props: {
  x: number;
  y: number;
  handleCharacterChoice: (
    x: number,
    y: number,
    name: CharacterName
  ) => Promise<void>;
}) => {
  // TODO: The absolute-position padding offsets are ruining everything.
  // I need a better way of thinking about coords.
  const drawMenu = () => {
    console.log(`menu-coords: [${props.x}, ${props.y}]`);

    return CHARACTER_NAMES.map((name) => {
      return (
        <li key={name} onClick={handleClick(name)}>
          {name}
        </li>
      );
    });
  };

  const handleClick = (name: CharacterName) => (e: SyntheticEvent) => {
    e.stopPropagation();
    props.handleCharacterChoice(props.x, props.y, name);
  };

  return <ul>{drawMenu()}</ul>;
};

export default TargetMenu;
