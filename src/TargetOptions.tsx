import { SyntheticEvent } from 'react';
import { CharacterName, CHARACTER_NAMES } from './App';

const TargetOptions = (props: {
  handleCharacterChoice: (name: CharacterName) => Promise<void>;
}) => {
  const drawMenu = () => {
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
    props.handleCharacterChoice(name);
  };

  return <ul>{drawMenu()}</ul>;
};

export default TargetOptions;
