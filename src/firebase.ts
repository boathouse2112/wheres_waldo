import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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
const db = getDatabase(app);

const getCoordinates = (imageID: string) => {};

export { getCoordinates };
