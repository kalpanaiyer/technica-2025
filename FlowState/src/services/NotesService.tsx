import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const getUserNotes = async (userId: string): Promise<number> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data().notes || 0;
    } else {
      await setDoc(userDoc, { notes: 0 });
      return 0;
    }
  } catch (error) {
    console.error('Error getting user notes:', error);
    return 0;
  }
};

export const addNotesToUser = async (userId: string, notesToAdd: number): Promise<number> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    
    let currentNotes = 0;
    
    if (docSnap.exists()) {
      currentNotes = docSnap.data().notes || 0;
    }
    
    const newTotal = currentNotes + notesToAdd;
    
    await setDoc(userDoc, { notes: newTotal }, { merge: true });
    
    return newTotal;
  } catch (error) {
    console.error('Error adding notes:', error);
    throw error;
  }
};

export const setUserNotes = async (userId: string, notes: number): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, { notes }, { merge: true });
  } catch (error) {
    console.error('Error setting user notes:', error);
    throw error;
  }
};