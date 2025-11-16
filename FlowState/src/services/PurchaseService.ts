import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const getUserPurchases = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data().purchases || [];
    } else {
      await setDoc(userDoc, { purchases: [] });
      return [];
    }
  } catch (err) {
    console.error('Error getting purchases:', err);
    return [];
  }
};

export const addPurchaseForUser = async (userId: string, itemName: string): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    // ensure doc exists then push to purchases array
    await updateDoc(userDoc, { purchases: arrayUnion(itemName) });
  } catch (err: any) {
    // if updateDoc fails because doc doesn't exist, create it with purchases
    if (err?.code === 'not-found' || err?.message?.includes('No document to update')) {
      try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, { purchases: [itemName] }, { merge: true });
        return;
      } catch (e) {
        console.error('Error creating purchases array:', e);
        throw e;
      }
    }
    console.error('Error adding purchase:', err);
    throw err;
  }
};
