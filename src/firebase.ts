import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { CharacterData, CharacterName } from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyByjydA86rL9fyUl-_Tpnvyw7Z9g5hNRKM',
  authDomain: 'where-s-waldo-46cdf.firebaseapp.com',
  databaseURL: 'https://where-s-waldo-46cdf-default-rtdb.firebaseio.com',
  projectId: 'where-s-waldo-46cdf',
  storageBucket: 'where-s-waldo-46cdf.appspot.com',
  messagingSenderId: '203220912632',
  appId: '1:203220912632:web:fc304dab9b37ede2582e0d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const characterDocRef = doc(db, 'images', 'beach');

const getCharacterData = async (
  name: CharacterName
): Promise<CharacterData | undefined> => {
  const characterDocSnap = await getDoc(characterDocRef);

  if (characterDocSnap.exists()) {
    const docData = characterDocSnap.data();
    const characters = docData.characters;
    const characterData = characters[name];
    return {
      x: characterData.x,
      y: characterData.y,
      radius: characterData.radius,
    };
  }
};

export { getCharacterData };
