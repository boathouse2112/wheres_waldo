import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../config.js';
import { CharacterData, CharacterName, NaturalCoord } from './App';

const SET_START_TIME_URL =
  'http://localhost:5001/where-s-waldo-46cdf/us-central1/setStartTime?';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const characterDocRef = doc(db, 'images', 'beach');

const auth = getAuth();
signInAnonymously(auth);
const userID: Promise<string> = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid;
      resolve(userID);
    }
  });
});

const setStartTime = async () => {
  const id = await userID;
  fetch(
    SET_START_TIME_URL +
      new URLSearchParams({
        id: id,
      }),
    { mode: 'no-cors' }
  );
};

const getCharacterData = async (
  name: CharacterName
): Promise<CharacterData> => {
  const characterDocSnap = await getDoc(characterDocRef);

  if (characterDocSnap.exists()) {
    const docData = characterDocSnap.data();
    const characters = docData.characters;
    const characterData = characters[name];
    return {
      coords: { x: characterData.x, y: characterData.y },
      radius: characterData.radius,
    };
  } else {
    throw new Error(`Could not find character ${name} in database.`);
  }
};

// Returns whether
const doesTargetMatchCharacter = async (
  targetCoords: NaturalCoord,
  name: CharacterName
): Promise<boolean> => {
  const { x: targetX, y: targetY } = targetCoords;

  const characterData = await getCharacterData(name);

  const { coords: characterCoords, radius } = characterData;
  const { x: characterX, y: characterY } = characterCoords;

  // Check if the target coord is within the character-radius of the character coord
  const xDistance = characterX - targetX;
  const yDistance = characterY - targetY;
  const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

  return distance <= radius;
};

export { setStartTime, getCharacterData, doesTargetMatchCharacter };
